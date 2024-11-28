export function setItemSessionStorage(key: string, value: string | boolean | any): void {
  // Check if value is a string or boolean
  if (typeof value === 'string' || typeof value === 'boolean') {
    // Directly store string or boolean
    sessionStorage.setItem(key, String(value));
  } else {
    // If it's neither string nor boolean, convert it to a string
    sessionStorage.setItem(key, JSON.stringify(value));
  }
}

export function getItemSessionStorage(key: string): string | boolean | null {
  const storedValue: string | boolean | null = sessionStorage.getItem(key);
  return storedValue;
}

