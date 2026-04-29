import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.resolve('src');
const output = path.resolve('examples/custom-gpt-connector/function-registry.generated.mjs');

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.ts'));
const metadata = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(srcDir, file), 'utf8');
  const cls = text.match(/export class (Echo\w+)/);
  if (!cls) continue;
  const category = file.replace('.ts', '');
  const methodRegex = /async\s+(\w+)\s*\(([^)]*)\)/g;
  let m;
  while ((m = methodRegex.exec(text))) {
    const method = m[1];
    if (['constructor'].includes(method)) continue;
    const params = m[2].split(',').map((p) => p.trim().split(':')[0].trim()).filter(Boolean);
    metadata.push({
      name: `${category}.${method}`,
      category,
      description: `${category} ${method}`,
      inputSchema: { required: params.filter((p) => !p.includes('?')).map((p) => p.replace('opts', 'options')) },
      riskLevel: ['delete', 'create', 'run', 'scan', 'store'].some((k) => method.toLowerCase().includes(k)) ? 'high' : 'medium',
      examples: [{}],
    });
  }
}

const body = `export const FUNCTION_METADATA = ${JSON.stringify(metadata, null, 2)};\n`;
fs.writeFileSync(output, body);
console.log(`Wrote ${metadata.length} entries to ${output}`);
