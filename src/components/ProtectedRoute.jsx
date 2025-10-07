import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

  if (!isAuthenticated) {
    // Redirect to the landing page if not authenticated
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />; // Render the child routes if authenticated
};

export default ProtectedRoute;
