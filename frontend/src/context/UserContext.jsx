// src/context/UserContext.jsx
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const defaultUser = { name: 'User', email: '', avatar: null, avatarType: null, role: 'Engineer' };

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aerosense-user');
      if (saved) return { ...defaultUser, ...JSON.parse(saved) };
      // Try to read name from login
      return defaultUser;
    } catch { return defaultUser; }
  });

  const updateUser = (updates) => {
    const next = { ...user, ...updates };
    setUser(next);
    localStorage.setItem('aerosense-user', JSON.stringify(next));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
