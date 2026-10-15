export interface FrontendConfig {
  apiBaseUrl: string;
}

export function validateEnv(): FrontendConfig {
  // Vite exposes env vars via import.meta.env
  // Only variables prefixed with VITE_ are exposed to the client
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  return {
    apiBaseUrl,
  };
}

export const env = validateEnv();
