/**
 * HTTP test server lifecycle management utilities for integration tests.
 */

/**
 * Starts an Express application on an ephemeral port (port 0) bound to 127.0.0.1.
 * Prevents port collision and guarantees non-blocking socket cleanup.
 *
 * @param {import("express").Application} app Express application instance
 * @returns {Promise<{
 *   server: import("http").Server,
 *   port: number,
 *   baseUrl: string,
 *   fetch: (path: string, options?: RequestInit) => Promise<Response>,
 *   close: () => Promise<void>
 * }>}
 */
export async function startTestServer(app) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port =
        typeof address === "object" && address !== null ? address.port : 0;
      const baseUrl = `http://127.0.0.1:${port}`;

      /**
       * Convenience fetch wrapper that resolves relative paths against baseUrl.
       * @param {string} path URL path (e.g. "/api/v1/health")
       * @param {RequestInit} [options] Fetch options
       */
      const clientFetch = (path, options) => {
        const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
        return fetch(url, options);
      };

      /**
       * Closes the underlying HTTP server and releases sockets.
       * @returns {Promise<void>}
       */
      const close = () => {
        return new Promise((closeResolve, closeReject) => {
          server.close((err) => {
            if (err) {
              closeReject(err);
            } else {
              closeResolve();
            }
          });
        });
      };

      resolve({
        server,
        port,
        baseUrl,
        fetch: clientFetch,
        close,
      });
    });

    server.once("error", reject);
  });
}

/**
 * Runs an integration test with an ephemeral Express HTTP server.
 * Guarantees that the HTTP server is closed in a finally block regardless of test outcome.
 *
 * @param {import("express").Application} app Express application instance
 * @param {(client: {
 *   server: import("http").Server,
 *   port: number,
 *   baseUrl: string,
 *   fetch: (path: string, options?: RequestInit) => Promise<Response>
 * }) => Promise<unknown> | unknown} fn Test function
 * @returns {Promise<unknown>}
 */
export async function withTestServer(app, fn) {
  const client = await startTestServer(app);
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}
