import { Navigate, Outlet } from "react-router-dom"

const DjPrivateRoute = () => {
  const token = localStorage.getItem("token")
  const djData = localStorage.getItem("dj")

  // If no token or DJ data, redirect to login
  if (!token || !djData) {
    return <Navigate to="/login" replace />
  }

  // If authenticated as DJ, render the protected route
  return <Outlet />
}

export default DjPrivateRoute
