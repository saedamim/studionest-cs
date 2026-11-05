import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const backendUrl = process.env.STUDIO_API_URL || process.env.API_URL || "http://localhost:8000";
async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  if (!path.length || path.some((part) => !/^[a-zA-Z0-9_-]+$/.test(part))) {
    return NextResponse.json({ message: "Invalid API path." }, { status: 400 });
  }

  const apiPath = path.join("/");
  const method = request.method.toUpperCase();
  const isStudioWrite = (apiPath === "studios" || /^studios\/[^/]+$/.test(apiPath)) && method !== "GET";
  const isPrivateRoute = /^my-listings(?:\/[^/]+)?$/.test(apiPath) ||
    apiPath === "my-bookings" || /^bookings\/[^/]+\/cancel$/.test(apiPath);
  const requiresAuth = isStudioWrite || isPrivateRoute;
  const headers = new Headers();

  if (requiresAuth) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ message: "Please sign in to continue." }, { status: 401 });
    }

    const tokenResponse = await auth.api.getToken({ headers: request.headers });
    if (!tokenResponse?.token) {
      return NextResponse.json({ message: "Could not create an access token." }, { status: 401 });
    }
    headers.set("Authorization", `Bearer ${tokenResponse.token}`);
  }

  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  const query = request.nextUrl.search;
  const body = method === "GET" || method === "HEAD" ? undefined : await request.text();

  let upstream: Response;
  try {
    upstream = await fetch(`${backendUrl.replace(/\/$/, "")}/${apiPath}${query}`, {
      method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return NextResponse.json({ message: "StudioNest API is unavailable. Check that the backend is running." }, { status: 502 });
  }

  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get("content-type");
  if (upstreamContentType) responseHeaders.set("Content-Type", upstreamContentType);
  return new NextResponse(upstream.body, { status: upstream.status, headers: responseHeaders });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
