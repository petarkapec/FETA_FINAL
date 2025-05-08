import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = () => {
  const token = localStorage.getItem("tokenuser")

  // If no user token, redirect to nickname form
  if (!token) {
    return <Navigate to="/nickform" replace />
  }

  // If authenticated as user, render the protected route
  return <Outlet />
}

export default PrivateRoute
