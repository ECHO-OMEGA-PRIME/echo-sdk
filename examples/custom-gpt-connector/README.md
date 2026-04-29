# Echo SDK Action Gateway (Custom GPT Connector)

This is a hardened connector that turns your Custom GPT into a controlled gateway for Echo SDK + echo-drive-scanner.

## Run

```bash
npm install
npm run build
ECHO_API_KEY=your_echo_key \
CONNECTOR_TOKEN=super_secret_token \
ECHO_DRIVE_SCANNER_URL=https://your-drive-scanner-host \
ECHO_DRIVE_SCANNER_TOKEN=optional_scanner_token \
PORT=8787 \
node examples/custom-gpt-connector/server.mjs
```

Pass `X-Connector-Token: super_secret_token` on every request when `CONNECTOR_TOKEN` is set.

## Endpoints

- `GET /health`
- `POST /chat`
- `POST /knowledge/search`
- `POST /sdk/functions/search`
- `POST /sdk/functions/call`
- `POST /sdk/search`
- `POST /sdk/call`
- `POST /sdk/workflow`
- `POST /engines/search`
- `POST /engines/query`
- `POST /memory/search`
- `POST /scanner/search`
- `POST /scanner/recommend-build`
- `POST /raistlin/plan`
- `POST /raistlin/execute`
- `POST /forge/status`
- `POST /forge/smoke` (deprecated; compatibility route)
- `POST /sdk/health`
- `POST /queue/create`
- `POST /queue/status`
- `POST /drive-scanner/search`
- `POST /drive-scanner/scan`
- `POST /drive-scanner/status`

## Why this is better

- Optional connector token auth (`CONNECTOR_TOKEN`) for request-level access control.
- Input validation with clear 400 errors for missing fields.
- Consistent route dispatch + status codes (401/400/404/500).
- Drive scanner integration is controlled through allowlisted registry functions only.

## Million-function path (generated registry)

Use the generator to build metadata from SDK source methods:

```bash
node examples/custom-gpt-connector/scripts/build-function-registry.mjs
```

This writes `function-registry.generated.mjs`, which powers metadata-aware `/sdk/functions/search`.


### New: scanner build recommendations

`POST /scanner/recommend-build` uses SDK scanner intelligence to suggest how to build programs using existing files, including reusable file paths and step-by-step plan output.


## Quick setup guide

- Follow `examples/custom-gpt-connector/CUSTOM_GPT_ACTION_CHECKLIST.md` for a click-by-click GPT Actions import and auth setup.
