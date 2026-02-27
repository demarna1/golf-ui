import { createContext, useState, useEffect } from 'react';
import { onAuthStateChange } from '../firebase/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not authed
  useEffect(() => onAuthStateChange(setUser), []);

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
}
