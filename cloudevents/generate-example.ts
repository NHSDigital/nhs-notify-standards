import $RefParser from "json-schema-ref-parser";
import jsf from "json-schema-faker";
import fs from "fs";
import crypto from "crypto";

// Utility random helpers (non-cryptographic; deterministic constraints only)
function randomInt(max: number) { return Math.floor(Math.random() * max); }
function randomChoice<T>(arr: T[]): T { return arr[randomInt(arr.length)]; }
function randomHex(len: number) {
  let out = ""; for (let i=0;i<len;i++) out += randomChoice("0123456789abcdef".split("")); return out;
}

// Register a custom UUID format for jsf
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
jsf.format('uuid', uuid);

// Custom property generator for 'source' to match the required pattern
//jsf.define('source', () => {
//  return `/customer/${uuid()}/ordering/${uuid()}/item/${uuid()}`;
//});

// Ensure jsf uses pattern for string generation
jsf.option({ alwaysFakeOptionals: true });

async function main() {
  const args = process.argv.slice(2);

  const [ schemaPathRaw, outputPath ] = args;
  if (!schemaPathRaw || !outputPath) {
    console.error("Usage: ts-node generate-example.ts [--plane=data|control] <schema.json> <output.json>");
    process.exit(1);
  }
  // Add cache-busting query param if schemaPath is a URL
  let schemaPath = schemaPathRaw;
  try {
    const url = new URL(schemaPathRaw);
    url.searchParams.set('_cb', Date.now().toString());
    schemaPath = url.toString();
  } catch (e) {
    // Not a URL, use as-is
  }
  const dereferencedSchema = await $RefParser.dereference(schemaPath);
  const example = jsf.generate(dereferencedSchema);
  // Apply constrained overrides so we always satisfy combined pattern + semantic requirements.
  if (example && typeof example === 'object') {
    // 1. Enforce required CloudEvents profile fields if missing (some schemas rely on profile ref)
    example.specversion = '1.0';
    if (!example.profileversion) example.profileversion = '1.0.0';
    if (!example.profilepublished) example.profilepublished = '2025-10';

    // 2. Generate a stable type if schema didn't const it (avoid banned verbs)
    if (!example.type || typeof example.type !== 'string') {
      example.type = 'uk.nhs.notify.ordering.order.read.v1';
    }

    // 3. Generate IDs
    example.id = uuid();

    // 4. Environment / instance / plane envelope (align with new source pattern)
    const environments = ['production','staging','development','uat'];
    const env = randomChoice(environments);
    // instance: primary | secondary | dev-<digits>
    const instance = randomChoice(['primary','secondary','dev-' + (10000 + randomInt(90000)).toString()]);
    const plane = 'data-plane'; // default plane for example generation
    // Attempt to infer envelope token from schema patterns (fallback to 'ordering')
    const domainToken = 'ordering';
    example.source = `/nhs/england/notify/${env}/${instance}/${plane}/${domainToken}`;

    // 5. Subject pattern customer/{uuid}/order/{uuid}/item/{uuid}
    example.subject = `customer/${uuid()}/order/${uuid()}/item/${uuid()}`;

    // 6. Time & recordedtime: generate recent ISO times (UTC) ensuring recorded >= time
    const now = new Date();
    const timeDate = new Date(now.getTime() - 1000); // 1s earlier
    example.time = timeDate.toISOString();
    example.recordedtime = now.toISOString();

    // 7. traceparent (00-<32hex>-<16hex>-<2hex>) with sampled flag 01
    example.traceparent = `00-${randomHex(32)}-${randomHex(16)}-01`;
    if (!example.tracestate) {
      example.tracestate = 'rojo=00f067aa0ba902b7';
    }

    // 8. Severity coherent pair
    const severities = [
      { text: 'TRACE', number: 0 },
      { text: 'DEBUG', number: 1 },
      { text: 'INFO', number: 2 },
      { text: 'WARN', number: 3 },
      { text: 'ERROR', number: 4 },
      { text: 'FATAL', number: 5 }
    ];
    const sev = randomChoice(severities);
    example.severitytext = sev.text;
    example.severitynumber = sev.number;

    // 9. Partition key (prefer customer segment prefix)
    const customerId = example.subject.split('/')[1] || uuid();
    example.partitionkey = `customer-${customerId.substring(0,8)}`.toLowerCase();

    // 10. Sequence: zero padded 20-digit
    const seq = Math.floor(Math.random() * 1e9); // smaller number but still valid when padded
    example.sequence = seq.toString().padStart(20,'0');

    // 11. Sample rate default 1 (avoid absurd large numbers failing intent)
    example.sampledrate = 1;

    // 12. Data payload enforcement
    if (!example.data || typeof example.data !== 'object') {
      example.data = {} as any;
    }
    if (!('notify-payload' in example.data)) {
      example.data['notify-payload'] = {};
    }
    const np = example.data['notify-payload'];
    if (typeof np !== 'object' || np === null) {
      example.data['notify-payload'] = {};
    }
    const payload = example.data['notify-payload'];
    if (!payload['notify-data']) {
      payload['notify-data'] = { nhsNumber: '9434765919' }; // Valid checksum
    }
    // Ensure nhsNumber remains valid even if faker overrides
    else if (payload['notify-data'] && typeof payload['notify-data'].nhsNumber === 'string') {
      // Replace with known valid if custom faker produced invalid value
      if (payload['notify-data'].nhsNumber !== '9434765919') {
        payload['notify-data'].nhsNumber = '9434765919';
      }
    }
    if (!payload['notify-metadata']) {
      payload['notify-metadata'] = {};
    }
    const meta = payload['notify-metadata'];
    // Enforce required metadata schema fields & align environment/instance semantics
    meta.teamResponsible = meta.teamResponsible || 'Team 1';
    meta.notifyDomain = meta.notifyDomain || 'Ordering';
    // Remove legacy 'version' field if present
    if ('version' in meta) {
      delete meta.version;
    }
    // environment mapping (uat source -> testing metadata)
    meta.environment = env === 'uat' ? 'testing' : (['development','staging','production'].includes(env) ? env : 'development');
    meta.instance = instance;
    meta.microservice = meta.microservice || 'order-service';
    // Required new metadata fields
    meta.microserviceVersion = meta.microserviceVersion || '1.3.0';
    meta.repositoryUrl = meta.repositoryUrl || 'https://github.com/nhsdigital/nhs-notify-standards';
    meta.accountId = meta.accountId || '123456789012';
    meta.microserviceInstanceId = meta.microserviceInstanceId || 'pod-1';
    // Newly added optional provenance / governance fields
    meta.commitSha = meta.commitSha || (randomHex(12));
    meta.buildTimestamp = meta.buildTimestamp || now.toISOString();
    meta.serviceTier = meta.serviceTier || 'standard';
    meta.region = meta.region || 'eu-west-2';
    meta.pseudonymisationLevel = meta.pseudonymisationLevel || 'none';
    // Replay semantics default false
    if (typeof meta.replayIndicator !== 'boolean') meta.replayIndicator = false;
    if (meta.replayIndicator && !meta.originalEventId) meta.originalEventId = uuid();

    // Compute integrityHash over canonical notify-data JSON (sorted keys) if not present
    if (!meta.integrityHash) {
      const canonicalise = (obj: any): string => {
        if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
        if (Array.isArray(obj)) return '[' + obj.map(canonicalise).join(',') + ']';
        const keys = Object.keys(obj).sort();
        return '{' + keys.map(k => JSON.stringify(k) + ':' + canonicalise(obj[k])).join(',') + '}';
      };
      const notifyData = payload['notify-data'] ?? {};
      const canonical = canonicalise(notifyData);
      const digest = crypto.createHash('sha256').update(canonical).digest('hex');
      meta.integrityHash = `sha256:${digest}`;
    }

    // 13. datacontenttype & dataschema stable defaults
    example.datacontenttype = 'application/json';
    if (!example.dataschema) {
      example.dataschema = 'https://nhsdigital.github.io/nhs-notify-standards/cloudevents/nhs-notify-example-event-data.schema.json';
    }

    // 14. Data classification defaults (pick consistent set)
    example.dataclassification = example.dataclassification || 'restricted';
    example.dataregulation = example.dataregulation || 'ISO-27001';
    example.datacategory = example.datacategory || 'sensitive';
  }

  fs.writeFileSync(outputPath, JSON.stringify(example, null, 2));
  console.log(`Example written to ${outputPath}`);
}

main();
