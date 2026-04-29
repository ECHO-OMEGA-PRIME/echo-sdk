import http from 'node:http';
import EchoPrime from '../../dist/index.mjs';
import { FUNCTION_METADATA } from './function-registry.generated.mjs';

const PORT = Number(process.env.PORT || 8787);
const apiKey = process.env.ECHO_API_KEY;
const gatewayToken = process.env.CONNECTOR_TOKEN;
const echoDriveScannerUrl = process.env.ECHO_DRIVE_SCANNER_URL;
const echoDriveScannerToken = process.env.ECHO_DRIVE_SCANNER_TOKEN;

if (!apiKey) {
  console.error('Missing ECHO_API_KEY environment variable.');
  process.exit(1);
}

const echo = new EchoPrime({ apiKey });

const json = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Connector-Token',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(JSON.stringify(body));
};

const requireFields = (body, fields) => {
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      throw new Error(`Missing required field: ${field}`);
    }
  }
};

const readBody = (req) => new Promise((resolve, reject) => {
  let data = '';
  req.on('data', (chunk) => { data += chunk; });
  req.on('end', () => {
    try { resolve(data ? JSON.parse(data) : {}); } catch { reject(new Error('Invalid JSON body')); }
  });
  req.on('error', reject);
});

const checkGatewayToken = (req) => {
  if (!gatewayToken) return;
  const headerToken = req.headers['x-connector-token'];
  if (headerToken !== gatewayToken) throw new Error('Unauthorized connector token');
};

