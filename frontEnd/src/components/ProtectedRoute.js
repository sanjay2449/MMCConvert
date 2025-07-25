// components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
