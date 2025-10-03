import { z } from "zod";
import * as fs from "node:fs";
import { $EnvelopeProfile } from "../domain/envelope-profile";

for (const [key, schema] of Object.entries({
  "envelope-profile": $EnvelopeProfile,
})) {
  const json = z.toJSONSchema(schema, {
    io: "input",
    target: "openapi-3.0",
    reused: "ref",
  });
  fs.mkdirSync("schemas/json", { recursive: true });
  const file = `schemas/json/${key}.json`;
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.info(`Wrote JSON schema for ${key} to ${file}`);
}
