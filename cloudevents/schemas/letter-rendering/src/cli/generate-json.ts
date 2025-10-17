import { z } from "zod";
import * as fs from "node:fs";
import { $LetterRequest } from "../domain/letter-request";
import { $LetterRequestPreparedEvent } from "../events/letter-request-prepared-event";

for (const [key, schema] of Object.entries({
  "letter-request": $LetterRequest,
})) {
  const json = z.toJSONSchema(schema, {
    io: "input",
    target: "openapi-3.0",
    reused: "ref",
  });
  fs.mkdirSync("schemas/domain", { recursive: true });
  const file = `schemas/domain/${key}.schema.json`;
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.info(`Wrote JSON schema for ${key} to ${file}`);
}

for (const [key, schema] of Object.entries({
  "letter-request-prepared-event": $LetterRequestPreparedEvent,
})) {
  const json = z.toJSONSchema(schema, {
    io: "input",
    target: "openapi-3.0",
    reused: "ref",
  });
  fs.mkdirSync("schemas/events", { recursive: true });
  const file = `schemas/events/${key}.schema.json`;
  fs.writeFileSync(file, JSON.stringify(json, null, 2));
  console.info(`Wrote JSON schema for ${key} to ${file}`);
}
