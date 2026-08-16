# RAEV Bullet GT V2 Garage

A private owner knowledge base for a Metallic Green RAEV Bullet GT V2, including bike specifications, diagnostics, compatible parts, and an authenticated AI researcher.

## AI Researcher behavior

The researcher uses `src/data/bikeData.js` as its primary, authoritative knowledge base.

1. Every question is first sent to the OpenAI Responses API without web-search tools.
2. If the internal data covers the question, the answer comes from that data.
3. If internal data is insufficient, the UI explains the gap and asks the owner to approve an online search.
4. Only the explicit approval button sends a second request with the OpenAI web-search tool enabled.
5. External results are labeled supplementary. They never overwrite conflicting internal RAEV facts.

There are no canned or random fallback answers. API failures are shown as errors rather than disguised as research.

## Run locally

```sh
npm ci
npm run build
npm start
```

The full app is then available at `http://localhost:3000`. `npm run dev` runs the frontend-only Vite development server; use the production-style commands above to exercise authentication and AI routes.

Run verification with:

```sh
npm test
npm run lint
npm run build
```

## Railway configuration

The production service must build with `npm run build` and start with `npm start`.

Required environment variables:

- `OPENAI_API_KEY`: server-side project API key; never expose it through a `VITE_` variable.
- `RAEV_OWNER_PIN`: the owner PIN checked by the server. Production refuses to start without it.

Optional environment variables:

- `OPENAI_MODEL`: defaults to `gpt-5.4-mini`.
- `SESSION_SECRET`: stable random value used to keep sessions valid across restarts. If omitted, a new in-memory secret is generated at startup.

The `/api/health` endpoint reports only whether the researcher is configured and which model name is selected. It never returns credentials.
