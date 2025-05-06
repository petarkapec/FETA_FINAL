import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('tokenuser');

  // Ako nema tokena, preusmjeri na /nickform
  if (!token) {
    return <Navigate to="/nickform" replace />;
  }

  // Ako postoji token, renderiraj sljedeći sadržaj rute
  return <Outlet />;
};

export default PrivateRoute;
