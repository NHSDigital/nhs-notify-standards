import { z } from "zod";
import { $EnvelopeProfile } from "@nhsdigital/nhs-notify-event-schemas-common/src/envelope-profile";
import { $LetterRequest } from "../domain/letter-request";

const $LetterRequestPreparedEventMetadata = $EnvelopeProfile.safeExtend({
  type: z.literal("uk.nhs.notify.letter-rendering.letter-request.PREPARED.v1"),
  dataschema: z
    .string()
    .regex(
      /^https:\/\/notify\.nhs\.uk\/events\/letter-rendering\/letter-request\/PREPARED\/1.\d+\.\d+\.json$/,
    ),
  dataschemaversion: z.string().regex(/^1\.\d+\.\d+$/), // Matches semantic versioning format with fixed major version
});

export const $LetterRequestPreparedEvent = $LetterRequestPreparedEventMetadata
  .safeExtend({
    // This replaces the data definition from EnvelopeProfile rather than extending it
    data: $LetterRequest,
  })
  .describe("LetterRequestPreparedEvent");

export type LetterRequestPreparedEvent = z.infer<
  typeof $LetterRequestPreparedEvent
>;
