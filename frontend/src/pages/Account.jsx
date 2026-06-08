import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ChevronDown, User as UserIcon, Package, KeyRound, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

const Account = () => {
  const { user, changePassword, updateUserProfile } = useAuth();
  const { orders } = useCart();
  const { toast } = useToast();
  const [tab, setTab] = useState('account');
  const [openItemsId, setOpenItemsId] = useState(null);
  const [openStatusId, setOpenStatusId] = useState(null);

  // Profile state
  const [mcName, setMcName] = useState(user?.mcName || '');
  const [email, setEmail] = useState(user?.email || '');

  // Password change state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  if (!user) return <Navigate to="/login" replace />;

  const userOrders = orders.filter(o => o.userId === user.username);

  const copyCoords = (c) => {
    navigator.clipboard.writeText(`${c.x} ${c.y} ${c.z}`);
    toast({ title: 'Coords copied!', description: `${c.x} ${c.y} ${c.z}` });
  };

  const saveProfile = () => {
    updateUserProfile({ mcName, email });
    toast({ title: 'Profile saved' });
  };

  const submitPasswordChange = (e) => {
    e.preventDefault();
    setPwdErr('');
    if (newPwd !== confirmPwd) { setPwdErr('Passwords do not match'); return; }
    const r = changePassword(currentPwd, newPwd);
    if (r.success) {
      toast({ title: 'Password changed!' });
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    } else {
      setPwdErr(r.error);
    }
  };

  const statusClass = (s) =>
    s === 'delivered' ? 'bg-[#1fae51] border-[#15813a] text-[#04150a]' :
    s === 'pending' ? 'bg-[#e0a522] border-[#9c7110] text-[#1a0f00]' :
    s === 'cancelled' ? 'bg-[#d83b3b] border-[#9a2424] text-[#1a0202]' :
    'bg-[#1cc4f0] border-[#08a0c8] text-[#052235]';

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
      <h1 className="pixel-font text-3xl text-white text-center mb-8" style={{ textShadow: '4px 4px 0 #08a0c8' }}>Account</h1>

      <div className="pixel-panel p-6">
        <div className="flex gap-1 border-b-2 border-[#25304a] mb-6 flex-wrap">
          {[
            { id: 'account', label: 'Account', Icon: UserIcon },
            { id: 'orders', label: 'Orders', Icon: Package },
            { id: 'password', label: 'Password', Icon: KeyRound },
          ].map(t => {
            const I = t.Icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`pixel-font text-xs px-5 py-3 border-2 border-b-0 -mb-[2px] inline-flex items-center gap-2 ${tab === t.id ? 'tab-active border-[#25304a]' : 'tab-inactive border-transparent'}`}>
                <I className="w-3 h-3" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'account' && (
          <div className="space-y-4 max-w-xl">
            <div className="pixel-panel-inner p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1cc4f0] border-2 border-[#08a0c8] flex items-center justify-center" style={{ boxShadow: '0 4px 0 #066d8a' }}>
                <UserIcon className="w-8 h-8 text-[#052235]" />
              </div>
              <div>
                <div className="pixel-font text-[#1cc4f0] text-sm">{user.mcName}</div>
                <div className="minecraft-font text-[#93b0d8] text-lg">@{user.username} · {user.role}</div>
              </div>
            </div>

            <div className="pixel-panel-inner p-4">
              <div className="pixel-font text-[#1cc4f0] text-xs mb-3">PROFILE</div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">MINECRAFT NAME</label>
                  <input className="pixel-input" value={mcName} onChange={e => setMcName(e.target.value)} />
                </div>
                <div>
                  <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">EMAIL</label>
                  <input className="pixel-input" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <button onClick={saveProfile} className="btn-green inline-flex items-center gap-2 mt-3"><Save className="w-3 h-3" /> Save Profile</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="pixel-panel-inner p-4">
                <div className="pixel-font text-[9px] text-[#6f88ad] mb-1">TOTAL ORDERS</div>
                <div className="minecraft-font text-[#1cc4f0] text-2xl">{userOrders.length}</div>
              </div>
              <div className="pixel-panel-inner p-4">
                <div className="pixel-font text-[9px] text-[#6f88ad] mb-1">TOTAL SPENT</div>
                <div className="minecraft-font text-[#1cc4f0] text-2xl">${userOrders.reduce((s,o)=>s+o.total,0).toFixed(2)}</div>
              </div>
            </div>

            <Link to="/shop" className="btn-cyan inline-block mt-4">Browse Shop</Link>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            {userOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-[#6f88ad] mx-auto mb-4" />
                <div className="minecraft-font text-[#93b0d8] text-xl mb-4">No orders yet</div>
                <Link to="/shop" className="btn-cyan inline-block">Start Shopping</Link>
              </div>
            ) : (
              <table className="pixel-table">
                <thead>
                  <tr>
                    <th style={{ width: '15%' }}>ID</th>
                    <th>Items</th>
                    <th style={{ width: '25%' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userOrders.map(o => (
                    <tr key={o.id}>
                      <td><span className="pixel-font text-sm text-[#cfe6ff]">{o.id}</span></td>
                      <td>
                        <div className="relative inline-block">
                          <button onClick={() => setOpenItemsId(openItemsId === o.id ? null : o.id)} className="btn-cyan inline-flex items-center gap-2" style={{ padding: '8px 14px' }}>
                            {o.items.reduce((s,i)=>s+i.qty, 0)}x Items <ChevronDown className="w-3 h-3" />
                          </button>
                          {openItemsId === o.id && (
                            <div className="absolute left-0 top-full mt-1 pixel-panel p-3 z-20 min-w-[220px]">
                              {o.items.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-2 py-1 minecraft-font text-[#cfe6ff] text-base">
                                  <span className="w-2 h-2 bg-[#1cc4f0]" />
                                  {it.qty}x {it.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="relative inline-block">
                          <button onClick={() => setOpenStatusId(openStatusId === o.id ? null : o.id)} className={`pixel-font text-[10px] uppercase inline-flex items-center gap-2 px-3 py-2 border-2 ${statusClass(o.status)}`}>
                            {o.status} <ChevronDown className="w-3 h-3" />
                          </button>
                          {openStatusId === o.id && (
                            <div className="absolute right-0 top-full mt-1 pixel-panel p-3 z-20 min-w-[200px]">
                              {o.coords && (o.coords.x || o.coords.y || o.coords.z) ? (
                                <>
                                  <div className="minecraft-font text-[#cfe6ff] text-base space-y-1">
                                    <div>X: {o.coords.x.toLocaleString()}</div>
                                    <div>Y: {o.coords.y}</div>
                                    <div>Z: {o.coords.z.toLocaleString()}</div>
                                  </div>
                                  <div className="border-t-2 border-[#25304a] mt-2 pt-2 space-y-1">
                                    <button onClick={() => copyCoords(o.coords)} className="minecraft-font text-[#1cc4f0] text-base hover:underline block w-full text-left">Copy coords</button>
                                  </div>
                                </>
                              ) : (
                                <div className="minecraft-font text-[#6f88ad] text-base">Coords not set yet.</div>
                              )}
                              {o.notes && (
                                <div className="border-t-2 border-[#25304a] mt-2 pt-2 minecraft-font text-[#cfe6ff] text-base">{o.notes}</div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'password' && (
          <form onSubmit={submitPasswordChange} className="space-y-4 max-w-md">
            <div className="pixel-font text-[#1cc4f0] text-xs mb-2">CHANGE PASSWORD</div>
            <div>
              <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">CURRENT PASSWORD</label>
              <input type="password" className="pixel-input" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} required />
            </div>
            <div>
              <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">NEW PASSWORD</label>
              <input type="password" className="pixel-input" value={newPwd} onChange={e => setNewPwd(e.target.value)} required />
            </div>
            <div>
              <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">CONFIRM NEW PASSWORD</label>
              <input type="password" className="pixel-input" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required />
            </div>
            {pwdErr && <div className="pixel-panel-inner p-3 minecraft-font text-[#d83b3b] text-lg text-center">{pwdErr}</div>}
            <button type="submit" className="btn-cyan">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Account;
