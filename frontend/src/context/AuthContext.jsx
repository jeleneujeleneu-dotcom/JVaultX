import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../mock';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('jvaultx_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('jvaultx_users');
      return saved ? JSON.parse(saved) : MOCK_USERS;
    } catch { return MOCK_USERS; }
  });

  useEffect(() => {
    const savedUsers = localStorage.getItem('jvaultx_users');
    if (!savedUsers) localStorage.setItem('jvaultx_users', JSON.stringify(MOCK_USERS));
  }, []);

  const getAllUsers = () => JSON.parse(localStorage.getItem('jvaultx_users') || '[]');
  const persistUsers = (list) => {
    setUsers(list);
    localStorage.setItem('jvaultx_users', JSON.stringify(list));
  };

  const login = (username, password) => {
    const all = getAllUsers();
    const found = all.find(u => u.username === username && u.password === password);
    if (found) {
      const safeUser = { username: found.username, role: found.role, mcName: found.mcName, email: found.email };
      setUser(safeUser);
      localStorage.setItem('jvaultx_user', JSON.stringify(safeUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const register = (username, password, mcName, email) => {
    const all = getAllUsers();
    if (all.find(u => u.username === username)) {
      return { success: false, error: 'Username already exists' };
    }
    const newUser = { username, password, mcName, email, role: 'user' };
    persistUsers([...all, newUser]);
    const safeUser = { username, role: 'user', mcName, email };
    setUser(safeUser);
    localStorage.setItem('jvaultx_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jvaultx_user');
  };

  const changePassword = (currentPwd, newPwd) => {
    if (!user) return { success: false, error: 'Not logged in' };
    const all = getAllUsers();
    const idx = all.findIndex(u => u.username === user.username);
    if (idx === -1) return { success: false, error: 'User not found' };
    if (all[idx].password !== currentPwd) return { success: false, error: 'Current password is wrong' };
    if (newPwd.length < 4) return { success: false, error: 'New password too short (min 4)' };
    all[idx].password = newPwd;
    persistUsers(all);
    return { success: true };
  };

  const updateUserRole = (username, role) => {
    const all = getAllUsers();
    const updated = all.map(u => u.username === username ? { ...u, role } : u);
    persistUsers(updated);
    if (user && user.username === username) {
      const newUser = { ...user, role };
      setUser(newUser);
      localStorage.setItem('jvaultx_user', JSON.stringify(newUser));
    }
    return { success: true };
  };

  const updateUserProfile = (patch) => {
    if (!user) return;
    const all = getAllUsers();
    const updated = all.map(u => u.username === user.username ? { ...u, ...patch } : u);
    persistUsers(updated);
    const newUser = { ...user, ...patch };
    setUser(newUser);
    localStorage.setItem('jvaultx_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, changePassword, updateUserRole, updateUserProfile, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
