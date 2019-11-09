

export const get = (key, storage = window.localStorage) => {
  const item = storage.getItem(key);
  // Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : undefined;
}

export const set = (key, value, storage = window.localStorage) => {
  // Allow value to be a function so we have same API as useState
  const valueToStore = value instanceof Function ? value(value) : value;
  // Save to local storage
  storage.setItem(key, JSON.stringify(valueToStore));
}

export default {get, set};