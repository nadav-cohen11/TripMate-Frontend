import { createContext, useContext, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

const fetchAuthStatus = async () => {
  const res = await api.get('/users/auth/check');
  return res.data;
};

const signOut = async (refetch) => {
  try {
    await api.post('/users/logout');
    refetch();
  } catch (err) {
    refetch();
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['authStatus'],
    queryFn: fetchAuthStatus,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const value = useMemo(() => ({
    loading: isLoading,
    isAuthenticated: !!data?.userId,
    user: data?.userId || null,
    checkAuth: refetch,
    signOut: () => signOut(refetch),
  }), [data, isLoading, refetch]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
