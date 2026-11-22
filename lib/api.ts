import 'server-only';

const rawBase = process.env.API_BASE_URL?.replace(/\/$/, '');
const apiKey = process.env.API_KEY;
const keyHeader = process.env.API_KEY_HEADER || 'x-api-key';
const authScheme = process.env.API_AUTH_SCHEME?.toLowerCase();

/**
 * The upstream API key only ever lives here, on the server.
 * Never expose it through a NEXT_PUBLIC_ variable or pass it to a client component.
 */
export function isApiConfigured(): boolean {
  return Boolean(rawBase || apiKey);
}

function config() {
  if (!rawBase && !apiKey) {
    return null;
  }
  if (!rawBase || !apiKey) {
    throw new Error(
      'Set both API_BASE_URL and API_KEY (or neither to use the built-in sample data).',
    );
  }
  return { base: rawBase, key: apiKey };
}

function headers(): Record<string, string> {
  const { key } = config()!;
  const common = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (authScheme === 'bearer') {
    return { ...common, Authorization: `Bearer ${key}` };
  }
  return { ...common, [keyHeader]: key };
}

type RequestOptions<T> = {
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
  fallback: T;
};

export async function apiRequest<T>(path: string, options: RequestOptions<T>): Promise<T> {
  const settings = config();
  if (!settings) {
    return options.fallback;
  }

  const response = await fetch(`${settings.base}${path}`, {
    method: options.method ?? 'GET',
    headers: headers(),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Upstream API ${options.method ?? 'GET'} ${path} failed: ${response.status}`);
  }

  if (response.status === 204) {
    return options.fallback;
  }

  return (await response.json()) as T;
}
