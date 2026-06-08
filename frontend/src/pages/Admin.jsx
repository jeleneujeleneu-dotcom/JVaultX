import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, Package, Users, DollarSign, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../mock';
import { useToast } from '../hooks/use-toast';

const Admin = () => {
  const { user, users } = useAuth();
  const { orders, updateOrderStatus } = useCart();
  const { toast } = useToast();
  const [tab, setTab] = useState('overview');
  const [openId, setOpenId] = useState(null);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/account" replace />;

  const allUsers = JSON.parse(localStorage.getItem('jvaultx_users') || '[]');
  const totalRevenue = orders.reduce((s,o) => s + o.total, 0);

  const handleStatusChange = (id, status) => {
    updateOrderStatus(id, status);
    setOpenId(null);
    toast({ title: 'Status updated', description: `Order #${id} → ${status}` });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', Icon: Shield },
    { id: 'orders', label: 'Orders', Icon: Package },
    { id: 'products', label: 'Products', Icon: DollarSign },
    { id: 'users', label: 'Users', Icon: Users },
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-6 h-6 text-[#1cc4f0]" />
        <h1 className="pixel-font text-2xl text-white" style={{ textShadow: '3px 3px 0 #08a0c8' }}>Admin Panel</h1>
      </div>

      <div className="pixel-panel p-6">
        <div className="flex gap-1 border-b-2 border-[#25304a] mb-6 flex-wrap">
          {tabs.map(t => {
            const I = t.Icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`pixel-font text-xs px-4 py-3 border-2 border-b-0 -mb-[2px] inline-flex items-center gap-2 ${tab === t.id ? 'tab-active border-[#25304a]' : 'tab-inactive border-transparent'}`}>
                <I className="w-3 h-3" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { l: 'Total Orders', v: orders.length, c: '#1cc4f0' },
              { l: 'Revenue', v: `$${totalRevenue.toFixed(2)}`, c: '#1fae51' },
              { l: 'Users', v: allUsers.length, c: '#e0a522' },
              { l: 'Products', v: PRODUCTS.length, c: '#d83b3b' },
            ].map(s => (
              <div key={s.l} className="pixel-panel-inner p-5">
                <div className="pixel-font text-[9px] text-[#6f88ad] mb-2">{s.l.toUpperCase()}</div>
                <div className="pixel-font text-2xl" style={{ color: s.c }}>{s.v}</div>
              </div>
            ))}
            <div className="md:col-span-4 pixel-panel-inner p-5">
              <div className="pixel-font text-[#1cc4f0] text-sm mb-3">RECENT ORDERS</div>
              <table className="pixel-table">
                <thead><tr><th>ID</th><th>User</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id}>
                      <td className="pixel-font text-xs">{o.id}</td>
                      <td>{o.userId}</td>
                      <td className="text-[#1cc4f0]">${o.total.toFixed(2)}</td>
                      <td><span className={`status-pill status-${o.status}`}>{o.status}</span></td>
                      <td>{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <table className="pixel-table">
            <thead><tr><th>ID</th><th>User</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="pixel-font text-xs">{o.id}</td>
                  <td>{o.userId}</td>
                  <td>{o.items.reduce((s,i)=>s+i.qty,0)}x items</td>
                  <td className="text-[#1cc4f0]">${o.total.toFixed(2)}</td>
                  <td>
                    <div className="relative inline-block">
                      <button onClick={() => setOpenId(openId === o.id ? null : o.id)} className={`pixel-font text-[10px] uppercase inline-flex items-center gap-2 px-3 py-2 border-2 ${
                        o.status === 'delivered' ? 'bg-[#1fae51] border-[#15813a] text-[#04150a]' :
                        o.status === 'pending' ? 'bg-[#e0a522] border-[#9c7110] text-[#1a0f00]' :
                        o.status === 'cancelled' ? 'bg-[#d83b3b] border-[#9a2424] text-[#1a0202]' :
                        'bg-[#1cc4f0] border-[#08a0c8] text-[#052235]'
                      }`}>
                        {o.status} <ChevronDown className="w-3 h-3" />
                      </button>
                      {openId === o.id && (
                        <div className="absolute right-0 top-full mt-1 pixel-panel p-2 z-20 min-w-[140px]">
                          {['pending', 'processing', 'delivered', 'cancelled'].map(s => (
                            <button key={s} onClick={() => handleStatusChange(o.id, s)} className="minecraft-font text-[#cfe6ff] text-base hover:text-[#1cc4f0] block w-full text-left px-2 py-1 capitalize">{s}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'products' && (
          <table className="pixel-table">
            <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
            <tbody>
              {PRODUCTS.map(p => (
                <tr key={p.id}>
                  <td className="pixel-font text-xs">{p.id}</td>
                  <td>{p.name}</td>
                  <td className="capitalize">{p.category}</td>
                  <td className="text-[#1cc4f0]">${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'users' && (
          <table className="pixel-table">
            <thead><tr><th>Username</th><th>MC Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {allUsers.map(u => (
                <tr key={u.username}>
                  <td className="pixel-font text-xs">{u.username}</td>
                  <td>{u.mcName}</td>
                  <td>{u.email}</td>
                  <td><span className={`status-pill ${u.role === 'admin' ? 'status-processing' : 'status-delivered'}`}>{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;
