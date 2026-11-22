'use client';

import { useCallback, useSyncExternalStore } from 'react';

type Snapshot<T> = {
  data: T;
  loading: boolean;
  error: string | null;
};

type Entry<T> = {
  snapshot: Snapshot<T>;
  listeners: Set<() => void>;
  started: boolean;
};

// A tiny module-level store keeps fetched data outside React state. Components
// subscribe with useSyncExternalStore, which is React's recommended pattern for
// external data and avoids setState inside effects.
const entries = new Map<string, Entry<unknown>>();

function entryFor<T>(url: string, initialValue: T): Entry<T> {
  let entry = entries.get(url) as Entry<T> | undefined;
  if (!entry) {
    entry = {
      snapshot: { data: initialValue, loading: true, error: null },
      listeners: new Set(),
      started: false,
    };
    entries.set(url, entry as Entry<unknown>);
  }
  return entry;
}

function publish<T>(entry: Entry<T>, patch: Partial<Snapshot<T>>) {
  entry.snapshot = { ...entry.snapshot, ...patch };
  for (const listener of entry.listeners) listener();
}

function ensureLoaded<T>(entry: Entry<T>, url: string) {
  if (!entry.started) {
    entry.started = true;
    void load(entry, url);
  }
}

async function load<T>(entry: Entry<T>, url: string) {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    const data = (await response.json()) as T;
    publish(entry, { data, loading: false, error: null });
  } catch (cause) {
    publish(entry, {
      loading: false,
      error: cause instanceof Error ? cause.message : 'Unable to load data',
    });
  }
}

export function useApi<T>(url: string, initialValue: T) {
  const entry = entryFor(url, initialValue);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      entry.listeners.add(onStoreChange);
      ensureLoaded(entry, url);
      return () => {
        entry.listeners.delete(onStoreChange);
      };
    },
    [entry, url],
  );

  const getSnapshot = useCallback(() => entry.snapshot, [entry]);

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setData = useCallback(
    (next: T | ((previous: T) => T)) => {
      const value =
        typeof next === 'function'
          ? (next as (previous: T) => T)(entry.snapshot.data)
          : next;
      publish(entry, { data: value });
    },
    [entry],
  );

  const refresh = useCallback(() => {
    publish(entry, { loading: true, error: null });
    void load(entry, url);
  }, [entry, url]);

  return {
    data: state.data,
    setData,
    loading: state.loading,
    error: state.error,
    refresh,
  };
}

export async function apiSend<T>(url: string, method: 'POST' | 'DELETE', body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status})`);
  }
  return payload;
}
