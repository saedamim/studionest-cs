
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const backendUrl: string | undefined =
    process.env.STUDIO_API_URL?.trim();

  if (!backendUrl) {
    return NextResponse.json(
      { message: "STUDIO_API_URL is not configured" },
      { status: 500 },
    );
  }

  // Remove trailing slash
  const baseUrl: string = backendUrl.replace(/\/+$/, "");

  const { path } = await context.params;

  if (
    !path?.length ||
    path.some((part) => !/^[a-zA-Z0-9_-]+$/.test(part))
  ) {
    return NextResponse.json(
      { message: "Invalid API path." },
      { status: 400 },
    );
  }

  const apiPath = path.join("/");
  const method = request.method.toUpperCase();

  const isStudioWrite =
    (apiPath === "studios" || /^studios\/[^/]+$/.test(apiPath)) &&
    method !== "GET";

  const isPrivateRoute =
    /^my-listings(?:\/[^/]+)?$/.test(apiPath) ||
    apiPath === "my-bookings" ||
    /^bookings\/[^/]+\/cancel$/.test(apiPath);

  const requiresAuth = isStudioWrite || isPrivateRoute;
  const headers = new Headers();

  if (requiresAuth) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Please sign in to continue." },
        { status: 401 },
      );
    }

    const tokenResponse = await auth.api.getToken({
      headers: request.headers,
    });

    if (!tokenResponse?.token) {
      return NextResponse.json(
        { message: "Could not create an access token." },
        { status: 401 },
      );
    }

    headers.set("Authorization", `Bearer ${tokenResponse.token}`);
  }

  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const query = request.nextUrl.search;

  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await request.text();

  try {
    const upstream = await fetch(
      `${baseUrl}/${apiPath}${query}`,
      {
        method,
        headers,
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );

    const responseHeaders = new Headers();
    const upstreamContentType =
      upstream.headers.get("content-type");

    if (upstreamContentType) {
      responseHeaders.set("Content-Type", upstreamContentType);
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Backend API Error:", error);

    return NextResponse.json(
      { message: "StudioNest API is unavailable." },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
