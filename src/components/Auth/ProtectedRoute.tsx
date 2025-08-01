// src/components/ProtectedRoute.tsx
import { useAuth } from "@/context/auth";
import { Navigate } from "react-router-dom";

import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
