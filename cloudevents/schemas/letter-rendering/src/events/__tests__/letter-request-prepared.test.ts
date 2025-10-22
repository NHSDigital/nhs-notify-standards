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
    expect(event).toEqual(
      expect.objectContaining({
        type: "uk.nhs.notify.letter-rendering.letter-request.PREPARED.v1",
        specversion: "1.0",
        source: "/data-plane/letter-rendering/prod/render-pdf",
        id: "23f1f09c-a555-4d9b-8405-0b33490bc920",
        time: "2025-08-28T08:45:00.000Z",
        datacontenttype: "application/json",
        dataschema:
          "https://notify.nhs.uk/events/letter-rendering/letter-request/PREPARED/1.0.0.json",
        dataschemaversion: "1.0.0",
        data: expect.objectContaining({
          domainId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          specificationId: "standard_economy",
          templateId: "template_123",
          requestId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          urgency: "STANDARD",
        }),
      }),
    );
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
