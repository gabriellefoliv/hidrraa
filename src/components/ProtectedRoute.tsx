// src/components/ProtectedRoute.tsx
import { useAuth } from "@/context/auth";
import { Navigate } from "react-router-dom";

import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
