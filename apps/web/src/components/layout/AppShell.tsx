import { Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <div
      className="app-layout"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <h1>StockPilot</h1>
      </header>
      <main style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
