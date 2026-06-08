import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../mock';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(MOCK_USERS);

  useEffect(() => {
    const saved = localStorage.getItem('jvaultx_user');
    if (saved) setUser(JSON.parse(saved));
    const savedUsers = localStorage.getItem('jvaultx_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    else localStorage.setItem('jvaultx_users', JSON.stringify(MOCK_USERS));
  }, []);

  const login = (username, password) => {
    const allUsers = JSON.parse(localStorage.getItem('jvaultx_users') || '[]');
    const found = allUsers.find(u => u.username === username && u.password === password);
    if (found) {
      const safeUser = { username: found.username, role: found.role, mcName: found.mcName, email: found.email };
      setUser(safeUser);
      localStorage.setItem('jvaultx_user', JSON.stringify(safeUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const register = (username, password, mcName, email) => {
    const allUsers = JSON.parse(localStorage.getItem('jvaultx_users') || '[]');
    if (allUsers.find(u => u.username === username)) {
      return { success: false, error: 'Username already exists' };
    }
    const newUser = { username, password, mcName, email, role: 'user' };
    const updated = [...allUsers, newUser];
    setUsers(updated);
    localStorage.setItem('jvaultx_users', JSON.stringify(updated));
    const safeUser = { username, role: 'user', mcName, email };
    setUser(safeUser);
    localStorage.setItem('jvaultx_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jvaultx_user');
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
