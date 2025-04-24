export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// This is the instrumentation hook that Next.js will call during request handling
export function onRequestError({
  request,
  response,
  error,
}: {
  request: unknown;
  response: unknown;
  error: Error;
}) {
  // Import Sentry dynamically to avoid bundling it on the client
  const Sentry = require("@sentry/nextjs");

  // Capture the error with Sentry
  Sentry.captureRequestError({
    error,
    request,
    response,
  });
}
