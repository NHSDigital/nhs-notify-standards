import { z } from "zod";
import { DomainBase } from "./common";

export const $LetterRequest = DomainBase("LetterRequest").extend({
  clientId: z.string().meta({
    title: "Client ID",
    description:
      "Identifier for the client which this letter is being sent on behalf of",
  }),
  campaignId: z.string().meta({
    title: "Campaign ID",
    description: "Identifier for the campaign which this letter is a part of",
  }),
  specificationId: z.string().meta({
    title: "Specification ID",
    description:
      "Reference to the letter specification which should be used to produce a letter pack for this request",
  }),
  requestId: z.string().meta({
    title: "Request ID",
    description:
      "Identifier for the request which this letter request is part of",
  }),
  requestItemId: z.string().meta({
    title: "Request Item ID",
    description:
      "Identifier for the request item which this letter request is part of",
  }),
  requestItemPlanId: z.string().meta({
    title: "Request Item Plan ID",
    description:
      "Identifier for the request item plan which associated with this letter request",
  }),
  supplierId: z.string().meta({
    title: "Supplier ID",
    description:
      "Identifier for the supplier which should print and post the letter",
  }),
  s3Url: z.url().meta({
    title: "S3 URL",
    description:
      "Unsigned S3 URL where the generated PDF can be retrieved. It will be signed for access on retrieval",
  }),
  sha256Hash: z.string().meta({
    title: "SHA-256 Hash",
    description: "SHA-256 checksum of the PDF file",
  }),
  createdAt: z.iso.datetime().meta({
    title: "Created At",
    description: "Timestamp when the letter PDF was created",
  }),
  pageCount: z.number().meta({
    title: "Page Count",
    description: "Number of pages in the PDF document",
  }),
});

export type LetterRequest = z.infer<typeof $LetterRequest>;
