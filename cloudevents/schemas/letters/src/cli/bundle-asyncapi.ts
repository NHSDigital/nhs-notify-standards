import { writeFileSync , } from 'fs';
import bundle from '@asyncapi/bundler';
import path from "node:path";

async function main() {
  const baseDir = path.resolve(process.cwd(), '..');
  const document = await bundle(['letters/schemas/notify-core.yaml'], {
    baseDir,
    xOrigin: true,
  });
  let bundledOutput = document.yml();
  if (bundledOutput) {
    writeFileSync('dist/asyncapi/notify-core.yaml', bundledOutput); // the complete bundled AsyncAPI document
  }
}

main().catch(e => console.error(e));
