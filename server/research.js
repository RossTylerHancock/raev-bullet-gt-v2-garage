import { RAEV_BIKE_DATA } from '../src/data/bikeData.js';

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['answer', 'knowledgeStatus', 'externalResearchReason'],
  properties: {
    answer: { type: 'string' },
    knowledgeStatus: {
      type: 'string',
      enum: ['answered_from_internal_knowledge', 'external_confirmation_required']
    },
    externalResearchReason: { type: 'string' }
  }
};

const INTERNAL_INSTRUCTIONS = `You are the RAEV Bullet GT V2 Garage Researcher.

The JSON knowledge base below is the app owner's verified and authoritative source. Answer the user's actual question directly from it whenever it contains enough relevant information. Never contradict or replace it. Do not claim a fact is verified unless it appears in this knowledge base.

You do not have permission to browse the internet in this step. If the knowledge base is insufficient for a useful answer, say what is known internally, identify the exact missing information, and set knowledgeStatus to external_confirmation_required with a brief reason. Do not invent product compatibility, dimensions, prices, procedures, or sources. Keep the answer concise and practical. Plain text is preferred; short bullets are fine.

AUTHORITATIVE INTERNAL RAEV KNOWLEDGE BASE:
${JSON.stringify(RAEV_BIKE_DATA)}`;

const EXTERNAL_INSTRUCTIONS = `You are the RAEV Bullet GT V2 Garage Researcher. The owner explicitly approved an internet search for this question.

The JSON knowledge base below remains the primary, verified, and authoritative source. Use web research only to supplement gaps. Never overwrite or weaken an internal fact. If an external result conflicts with the internal knowledge base, give the internal fact as the answer, clearly describe the discrepancy, and label the external claim unverified or supplementary. Cite useful external sources through the web-search tool. Do not call an external claim "verified" merely because it appears online. Answer the user's actual question directly and distinguish "Internal verified knowledge" from "Supplementary web research" where both are used.

AUTHORITATIVE INTERNAL RAEV KNOWLEDGE BASE:
${JSON.stringify(RAEV_BIKE_DATA)}`;

function normalizeBaseUrl(value) {
  return (value || 'https://api.openai.com/v1').replace(/\/$/, '');
}

function outputText(response) {
  if (typeof response.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim();
  }

  return (response.output || [])
    .flatMap(item => item.content || [])
    .filter(item => item.type === 'output_text' && typeof item.text === 'string')
    .map(item => item.text)
    .join('\n')
    .trim();
}

export function extractSources(response) {
  const sources = [];
  const seen = new Set();

  for (const item of response.output || []) {
    for (const content of item.content || []) {
      for (const annotation of content.annotations || []) {
        const citation = annotation.url_citation || annotation;
        if (annotation.type !== 'url_citation' || !citation.url || seen.has(citation.url)) continue;
        seen.add(citation.url);
        sources.push({
          title: citation.title || citation.url,
          url: citation.url
        });
      }
    }
  }

  return sources.slice(0, 8);
}

export function createInternalRequest(question, model) {
  return {
    model,
    store: false,
    instructions: INTERNAL_INSTRUCTIONS,
    input: question,
    max_output_tokens: 1200,
    text: {
      format: {
        type: 'json_schema',
        name: 'raev_internal_answer',
        strict: true,
        schema: RESPONSE_SCHEMA
      }
    }
  };
}

export function createExternalRequest(question, model) {
  return {
    model,
    store: false,
    instructions: EXTERNAL_INSTRUCTIONS,
    input: question,
    max_output_tokens: 1600,
    tools: [{ type: 'web_search', search_context_size: 'medium' }],
    tool_choice: 'required'
  };
}

export async function researchQuestion({
  question,
  allowWeb = false,
  apiKey = process.env.OPENAI_API_KEY,
  model = process.env.OPENAI_MODEL || 'gpt-5.4-mini',
  baseUrl = process.env.OPENAI_BASE_URL,
  fetchImpl = fetch,
  timeoutMs = 45_000
}) {
  if (!apiKey) {
    const error = new Error('The AI researcher is not configured on the server.');
    error.statusCode = 503;
    error.code = 'missing_api_key';
    throw error;
  }

  const requestBody = allowWeb
    ? createExternalRequest(question, model)
    : createInternalRequest(question, model);

  let response;
  try {
    response = await fetchImpl(`${normalizeBaseUrl(baseUrl)}/responses`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch (cause) {
    const error = new Error(cause?.name === 'TimeoutError'
      ? 'The AI researcher timed out. Please try again.'
      : 'The AI service could not be reached. Please try again.');
    error.statusCode = 502;
    error.code = cause?.name === 'TimeoutError' ? 'openai_timeout' : 'openai_unreachable';
    throw error;
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || 'The AI service rejected the request.');
    error.statusCode = response.status === 401 || response.status === 403 ? 503 : 502;
    error.code = payload?.error?.code || payload?.error?.type || 'openai_error';
    throw error;
  }

  const text = outputText(payload);
  if (!text) {
    const error = new Error('The AI service returned an empty answer.');
    error.statusCode = 502;
    error.code = 'empty_openai_response';
    throw error;
  }

  if (allowWeb) {
    return {
      answer: text,
      needsExternalResearch: false,
      externalResearchReason: '',
      usedWeb: true,
      sources: extractSources(payload),
      model
    };
  }

  let structured;
  try {
    structured = JSON.parse(text);
  } catch {
    const error = new Error('The AI service returned an invalid internal answer.');
    error.statusCode = 502;
    error.code = 'invalid_openai_response';
    throw error;
  }

  return {
    answer: structured.answer,
    needsExternalResearch: structured.knowledgeStatus === 'external_confirmation_required',
    externalResearchReason: structured.externalResearchReason,
    usedWeb: false,
    sources: [],
    model
  };
}
