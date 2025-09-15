import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  // 1. While the auth state is loading from localStorage, show a simple loading message.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 2. Once loading is finished, if there is a token, render the protected page.
  if (token) {
    return <Outlet />;
  }

  // 3. If loading is finished and there's no token, redirect the user to the login page.
  return <Navigate to="/login" />;
};

export default ProtectedRoute;