import { writeFileSync } from "node:fs";
import bundle from "@asyncapi/bundler";
import path from "node:path";

async function main() {
  const baseDir = path.resolve(process.cwd(), "..");
  const document = await bundle(["letters/schemas/letters.yaml"], {
    baseDir,
    xOrigin: true,
  });
  const bundledOutput = document.yml();
  if (bundledOutput) {
    writeFileSync("dist/asyncapi/letters.yaml", bundledOutput); // the complete bundled AsyncAPI document
  }
}

main().catch((error) => console.error(error));
