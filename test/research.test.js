import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { createRaevServer } from '../server/app.js';
import { createExternalRequest, createInternalRequest, researchQuestion } from '../server/research.js';

test('internal request uses authoritative app context without web tools', () => {
  const request = createInternalRequest('Where is the secondary battery?', 'test-model');
  assert.equal(request.model, 'test-model');
  assert.equal(request.input, 'Where is the secondary battery?');
  assert.equal(request.tools, undefined);
  assert.match(request.instructions, /authoritative source/i);
  assert.match(request.instructions, /Mounted directly underneath/);
  assert.equal(request.text.format.type, 'json_schema');
});

test('external request is only created for an explicitly approved search', () => {
  const request = createExternalRequest('Find a compatible part', 'test-model');
  assert.deepEqual(request.tools, [{ type: 'web_search', search_context_size: 'medium' }]);
  assert.equal(request.tool_choice, 'required');
  assert.match(request.instructions, /explicitly approved/i);
  assert.match(request.instructions, /Never overwrite/);
});

test('researchQuestion parses internal result and never silently adds web search', async () => {
  let sentBody;
  const result = await researchQuestion({
    question: 'Where is the battery?',
    apiKey: 'test-key',
    model: 'test-model',
    fetchImpl: async (_url, options) => {
      sentBody = JSON.parse(options.body);
      return new Response(JSON.stringify({
        output_text: JSON.stringify({
          answer: 'Below the main battery.',
          knowledgeStatus: 'answered_from_internal_knowledge',
          externalResearchReason: ''
        })
      }), { status: 200, headers: { 'content-type': 'application/json' } });
    }
  });

  assert.equal(sentBody.tools, undefined);
  assert.equal(result.answer, 'Below the main battery.');
  assert.equal(result.needsExternalResearch, false);
  assert.equal(result.usedWeb, false);
});

test('approved external research uses web search and returns source metadata', async () => {
  let sentBody;
  const result = await researchQuestion({
    question: 'Find the manufacturer page.',
    allowWeb: true,
    apiKey: 'test-key',
    model: 'test-model',
    fetchImpl: async (_url, options) => {
      sentBody = JSON.parse(options.body);
      return new Response(JSON.stringify({
        output_text: 'Supplementary result.',
        output: [{
          type: 'message',
          content: [{
            type: 'output_text',
            text: 'Supplementary result.',
            annotations: [{
              type: 'url_citation',
              url: 'https://example.com/part',
              title: 'Example part'
            }]
          }]
        }]
      }), { status: 200, headers: { 'content-type': 'application/json' } });
    }
  });

  assert.equal(sentBody.tool_choice, 'required');
  assert.equal(sentBody.tools[0].type, 'web_search');
  assert.equal(result.usedWeb, true);
  assert.deepEqual(result.sources, [{ title: 'Example part', url: 'https://example.com/part' }]);
});

let server;
let baseUrl;
let researchCalls;

before(async () => {
  researchCalls = [];
  const distDir = await mkdtemp(join(tmpdir(), 'raev-test-'));
  await writeFile(join(distDir, 'index.html'), '<!doctype html><title>RAEV test</title>');
  server = createRaevServer({
    ownerPin: '3520',
    sessionSecret: 'test-session-secret',
    distDir,
    research: async input => {
      researchCalls.push(input);
      return {
        answer: input.allowWeb ? 'Online supplement.' : 'Internal answer.',
        needsExternalResearch: !input.allowWeb,
        externalResearchReason: input.allowWeb ? '' : 'A current listing is missing.',
        usedWeb: input.allowWeb,
        sources: []
      };
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('server enforces PIN session and explicit web consent', async () => {
  const unauthenticated = await fetch(`${baseUrl}/api/research`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question: 'A question' })
  });
  assert.equal(unauthenticated.status, 401);

  const wrongPin = await fetch(`${baseUrl}/api/auth/unlock`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pin: '0000' })
  });
  assert.equal(wrongPin.status, 401);

  const unlock = await fetch(`${baseUrl}/api/auth/unlock`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pin: '3520' })
  });
  assert.equal(unlock.status, 200);
  const cookie = unlock.headers.get('set-cookie').split(';')[0];

  const internal = await fetch(`${baseUrl}/api/research`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ question: 'What is internal?' })
  });
  assert.equal(internal.status, 200);
  assert.equal(researchCalls.at(-1).allowWeb, false);

  const external = await fetch(`${baseUrl}/api/research`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ question: 'What is external?', allowWeb: true })
  });
  assert.equal(external.status, 200);
  assert.equal(researchCalls.at(-1).allowWeb, true);
});
