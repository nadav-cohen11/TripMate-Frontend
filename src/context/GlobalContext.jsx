import { createContext, useContext, useState,useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

  useEffect(() => {
    const interval = setInterval(() => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId !== userId) {
        setUserId(storedUserId);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <GlobalContext.Provider value={{ userId, setUserId }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
