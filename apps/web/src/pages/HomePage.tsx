import { env } from "../config/env";

export function HomePage() {
  return (
    <div>
      <h2>Welcome to StockPilot</h2>
      <p>StockPilot frontend is running.</p>
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <strong>Environment Info:</strong>
        <pre>API Base URL: {env.apiBaseUrl}</pre>
      </div>
    </div>
  );
}
