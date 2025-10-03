import { z } from "zod";
import { $LetterRequest } from '../domain/letter-request';
import { $EnvelopeProfile } from "@nhsdigital/nhs-notify-event-schemas-common/src/domain/envelope-profile";

const $LetterRequestPreparedEventMetadata = $EnvelopeProfile.safeExtend({
  type: z.literal("uk.nhs.notify.core.letter-request-prepared.v1"),
  dataschema: z
    .string()
    .regex(
      /^https:\/\/notify\.nhs\.uk\/events\/core\/letter-request-prepared\/1.\d+\.\d+\.json$/,
    ),
  dataschemaversion: z.string().regex(/^1\.\d+\.\d+$/), // Matches semantic versioning format with fixed major version
});

export const $LetterRequestPreparedEvent = $LetterRequestPreparedEventMetadata
  .safeExtend({
    data: $LetterRequest
  })
  .describe("LetterRequestPreparedEvent");

export type LetterRequestPreparedEvent = z.infer<typeof $LetterRequestPreparedEvent>;
