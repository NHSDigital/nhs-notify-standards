import { z } from "zod";
import { $EnvelopeProfile } from "@nhsdigital/nhs-notify-event-schemas-common/src/envelope-profile";
import { $LetterRequest } from "../domain/letter-request";

export const $LetterRequestPreparedEvent = $EnvelopeProfile
  .safeExtend({
    type: z
      .literal("uk.nhs.notify.letter-rendering.letter-request.PREPARED.v1")
      .meta({
        title: `Letter Request event type`,
        description: "Event type using reverse-DNS style",
        examples: ["uk.nhs.notify.letter-rendering.letter-request.PREPARED.v1"],
      }),

    dataschema: z
      .string()
      .regex(
        /^https:\/\/notify\.nhs\.uk\/cloudevents\/schemas\/letter-rendering\/letter-request.PREPARED.1.\d+\.\d+\.schema.json$/,
      )
      .meta({
        title: "Data Schema URI",
        description: `URI of a schema that describes the event data

Data schema version must match the major version indicated by the type`,
        examples: [
          "https://notify.nhs.uk/cloudevents/schemas/letter-rendering.letter-request.PREPARED.1.0.0.schema.json",
        ],
      }),

    dataschemaversion: z
      .string()
      .regex(/^1\.\d+\.\d+$/)
      .meta({
        title: "Data Schema Version",
        description:
          "Matches semantic versioning format with fixed major version (Not part of cloudevents spec?)",
      }),

    source: z
      .string()
      .regex(/^\/data-plane\/letter-rendering(?:\/.*)?$/)
      .meta({
        title: "Event Source",
        description:
          "Logical event producer path within the letter-rendering domain",
      }),

    subject: z
      .string()
      .regex(/^client\/[a-z0-9-]+\/letter-request\/[^/]+(?:\/.*)?/)
      .meta({
        title: "Event Subject",
        description:
          "Resource path (no leading slash) within the source made of segments separated by '/'.",
        examples: [
          "client/00f3b388-bbe9-41c9-9e76-052d37ee8988/letter-request/0o5Fs0EELR0fUjHjbCnEtdUwQe4_0o5Fs0EELR0fUjHjbCnEtdUwQe5",
        ],
      }),

    data: $LetterRequest,
  })
  .meta({
    title: "Letter Request Prepared Event",
  });

export type LetterRequestPreparedEvent = z.infer<
  typeof $LetterRequestPreparedEvent
>;
