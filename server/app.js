import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { researchQuestion } from './research.js';

const SESSION_COOKIE = 'raev_owner_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 16_384;

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

function safeEqual(left, right) {
  const leftHash = createHash('sha256').update(String(left)).digest();
  const rightHash = createHash('sha256').update(String(right)).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map(part => {
    const [name, ...rest] = part.trim().split('=');
    return [name, decodeURIComponent(rest.join('='))];
  }).filter(([name]) => name));
}

function createSession(secret) {
  const payload = Buffer.from(JSON.stringify({
    exp: Date.now() + SESSION_TTL_MS,
    nonce: randomBytes(16).toString('hex')
  })).toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function validSession(token, secret) {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  if (!safeEqual(signature, expected)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number.isFinite(parsed.exp) && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

function sendJson(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
    ...headers
  });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error('Request body is too large.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Request body must be valid JSON.');
    error.statusCode = 400;
    throw error;
  }
}

function clientKey(req) {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
}

function createRateLimiter({ limit, windowMs }) {
  const attempts = new Map();
  return key => {
    const now = Date.now();
    const recent = (attempts.get(key) || []).filter(timestamp => timestamp > now - windowMs);
    recent.push(now);
    attempts.set(key, recent);
    return recent.length <= limit;
  };
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

async function serveFile(res, path, method) {
  const info = await stat(path).catch(() => null);
  if (!info?.isFile()) return false;
  res.writeHead(200, {
    'cache-control': extname(path) === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    'content-length': info.size,
    'content-type': CONTENT_TYPES[extname(path)] || 'application/octet-stream'
  });
  if (method === 'HEAD') res.end();
  else createReadStream(path).pipe(res);
  return true;
}

export function createRaevServer(options = {}) {
  const configuredPin = options.ownerPin || process.env.RAEV_OWNER_PIN || process.env.OWNER_PIN;
  if (!configuredPin && process.env.NODE_ENV === 'production') {
    throw new Error('RAEV_OWNER_PIN must be configured in production.');
  }
  const ownerPin = configuredPin || '3520';
  const sessionSecret = options.sessionSecret || process.env.SESSION_SECRET || randomBytes(32).toString('hex');
  const distDir = resolve(options.distDir || 'dist');
  const research = options.research || researchQuestion;
  const allowUnlock = createRateLimiter({ limit: 8, windowMs: 15 * 60 * 1000 });
  const allowResearch = createRateLimiter({ limit: 30, windowMs: 10 * 60 * 1000 });

  return createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const isApi = url.pathname.startsWith('/api/');

    try {
      if (isApi && !sameOrigin(req)) {
        return sendJson(res, 403, { error: 'Cross-origin requests are not allowed.', code: 'invalid_origin' });
      }

      if (req.method === 'GET' && url.pathname === '/api/health') {
        return sendJson(res, 200, {
          ok: true,
          researcherConfigured: Boolean(process.env.OPENAI_API_KEY),
          model: process.env.OPENAI_MODEL || 'gpt-5.4-mini'
        });
      }

      if (req.method === 'GET' && url.pathname === '/api/auth/status') {
        const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
        return sendJson(res, 200, { authenticated: validSession(token, sessionSecret) });
      }

      if (req.method === 'POST' && url.pathname === '/api/auth/unlock') {
        if (!allowUnlock(clientKey(req))) {
          return sendJson(res, 429, { error: 'Too many PIN attempts. Try again later.', code: 'rate_limited' });
        }
        const { pin } = await readJson(req);
        if (!safeEqual(pin || '', ownerPin)) {
          return sendJson(res, 401, { error: 'Incorrect PIN.', code: 'invalid_pin' });
        }
        const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
        return sendJson(res, 200, { authenticated: true }, {
          'set-cookie': `${SESSION_COOKIE}=${createSession(sessionSecret)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_MS / 1000}${secure}`
        });
      }

      if (req.method === 'POST' && url.pathname === '/api/auth/lock') {
        return sendJson(res, 200, { authenticated: false }, {
          'set-cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
        });
      }

      if (req.method === 'POST' && url.pathname === '/api/research') {
        const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
        if (!validSession(token, sessionSecret)) {
          return sendJson(res, 401, { error: 'Owner access is required.', code: 'not_authenticated' });
        }
        if (!allowResearch(clientKey(req))) {
          return sendJson(res, 429, { error: 'Research limit reached. Try again shortly.', code: 'rate_limited' });
        }

        const { question, allowWeb = false } = await readJson(req);
        if (typeof question !== 'string' || question.trim().length < 2 || question.length > 2000) {
          return sendJson(res, 400, { error: 'Question must be between 2 and 2,000 characters.', code: 'invalid_question' });
        }
        if (typeof allowWeb !== 'boolean') {
          return sendJson(res, 400, { error: 'Invalid web research preference.', code: 'invalid_web_preference' });
        }

        const result = await research({ question: question.trim(), allowWeb });
        return sendJson(res, 200, result);
      }

      if (isApi) {
        return sendJson(res, 404, { error: 'API route not found.', code: 'not_found' });
      }

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { allow: 'GET, HEAD' });
        return res.end();
      }

      const requestPath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
      const candidate = resolve(join(distDir, requestPath === '/' ? 'index.html' : requestPath));
      if (candidate.startsWith(`${distDir}/`) && await serveFile(res, candidate, req.method)) return;

      const indexPath = join(distDir, 'index.html');
      if (existsSync(indexPath) && await serveFile(res, indexPath, req.method)) return;
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Build not found. Run npm run build first.');
    } catch (error) {
      console.error('Request failed:', error.code || error.message);
      sendJson(res, error.statusCode || 500, {
        error: error.statusCode ? error.message : 'Unexpected server error.',
        code: error.code || 'server_error'
      });
    }
  });
}
