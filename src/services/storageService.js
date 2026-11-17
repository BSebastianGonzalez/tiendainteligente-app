const PREFIX = 'ti_';

export function read(key, fallback) {
  try {
    const value = localStorage.getItem(`${PREFIX}${key}`);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  return value;
}

export function remove(key) {
  localStorage.removeItem(`${PREFIX}${key}`);
}

export function now() {
  return new Date().toISOString();
}

export function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
