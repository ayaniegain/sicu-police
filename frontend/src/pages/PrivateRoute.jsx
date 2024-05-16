

// PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  
  const token = localStorage.getItem('token');
  
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
