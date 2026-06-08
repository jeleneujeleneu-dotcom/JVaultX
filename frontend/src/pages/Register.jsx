import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const Register = () => {
  const { user, register } = useAuth();
  const nav = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ username: '', password: '', mcName: '', email: '' });
  const [err, setErr] = useState('');

  if (user) return <Navigate to="/account" replace />;

  const onSubmit = (e) => {
    e.preventDefault();
    setErr('');
    if (form.password.length < 4) { setErr('Password too short (min 4)'); return; }
    const r = register(form.username, form.password, form.mcName, form.email);
    if (r.success) {
      toast({ title: 'Account created!', description: `Welcome ${form.mcName}!` });
      nav('/account');
    } else setErr(r.error);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="relative z-10 max-w-md mx-auto px-6 py-16">
      <div className="pixel-panel p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-[#1cc4f0] border-2 border-[#08a0c8] flex items-center justify-center" style={{ boxShadow: '0 4px 0 #066d8a' }}>
            <UserPlus className="w-5 h-5 text-[#052235]" />
          </div>
          <h1 className="pixel-font text-xl text-white">Register</h1>
          <p className="minecraft-font text-[#93b0d8] text-lg mt-2">Create your JVaultX account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">USERNAME</label>
            <input className="pixel-input" value={form.username} onChange={set('username')} required />
          </div>
          <div>
            <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">MINECRAFT NAME</label>
            <input className="pixel-input" value={form.mcName} onChange={set('mcName')} required />
          </div>
          <div>
            <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">EMAIL</label>
            <input type="email" className="pixel-input" value={form.email} onChange={set('email')} required />
          </div>
          <div>
            <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">PASSWORD</label>
            <input type="password" className="pixel-input" value={form.password} onChange={set('password')} required />
          </div>
          {err && <div className="pixel-panel-inner p-3 minecraft-font text-[#d83b3b] text-lg text-center">{err}</div>}
          <button type="submit" className="btn-cyan w-full">Create Account</button>
        </form>

        <div className="mt-6 pt-4 border-t-2 border-[#25304a] text-center">
          <p className="minecraft-font text-[#93b0d8] text-base">
            Have account? <Link to="/login" className="text-[#1cc4f0] hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
