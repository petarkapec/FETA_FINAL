// src/components/ProtectedRoute.tsx
import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token")

  // Ako nema tokena, preusmjeri na login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Ako ima tokena, prikaži zaštićenu rutu
  return <>{children}</>
}

export default ProtectedRoute
