import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { PART_CATEGORIES } from '../src/data/partsCategories.js';

const MAX_LINKS = 250;

function defaultFilePath() {
  const dataDir = process.env.RAEV_DATA_DIR || (process.env.NODE_ENV === 'production' ? '/data' : join(process.cwd(), 'data'));
  return resolve(dataDir, 'research-links.json');
}

function cleanText(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeUrl(value) {
  const rawValue = String(value || '').trim();
  if (rawValue.length > 2048) {
    const error = new Error('Link address is too long.');
    error.statusCode = 400;
    error.code = 'invalid_link_url';
    throw error;
  }
  let url;
  try {
    url = new URL(rawValue);
  } catch {
    const error = new Error('Link must be a valid web address.');
    error.statusCode = 400;
    error.code = 'invalid_link_url';
    throw error;
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    const error = new Error('Only HTTP and HTTPS links can be saved.');
    error.statusCode = 400;
    error.code = 'invalid_link_url';
    throw error;
  }
  url.hash = '';
  return url.toString();
}

export function validatePartsLink(input = {}) {
  const title = cleanText(input.title, 180);
  if (!title) {
    const error = new Error('Link title is required.');
    error.statusCode = 400;
    error.code = 'invalid_link_title';
    throw error;
  }
  const category = cleanText(input.category, 80);
  if (!PART_CATEGORIES.includes(category)) {
    const error = new Error('Choose a valid parts category.');
    error.statusCode = 400;
    error.code = 'invalid_link_category';
    throw error;
  }
  return {
    title,
    url: normalizeUrl(input.url),
    category
  };
}

export function createPartsLinkStore({ filePath = defaultFilePath() } = {}) {
  let writeQueue = Promise.resolve();

  async function readAll() {
    try {
      const parsed = JSON.parse(await readFile(filePath, 'utf8'));
      if (!Array.isArray(parsed)) return [];
      return parsed.map(link => {
        try {
          const id = cleanText(link.id, 100);
          const savedAt = cleanText(link.savedAt, 40);
          if (!/^[a-zA-Z0-9-]+$/.test(id) || Number.isNaN(Date.parse(savedAt))) return null;
          return { id, ...validatePartsLink(link), savedAt };
        } catch {
          return null;
        }
      }).filter(Boolean).slice(0, MAX_LINKS);
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  async function writeAll(links) {
    await mkdir(dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(links, null, 2)}\n`, { mode: 0o600 });
    await rename(temporaryPath, filePath);
  }

  function serializeWrite(operation) {
    const result = writeQueue.then(operation, operation);
    writeQueue = result.catch(() => {});
    return result;
  }

  return {
    filePath,
    async list() {
      await writeQueue;
      return readAll();
    },
    async add(input) {
      const candidate = validatePartsLink(input);
      return serializeWrite(async () => {
        const links = await readAll();
        const existing = links.find(link => link.url === candidate.url && link.category === candidate.category);
        if (existing) return { link: existing, created: false };
        if (links.length >= MAX_LINKS) {
          const error = new Error('The saved research-link limit has been reached.');
          error.statusCode = 409;
          error.code = 'link_limit_reached';
          throw error;
        }
        const link = {
          id: randomUUID(),
          ...candidate,
          savedAt: new Date().toISOString()
        };
        await writeAll([link, ...links]);
        return { link, created: true };
      });
    },
    async remove(id) {
      return serializeWrite(async () => {
        const links = await readAll();
        const nextLinks = links.filter(link => link.id !== id);
        if (nextLinks.length === links.length) return false;
        await writeAll(nextLinks);
        return true;
      });
    }
  };
}
