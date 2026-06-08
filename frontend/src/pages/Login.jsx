import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  if (user) return <Navigate to="/account" replace />;

  const onSubmit = (e) => {
    e.preventDefault();
    setErr('');
    const r = login(username, password);
    if (r.success) {
      toast({ title: 'Welcome back!', description: `Logged in as ${username}` });
      nav('/account');
    } else {
      setErr(r.error);
    }
  };

  return (
    <div className="relative z-10 max-w-md mx-auto px-6 py-16">
      <div className="pixel-panel p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-[#1cc4f0] border-2 border-[#08a0c8] flex items-center justify-center" style={{ boxShadow: '0 4px 0 #066d8a' }}>
            <LogIn className="w-5 h-5 text-[#052235]" />
          </div>
          <h1 className="pixel-font text-xl text-white">Login</h1>
          <p className="minecraft-font text-[#93b0d8] text-lg mt-2">Enter your credentials to continue</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">USERNAME</label>
            <input className="pixel-input" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">PASSWORD</label>
            <input type="password" className="pixel-input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {err && <div className="pixel-panel-inner p-3 minecraft-font text-[#d83b3b] text-lg text-center">{err}</div>}
          <button type="submit" className="btn-cyan w-full">Login</button>
        </form>

        <div className="mt-6 pt-4 border-t-2 border-[#25304a] text-center">
          <p className="minecraft-font text-[#93b0d8] text-base">
            No account? <Link to="/register" className="text-[#1cc4f0] hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
