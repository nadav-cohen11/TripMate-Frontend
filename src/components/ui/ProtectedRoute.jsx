import React, { useEffect } from 'react';
import Login from '../../pages/Auth/Login';
import { useGlobalContext } from '@/context/GlobalContext';
import { useNavigate } from 'react-router-dom'; 

const ProtectedRoute = ({ children }) => {
  const { userId, setUserId } = useGlobalContext();
  const navigate = useNavigate(); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            credentials: 'include',
          },
        );

        if (!res.ok) throw new Error('Not authenticated');

        const data = await res.json();
        setUserId(data.userId);
        return data;
      } catch (err) {
        setUserId(null);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  if (!userId) {
    return <Login />;
  }
  return children;
};

export default ProtectedRoute;
