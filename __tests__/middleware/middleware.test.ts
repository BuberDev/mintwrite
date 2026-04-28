/**
 * ─── Middleware: Route Protection ─────────────────────────────────────────────
 *
 * Tests the edge middleware that protects authenticated routes by checking
 * for the session cookie and redirecting to sign-in if absent.
 */

import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import middleware from "@/middleware";

function createMockRequest(
  pathname: string,
  cookies: Record<string, string> = {}
): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  const req = new NextRequest(url);

  for (const [name, value] of Object.entries(cookies)) {
    req.cookies.set(name, value);
  }

  return req;
}

// ─── Protected routes ─────────────────────────────────────────────────────────

describe("Middleware: Protected routes", () => {
  const protectedPaths = [
    "/dashboard",
    "/generate/twitter-thread",
    "/history",
    "/projects/new",
    "/billing",
    "/account",
  ];

  it.each(protectedPaths)(
    "should redirect %s to sign-in when no session cookie",
    (path) => {
      const req = createMockRequest(path);
      const res = middleware(req);

      expect(res.status).toBe(307);
      const location = res.headers.get("location");
      expect(location).toContain("/sign-in");
      expect(location).toContain(`redirect_url=${encodeURIComponent(path)}`);
    }
  );

  it.each(protectedPaths)(
    "should allow %s when session cookie is present",
    (path) => {
      const req = createMockRequest(path, {
        mintwrite_session: "valid-token-here",
      });
      const res = middleware(req);

      // NextResponse.next() returns 200
      expect(res.status).toBe(200);
    }
  );
});

// ─── Public routes ────────────────────────────────────────────────────────────

describe("Middleware: Public routes", () => {
  const publicPaths = ["/", "/sign-in", "/sign-up", "/pricing", "/forgot-password"];

  it.each(publicPaths)(
    "should allow %s without session cookie",
    (path) => {
      const req = createMockRequest(path);
      const res = middleware(req);

      // Should NOT redirect
      expect(res.status).toBe(200);
    }
  );
});

// ─── API routes ───────────────────────────────────────────────────────────────

describe("Middleware: API routes", () => {
  it("should not block webhook endpoints", () => {
    const req = createMockRequest("/api/webhooks/stripe");
    const res = middleware(req);
    expect(res.status).toBe(200);
  });

  it("should not block auth endpoints", () => {
    const req = createMockRequest("/api/auth/sign-in");
    const res = middleware(req);
    expect(res.status).toBe(200);
  });
});
