const columns = [
  'id', 'claim', 'status', 'value', 'unit', 'datasetYear',
  'population', 'numerator', 'denominator', 'sourceUrl',
  'evidenceTimestamp', 'limitations'
];

const verifiedStatuses = new Set(['VERIFIED', 'VERIFIED WITH QUALIFICATIONS']);
const validStatuses = new Set([
  ...verifiedStatuses, 'INCONSISTENT', 'UNVERIFIED', 'NOT REPRODUCIBLE'
]);

function cell(value, field) {
  if (value == null) return '';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`Nonfinite ${field}`);
    return String(value);
  }
  if (typeof value !== 'string') throw new TypeError(`Invalid ${field}`);
  const text = value.replace(/[\t\r\n]+/g, ' ');
  return /^\s*[=+\-@]/u.test(text) ? `'${text}` : text;
}

function validateJson(value, ancestors) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('Nonfinite value');
    return;
  }
  if (typeof value !== 'object') throw new TypeError('Invalid historical value');
  if (ancestors.has(value)) throw new TypeError('Cyclic historical value');

  const isArray = Array.isArray(value);
  if (!isArray && Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null) {
    throw new TypeError('Invalid historical value');
  }

  ancestors.add(value);
  try {
    const descriptors = Object.getOwnPropertyDescriptors(value);
    if (isArray) {
      for (let index = 0; index < value.length; index += 1) {
        const descriptor = descriptors[index];
        if (!descriptor || !Object.hasOwn(descriptor, 'value')) {
          throw new TypeError('Invalid historical value');
        }
        validateJson(descriptor.value, ancestors);
      }
      if (Reflect.ownKeys(value).length !== value.length + 1) {
        throw new TypeError('Invalid historical value');
      }
    } else {
      for (const key of Reflect.ownKeys(value)) {
        if (typeof key !== 'string') throw new TypeError('Invalid historical value');
        const descriptor = descriptors[key];
        if (!descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) {
          throw new TypeError('Invalid historical value');
        }
        validateJson(descriptor.value, ancestors);
      }
    }
  } finally {
    ancestors.delete(value);
  }
}

function valueCell(value, active) {
  if (value == null) return '';
  if (active) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError('Invalid quantitative value');
    }
    return cell(value, 'value');
  }
  if (typeof value === 'string' || typeof value === 'number') return cell(value, 'value');
  if (!Array.isArray(value) &&
      (typeof value !== 'object' || value === null)) {
    throw new TypeError('Invalid historical value');
  }
  validateJson(value, new Set());
  return cell(JSON.stringify(value), 'value');
}

function sourceUrl(value) {
  if (value == null || value === '') return '';
  if (typeof value !== 'string' || /[\s\\()<>"'\u0000-\u001f\u007f]/u.test(value)) {
    throw new TypeError('Unsafe source URL');
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new TypeError('Unsafe source URL');
  }
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) {
    throw new TypeError('Unsafe source URL');
  }
  return cell(value, 'sourceUrl');
}

function limitationsCell(value) {
  if (value == null) return '';
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
    throw new TypeError('Invalid limitations');
  }
  return cell(value.join('; '), 'limitations');
}

export function claimsToTsv(claims, options = {}) {
  if (!Array.isArray(claims)) throw new TypeError('Claims must be an array');
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Invalid options');
  }
  if (Object.keys(options).some(key => key !== 'includeHistory') ||
      (Object.hasOwn(options, 'includeHistory') && typeof options.includeHistory !== 'boolean')) {
    throw new TypeError('Invalid options');
  }

  const includeHistory = Object.hasOwn(options, 'includeHistory') && options.includeHistory;
  const seen = new Set();
  const rows = [columns.join('\t')];

  for (const claim of claims) {
    if (claim === null || typeof claim !== 'object' || Array.isArray(claim)) {
      throw new TypeError('Invalid claim');
    }
    if ((typeof claim.id !== 'string' && typeof claim.id !== 'number') ||
        (typeof claim.id === 'number' && !Number.isFinite(claim.id)) ||
        String(claim.id).trim() === '') {
      throw new TypeError('Invalid claim identity');
    }
    const identity = String(claim.id);
    if (seen.has(identity)) throw new TypeError('Duplicate claim identity');
    seen.add(identity);
    if (!validStatuses.has(claim.status)) throw new TypeError('Invalid claim status');
    if (claim.eligibleForBrief != null && typeof claim.eligibleForBrief !== 'boolean') {
      throw new TypeError('Invalid brief eligibility');
    }

    const active = claim.eligibleForBrief === true && verifiedStatuses.has(claim.status);
    if (!includeHistory && !active) continue;

    const fields = columns.map(field => {
      if (field === 'value') return valueCell(claim.value, active);
      if (field === 'limitations') return limitationsCell(claim.limitations);
      if (field === 'sourceUrl') return sourceUrl(claim.sourceUrl);
      return cell(claim[field], field);
    });
    rows.push(fields.join('\t'));
  }

  return `${rows.join('\n')}\n`;
}
