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
      } catch (err) {
        setUserId(null);
        navigate('/login');
      }
    };

    if (!userId) {
      checkAuth();
    } else {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
        credentials: 'include',
      }).then((res) => {
        if (!res.ok) {
          setUserId(null);
          navigate('/login');
        }
      });
    }
  }, [navigate, userId]);
  
  

  return children;
};

export default ProtectedRoute;
