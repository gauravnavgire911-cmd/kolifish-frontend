import { API_BASE } from './config';

export async function getProducts() {
  const url = `${API_BASE}/api/products`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${url} failed: ${res.status} ${res.statusText} ${text}`.trim());
  }

  return await res.json();
}