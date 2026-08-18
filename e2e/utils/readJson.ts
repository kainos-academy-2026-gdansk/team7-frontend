import type { APIResponse } from "@playwright/test";

export async function readJson<T>(response: APIResponse): Promise<T> {
  return (await response.json()) as T;
}