const callDriveScanner = async (path, payload = {}) => {
  if (!echoDriveScannerUrl) throw new Error('ECHO_DRIVE_SCANNER_URL is not configured');
  const res = await fetch(`${echoDriveScannerUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(echoDriveScannerToken ? { Authorization: `Bearer ${echoDriveScannerToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Drive scanner call failed with ${res.status}`);
  return res.json();
};

const FUNCTION_REGISTRY = {
  'chat.send': (input) => { requireFields(input, ['message']); return echo.chat.send(input.message, input.personality ? { personality: input.personality } : undefined); },
  'knowledge.search': (input) => { requireFields(input, ['query']); return echo.knowledge.search(input.query); },
  'engines.search': (input) => { requireFields(input, ['query']); return echo.engines.search(input.query, input.limit ?? 10); },
  'engines.query': (input) => { requireFields(input, ['question']); return echo.engines.query(input.question, input.domain); },
  'memory.search': (input) => { requireFields(input, ['query']); return echo.memoryPrime.search(input.query, input.options); },
  'scanner.search': (input) => { requireFields(input, ['query']); return echo.scanner.searchDocuments(input.query, input.options); },
  'scanner.recommendBuild': (input) => { requireFields(input, ['goal']); return echo.scanner.recommendBuild(input); },
  'workflows.create': (input) => { requireFields(input, ['name', 'steps']); return echo.workflows.create(input.name, input.steps, input.options); },
  'workflows.run': (input) => { requireFields(input, ['workflowId']); return echo.workflows.run(input.workflowId, input.inputs); },
  'workflows.runStatus': (input) => { requireFields(input, ['runId']); return echo.workflows.runStatus(input.runId); },
  'driveScanner.search': (input) => callDriveScanner('/search', input),
  'driveScanner.scan': (input) => callDriveScanner('/scan', input),
  'driveScanner.status': (input) => callDriveScanner('/status', input),
};

const SAFE_WORKFLOWS = {
  raistlin_plan: ['engines.search', 'knowledge.search', 'memory.search'],
  raistlin_execute: ['engines.query', 'chat.send'],
};

const listFunctions = (query = '') => {
  const q = String(query).toLowerCase();
  return FUNCTION_METADATA.filter((f) =>
    !q || [f.name, f.category, f.description, f.riskLevel, JSON.stringify(f.examples)].join(' ').toLowerCase().includes(q)
  );
};

const callFunction = async (name, input = {}) => {
  const fn = FUNCTION_REGISTRY[name];
  if (!fn) throw new Error(`Function not allowed: ${name}`);
  return fn(input);
};

const runWorkflow = async (workflow, steps = []) => {
  const allowed = SAFE_WORKFLOWS[workflow];
  if (!allowed) throw new Error(`Unknown workflow: ${workflow}`);
  const results = [];
  for (const step of steps) {
    if (!allowed.includes(step.function)) throw new Error(`Function ${step.function} is not allowed for workflow ${workflow}`);
    const output = await callFunction(step.function, step.input || {});
    results.push({ function: step.function, output });
  }
  return { workflow, results };
};

const route = async (req, body) => {
  if (req.method === 'GET' && req.url === '/health') return { ok: true };
  if (req.method === 'POST' && req.url === '/chat') return callFunction('chat.send', body);
  if (req.method === 'POST' && req.url === '/knowledge/search') return { results: await callFunction('knowledge.search', body) };
  if (req.method === 'POST' && ['/sdk/functions/search', '/sdk/search'].includes(req.url)) return { functions: listFunctions(body.query || '') };
  if (req.method === 'POST' && ['/sdk/functions/call', '/sdk/call'].includes(req.url)) {
    requireFields(body, ['function']);
    return { output: await callFunction(body.function, body.input || {}) };
  }
  if (req.method === 'POST' && req.url === '/sdk/workflow') {
    requireFields(body, ['workflow', 'steps']);
    return runWorkflow(body.workflow, body.steps);
  }
  if (req.method === 'POST' && req.url === '/engines/search') return { results: await callFunction('engines.search', body) };
  if (req.method === 'POST' && req.url === '/engines/query') return { result: await callFunction('engines.query', body) };
  if (req.method === 'POST' && req.url === '/memory/search') return callFunction('memory.search', body);
  if (req.method === 'POST' && req.url === '/scanner/search') return { results: await callFunction('scanner.search', body) };
  if (req.method === 'POST' && req.url === '/scanner/recommend-build') return { recommendation: await callFunction('scanner.recommendBuild', body) };
  if (req.method === 'POST' && req.url === '/raistlin/plan') {
    requireFields(body, ['query']);
    return { workflow: 'raistlin_plan', steps: [{ function: 'engines.search', input: { query: body.query, limit: 5 } }, { function: 'knowledge.search', input: { query: body.query } }, { function: 'memory.search', input: { query: body.query, options: { limit: 5 } } }] };
  }
  if (req.method === 'POST' && req.url === '/raistlin/execute') return runWorkflow('raistlin_execute', body.steps || []);
  if (req.method === 'POST' && req.url === '/forge/status') return { status: 'ready', available_workflows: Object.keys(SAFE_WORKFLOWS), registered_functions: listFunctions() };
  if (req.method === 'POST' && req.url === '/forge/smoke') return { ok: true, deprecated: true, message: 'Use /sdk/health for SDK smoke checks', sdk_health: await echo.health() };
  if (req.method === 'POST' && req.url === '/sdk/health') return { ok: true, sdk_health: await echo.health() };
  if (req.method === 'POST' && req.url === '/queue/create') {
    const workflow = await callFunction('workflows.create', body);
    return { queue_id: workflow.id, workflow };
  }
  if (req.method === 'POST' && req.url === '/queue/status') return { run: await callFunction('workflows.runStatus', body) };
  if (req.method === 'POST' && req.url === '/drive-scanner/search') return { result: await callFunction('driveScanner.search', body) };
  if (req.method === 'POST' && req.url === '/drive-scanner/scan') return { result: await callFunction('driveScanner.scan', body) };
  if (req.method === 'POST' && req.url === '/drive-scanner/status') return { result: await callFunction('driveScanner.status', body) };
  throw new Error('Not found');
};

http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 200, { ok: true });
  try {
    checkGatewayToken(req);
    const body = req.method === 'POST' ? await readBody(req) : {};
    const response = await route(req, body);
    return json(res, 200, response);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = message === 'Not found' ? 404 : message.includes('Unauthorized') ? 401 : message.includes('Missing required') || message.includes('Invalid JSON') ? 400 : 500;
    return json(res, status, { error: message });
  }
}).listen(PORT, () => {
  console.log(`Echo SDK Action Gateway running on http://localhost:${PORT}`);
});
