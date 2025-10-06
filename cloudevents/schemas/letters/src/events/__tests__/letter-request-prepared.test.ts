import fs from "node:fs";
import path from "node:path";
import { $LetterRequestPreparedEvent } from "../letter-request-prepared-event";

function readJson(filename: string): unknown {
  const filePath = path.resolve(__dirname, "./testData/", filename);

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

describe("LetterRequestPreparedEvent validations", () => {
  it("should validate a LetterRequestPrepared event with all required fields", () => {
    const json = readJson("letter-request-prepared-valid.json");

    expect(() => $LetterRequestPreparedEvent.parse(json)).not.toThrow();
  });

  it("should throw error for LetterRequestPrepared event with missing environment", () => {
    const json = readJson("letter-request-prepared-with-missing-fields.json");

    expect(() => $LetterRequestPreparedEvent.parse(json)).toThrow(
      "specificationId",
    );
  });

  it("should throw error for LetterRequestPrepared event with invalid major schema version", () => {
    const json = readJson(
      "letter-request-prepared-with-invalid-major-version.json",
    );

    expect(() => $LetterRequestPreparedEvent.parse(json)).toThrow(
      "dataschemaversion",
    );
  });
});
