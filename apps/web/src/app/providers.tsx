import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Global providers (Theme, Auth, Query, etc.) will be added here in future PRs.
  return <BrowserRouter>{children}</BrowserRouter>;
}
