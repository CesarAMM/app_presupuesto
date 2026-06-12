import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

// Usamos ReactNode, que es el estándar de React para envolver componentes
interface ProtectedRouteProps {
  children: ReactNode; 
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const usuarioActivo = localStorage.getItem('usuarioActivo');

  if (!usuarioActivo) {
    return <Navigate to="/login" replace />;
  }

  // Envolvemos a los children en un fragmento para evitar problemas de tipos
  return <>{children}</>;
}