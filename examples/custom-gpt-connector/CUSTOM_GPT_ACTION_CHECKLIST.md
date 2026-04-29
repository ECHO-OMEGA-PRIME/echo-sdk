# Custom GPT Action Import Checklist

Use this checklist to connect your Custom GPT to the Echo SDK Action Gateway in under 2 minutes.

## 1) Deploy connector

- Deploy `examples/custom-gpt-connector/server.mjs` to a public HTTPS URL.
- Set env vars:
  - `ECHO_API_KEY`
  - `CONNECTOR_TOKEN`
  - `ECHO_DRIVE_SCANNER_URL` (optional)
  - `ECHO_DRIVE_SCANNER_TOKEN` (optional)

## 2) Verify service

- `GET /health` should return `{ "ok": true }`
- `POST /sdk/health` should return SDK health payload.

## 3) Configure Custom GPT Action

In ChatGPT GPT Builder:

1. Open **Configure** tab.
2. Open **Actions**.
3. Click **Import from URL** (or paste text).
4. Import `examples/custom-gpt-connector/openapi.yaml` content.
5. Replace server URL with your deployed gateway URL.

## 4) Configure auth

- Auth type: **API Key (header)**
- Header name: `X-Connector-Token`
- Header value: your `CONNECTOR_TOKEN`

## 5) Save + test these actions

1. `sdkFunctionsSearch` with:
   ```json
   { "query": "scanner recommend build" }
   ```
2. `scannerRecommendBuild` with:
   ```json
   {
     "goal": "Build a reusable ingestion program from existing files",
     "files": ["src/scanner.ts", "src/workflows.ts"]
   }
   ```
3. `sdkFunctionsCall` with:
   ```json
   {
     "function": "scanner.recommendBuild",
     "input": {
       "goal": "Generate a build plan that reuses existing SDK files"
     }
   }
   ```

## 6) Production hardening

- Restrict CORS origin(s).
- Keep function allowlist small.
- Rotate connector token regularly.
- Add rate limiting/WAF on gateway.
