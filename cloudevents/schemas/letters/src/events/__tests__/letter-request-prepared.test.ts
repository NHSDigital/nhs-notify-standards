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

    const event = $LetterRequestPreparedEvent.parse(json);
    expect(event).toBeDefined();
    expect(event.type).toBe("uk.nhs.notify.letters.letter-request.prepared.v1");
    expect(event.specversion).toBe("1.0");
    expect(event.source).toBe("/data-plane/letters/prod/render-pdf");
    expect(event.id).toBe("23f1f09c-a555-4d9b-8405-0b33490bc920");
    expect(event.time).toBe("2025-08-28T08:45:00.000Z");
    expect(event.datacontenttype).toBe("application/json");
    expect(event.dataschema).toBe(
      "https://notify.nhs.uk/events/letters/letter-request/prepared/1.0.0.json",
    );
    expect(event.dataschemaversion).toBe("1.0.0");
    expect(event.data).toBeDefined();
    expect(event.data.requestId).toBe("f47ac10b-58cc-4372-a567-0e02b2c3d479");
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
