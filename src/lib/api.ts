const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type ApiErrorBody = { message?: string };

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Requests the short-lived Better Auth JWT from the same Next.js origin. */
async function getAccessToken() {
  const response = await fetch("/api/auth/token", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiError("Please sign in to continue.", response.status);
  }

  const data = (await response.json()) as { token?: string };
  if (!data.token) throw new ApiError("Could not get an access token.", 401);
  return data.token;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (authenticated) {
    headers.set("Authorization", `Bearer ${await getAccessToken()}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
    throw new ApiError(body.message || "The request could not be completed.", response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
