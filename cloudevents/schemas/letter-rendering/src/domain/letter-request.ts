import { z } from "zod";
import { DomainBase } from "./common";

export const $LetterRequest = DomainBase("LetterRequest")
  .extend({
    clientId: z.string().meta({
      title: "Client ID",
      description:
        "Identifier for the client which this letter is being sent on behalf of",
      examples: [
        "987e6543-21c0-4d5b-8f9a-abcdef123456",
        "123e4567-e89b-12d3-a456-426614174000",
      ],
    }),
    campaignId: z
      .string()
      .optional()
      .meta({
        title: "Campaign ID",
        description:
          "Identifier for the campaign which this letter is a part of",
        examples: ["campaign-456", "flu-campaign-2025"],
      }),
    specificationId: z.string().meta({
      title: "Specification ID",
      description:
        "Reference to the letter specification which should be used to produce a letter pack for this request",
      examples: ["1y3q9v1zzzz"],
    }),
    requestId: z.string().meta({
      title: "Request ID",
      description:
        "Identifier for the request which this letter request is part of",
      examples: ["1y3q9v1zzzy"],
    }),
    requestItemId: z.string().meta({
      title: "Request Item ID",
      description:
        "Identifier for the request item which this letter request is part of",
      examples: ["1y3q9v1zzyx"],
    }),
    requestItemPlanId: z.string().meta({
      title: "Request Item Plan ID",
      description:
        "Identifier for the request item plan which associated with this letter request",
      examples: ["1y3q9v1zzzz"],
    }),
    supplierId: z.string().meta({
      title: "Supplier ID",
      description:
        "Identifier for the supplier which should print and post the letter",
      examples: ["supplier-004", "supplier-abc"],
    }),
    templateId: z
      .string()
      .optional()
      .meta({
        title: "Template ID",
        description: "Identifier for the template used to compose this letter",
        examples: ["template-005", "template-main"],
      }),
    url: z.url().meta({
      title: "Letter URL",
      description: `Unsigned S3 URL where the generated letter body can be retrieved. It will be signed for access on retrieval.

The file will be a PDF file in A4 format suitable for printing.`,
      examples: [
        "https://s3.amazonaws.com/bucket/letter-123.pdf",
        "https://storage.nhs.uk/letters/letter-abc.pdf",
      ],
    }),
    sha256Hash: z.string().meta({
      title: "SHA-256 Hash",
      description: "SHA-256 checksum of the PDF file",
      examples: [
        "3a7bd3e2360a3d80c4d4e8b1e3e5e6e7e8e9e0e1e2e3e4e5e6e7e8e9e0e1e2e3",
        "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      ],
    }),
    createdAt: z.iso.datetime().meta({
      title: "Created At",
      description: "Timestamp when the letter PDF was created",
      examples: ["2025-10-06T12:34:56Z", "2025-01-01T00:00:00Z"],
    }),
    pageCount: z.number().meta({
      title: "Page Count",
      description: "Number of pages in the PDF document",
      examples: [1, 3, 10],
    }),
    status: z.enum(["PREPARED"]).meta({
      title: "Letter Request Status",
      description: "Current status of the letter request",
      examples: ["PREPARED"],
    }),
    urgency: z.enum(["STANDARD", "URGENT"]).meta({
      title: "Urgency",
      description: "Indicates whether the letter is standard or urgent",
      examples: ["STANDARD", "URGENT"],
    }),
  })
  .meta({
    title: "Letter Request",
    description:
      "Details of a request to send a letter, including PDF location and metadata",
  });

export type LetterRequest = z.infer<typeof $LetterRequest>;
