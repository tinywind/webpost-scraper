export function webUrl(value: unknown, base?: string): URL | undefined {
  if (typeof value !== 'string' || !value.trim()) return;
  const url = URL.parse(value, base);
  if (url?.protocol === 'http:' || url?.protocol === 'https:') return url;
}
