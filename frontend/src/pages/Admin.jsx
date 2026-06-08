import React, { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, Package, Users, DollarSign, ChevronDown, Edit3, Save, X, Plus, Trash2, RotateCcw, TicketPercent, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { CATEGORIES, PRIORITIES, DELIVERY_OPTIONS } from '../mock';
import { useToast } from '../hooks/use-toast';

const ROLES = ['user', 'delivery', 'admin'];

const Admin = () => {
  const { user, getAllUsers, updateUserRole } = useAuth();
  const {
    orders, updateOrderStatus, updateOrderCoords, updateOrderItems, updateOrderPriority,
    discounts, addDiscount, updateDiscount, deleteDiscount,
  } = useCart();
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useShop();
  const { toast } = useToast();

  const [tab, setTab] = useState(user?.role === 'delivery' ? 'orders' : 'overview');

  // Orders
  const [openStatusId, setOpenStatusId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ x: 0, y: 0, z: 0, notes: '', items: [] });
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Products
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductOpen, setNewProductOpen] = useState(false);
  const emptyProduct = { name: '', category: 'kits', price: 0, image: '', description: '', stock: 100 };
  const [productForm, setProductForm] = useState(emptyProduct);

  // Discounts
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [newDiscountOpen, setNewDiscountOpen] = useState(false);
  const emptyDiscount = { code: '', type: 'percent', value: 10, expiresAt: '', maxUses: 0 };
  const [discountForm, setDiscountForm] = useState(emptyDiscount);

  const filteredOrders = useMemo(() => {
    if (priorityFilter === 'all') return orders;
    return orders.filter(o => (o.priority || 'low') === priorityFilter);
  }, [orders, priorityFilter]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin' && user.role !== 'delivery') return <Navigate to="/account" replace />;

  const isAdmin = user.role === 'admin';
  const allUsers = getAllUsers();
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  // Orders handlers
  const handleStatusChange = (id, status) => {
    updateOrderStatus(id, status);
    setOpenStatusId(null);
    toast({ title: 'Status updated', description: `Order #${id} → ${status}` });
  };
  const handlePriorityChange = (id, priority) => {
    updateOrderPriority(id, priority);
    toast({ title: 'Priority updated', description: `Order #${id} → ${priority}` });
  };
  const openOrderEdit = (o) => {
    setEditingId(o.id);
    setEditForm({
      x: o.coords?.x || 0, y: o.coords?.y || 0, z: o.coords?.z || 0,
      notes: o.notes || '',
      items: o.items.map(i => ({ ...i })),
    });
  };
  const saveOrderEdit = (id) => {
    updateOrderCoords(id, { x: Number(editForm.x), y: Number(editForm.y), z: Number(editForm.z) }, editForm.notes);
    updateOrderItems(id, editForm.items.filter(i => i.name && i.qty > 0));
    setEditingId(null);
    toast({ title: 'Order updated', description: `Order #${id} saved` });
  };
  const updateEditItem = (idx, patch) => setEditForm({ ...editForm, items: editForm.items.map((it, i) => i === idx ? { ...it, ...patch } : it) });
  const addEditItem = () => setEditForm({ ...editForm, items: [...editForm.items, { name: '', qty: 1 }] });
  const removeEditItem = (idx) => setEditForm({ ...editForm, items: editForm.items.filter((_, i) => i !== idx) });

  // Products handlers
  const openNewProduct = () => { setProductForm(emptyProduct); setNewProductOpen(true); setEditingProduct(null); };
  const openEditProduct = (p) => { setProductForm({ ...p }); setEditingProduct(p.id); setNewProductOpen(false); };
  const saveProduct = () => {
    if (!productForm.name || !productForm.price) { toast({ title: 'Missing fields', description: 'Name and price required' }); return; }
    const payload = { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock) };
    if (editingProduct) { updateProduct(editingProduct, payload); toast({ title: 'Product updated', description: payload.name }); }
    else { addProduct(payload); toast({ title: 'Product added', description: payload.name }); }
    setEditingProduct(null); setNewProductOpen(false); setProductForm(emptyProduct);
  };
  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) { deleteProduct(id); toast({ title: 'Product deleted', description: name }); }
  };

  // Discount handlers
  const openNewDiscount = () => { setDiscountForm(emptyDiscount); setNewDiscountOpen(true); setEditingDiscount(null); };
  const openEditDiscount = (d) => { setDiscountForm({ ...d }); setEditingDiscount(d.code); setNewDiscountOpen(false); };
  const saveDiscount = () => {
    if (!discountForm.code || !discountForm.value) { toast({ title: 'Missing fields', description: 'Code and value required' }); return; }
    const payload = { ...discountForm, value: Number(discountForm.value), maxUses: Number(discountForm.maxUses) };
    if (editingDiscount) {
      updateDiscount(editingDiscount, payload);
      toast({ title: 'Discount updated', description: payload.code });
    } else {
      const r = addDiscount(payload);
      if (!r.success) { toast({ title: 'Error', description: r.error }); return; }
      toast({ title: 'Discount added', description: payload.code });
    }
    setEditingDiscount(null); setNewDiscountOpen(false); setDiscountForm(emptyDiscount);
  };
  const handleDeleteDiscount = (code) => {
    if (window.confirm(`Delete code "${code}"?`)) { deleteDiscount(code); toast({ title: 'Discount deleted', description: code }); }
  };

  const handleRoleChange = (username, role) => {
    if (username === user.username) { toast({ title: 'Cannot change your own role', description: 'Ask another admin.' }); return; }
    updateUserRole(username, role);
    toast({ title: 'Role updated', description: `${username} → ${role}` });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', Icon: Shield, roles: ['admin'] },
    { id: 'orders', label: 'Orders', Icon: Package, roles: ['admin', 'delivery'] },
    { id: 'products', label: 'Products', Icon: DollarSign, roles: ['admin'] },
    { id: 'discounts', label: 'Discounts', Icon: TicketPercent, roles: ['admin'] },
    { id: 'users', label: 'Users', Icon: Users, roles: ['admin'] },
  ].filter(t => t.roles.includes(user.role));

  const priorityColor = (id) => (PRIORITIES.find(p => p.id === id) || PRIORITIES[0]).color;
  const priorityLabel = (id) => (PRIORITIES.find(p => p.id === id) || PRIORITIES[0]).label;

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-6 h-6 text-[#1cc4f0]" />
        <h1 className="pixel-font text-2xl text-white" style={{ textShadow: '3px 3px 0 #08a0c8' }}>{isAdmin ? 'Admin Panel' : 'Delivery Panel'}</h1>
        <span className="pixel-font text-[10px] text-[#6f88ad] ml-2">{user.username} · {user.role}</span>
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

        {tab === 'overview' && isAdmin && (
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { l: 'Total Orders', v: orders.length, c: '#1cc4f0' },
              { l: 'Revenue', v: `$${totalRevenue.toFixed(2)}`, c: '#1fae51' },
              { l: 'Users', v: allUsers.length, c: '#e0a522' },
              { l: 'Products', v: products.length, c: '#d83b3b' },
            ].map(s => (
              <div key={s.l} className="pixel-panel-inner p-5">
                <div className="pixel-font text-[9px] text-[#6f88ad] mb-2">{s.l.toUpperCase()}</div>
                <div className="pixel-font text-2xl" style={{ color: s.c }}>{s.v}</div>
              </div>
            ))}
            <div className="md:col-span-4 pixel-panel-inner p-5">
              <div className="pixel-font text-[#1cc4f0] text-sm mb-3">RECENT ORDERS</div>
              <table className="pixel-table">
                <thead><tr><th>ID</th><th>MC Name</th><th>Priority</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id}>
                      <td className="pixel-font text-xs">{o.id}</td>
                      <td>{o.mcName || o.userId}</td>
                      <td><span className="pixel-font text-[10px] uppercase" style={{ color: priorityColor(o.priority || 'low') }}>{priorityLabel(o.priority || 'low')}</span></td>
                      <td className="text-[#1cc4f0]">${o.total.toFixed(2)}</td>
                      <td><span className={`status-pill status-${o.status === 'paid' ? 'processing' : o.status}`}>{o.status}</span></td>
                      <td>{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#1cc4f0]" />
                <span className="pixel-font text-[10px] text-[#93b0d8]">PRIORITY:</span>
              </div>
              <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="pixel-input max-w-[200px]">
                <option value="all">All Priorities</option>
                {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <span className="minecraft-font text-[#6f88ad] text-base">{filteredOrders.length} of {orders.length}</span>
            </div>

            <table className="pixel-table">
              <thead><tr><th>ID</th><th>MC Name</th><th>Priority</th><th>Items</th><th>Total</th><th>Status</th><th>Delivery</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredOrders.map(o => (
                  <React.Fragment key={o.id}>
                    <tr>
                      <td className="pixel-font text-xs">{o.id}</td>
                      <td className="text-[#1cc4f0]">{o.mcName || o.userId}</td>
                      <td>
                        <select
                          value={o.priority || 'low'}
                          onChange={e => handlePriorityChange(o.id, e.target.value)}
                          className="pixel-input max-w-[120px]"
                          style={{ color: priorityColor(o.priority || 'low') }}
                        >
                          {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                      </td>
                      <td>{o.items.reduce((s, i) => s + i.qty, 0)}x</td>
                      <td className="text-[#1cc4f0]">${o.total.toFixed(2)}</td>
                      <td>
                        <div className="relative inline-block">
                          <button onClick={() => setOpenStatusId(openStatusId === o.id ? null : o.id)} className={`pixel-font text-[10px] uppercase inline-flex items-center gap-2 px-3 py-2 border-2 ${
                            o.status === 'delivered' ? 'bg-[#1fae51] border-[#15813a] text-[#04150a]' :
                            o.status === 'pending' ? 'bg-[#e0a522] border-[#9c7110] text-[#1a0f00]' :
                            o.status === 'cancelled' ? 'bg-[#d83b3b] border-[#9a2424] text-[#1a0202]' :
                            'bg-[#1cc4f0] border-[#08a0c8] text-[#052235]'
                          }`}>
                            {o.status} <ChevronDown className="w-3 h-3" />
                          </button>
                          {openStatusId === o.id && (
                            <div className="absolute right-0 top-full mt-1 pixel-panel p-2 z-20 min-w-[140px]">
                              {['pending', 'paid', 'processing', 'delivered', 'cancelled'].map(s => (
                                <button key={s} onClick={() => handleStatusChange(o.id, s)} className="minecraft-font text-[#cfe6ff] text-base hover:text-[#1cc4f0] block w-full text-left px-2 py-1 capitalize">{s}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="minecraft-font text-base text-[#cfe6ff]">
                          {(DELIVERY_OPTIONS.find(d => d.id === o.deliveryOption) || { label: '-' }).label}
                        </div>
                        {o.coords && (o.coords.x || o.coords.y || o.coords.z) ? (
                          <div className="minecraft-font text-[#93b0d8] text-sm">{o.coords.x}, {o.coords.y}, {o.coords.z}</div>
                        ) : (
                          <div className="minecraft-font text-[#6f88ad] text-sm">no coords</div>
                        )}
                      </td>
                      <td>
                        <button onClick={() => editingId === o.id ? setEditingId(null) : openOrderEdit(o)} className="btn-ghost inline-flex items-center gap-1" style={{ padding: '6px 10px' }}>
                          <Edit3 className="w-3 h-3" /> {editingId === o.id ? 'Close' : 'Edit'}
                        </button>
                      </td>
                    </tr>
                    {editingId === o.id && (
                      <tr>
                        <td colSpan={8} style={{ background: '#0a0e1a' }}>
                          <div className="p-4 space-y-5">
                            <div>
                              <div className="pixel-font text-[#1cc4f0] text-xs mb-3">DELIVERY COORDS</div>
                              <div className="grid md:grid-cols-4 gap-3">
                                <div>
                                  <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">X</label>
                                  <input type="number" className="pixel-input" value={editForm.x} onChange={e => setEditForm({ ...editForm, x: e.target.value })} />
                                </div>
                                <div>
                                  <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">Y</label>
                                  <input type="number" className="pixel-input" value={editForm.y} onChange={e => setEditForm({ ...editForm, y: e.target.value })} />
                                </div>
                                <div>
                                  <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">Z</label>
                                  <input type="number" className="pixel-input" value={editForm.z} onChange={e => setEditForm({ ...editForm, z: e.target.value })} />
                                </div>
                                <div>
                                  <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">NOTES</label>
                                  <input className="pixel-input" value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} placeholder="Delivery note..." />
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="pixel-font text-[#1cc4f0] text-xs">ORDER ITEMS</div>
                                <button onClick={addEditItem} className="btn-ghost inline-flex items-center gap-1" style={{ padding: '6px 10px' }}>
                                  <Plus className="w-3 h-3" /> Add Item
                                </button>
                              </div>
                              <div className="space-y-2">
                                {editForm.items.map((it, idx) => (
                                  <div key={idx} className="grid grid-cols-[1fr,120px,40px] gap-2">
                                    <input className="pixel-input" placeholder="Item name" value={it.name} onChange={e => updateEditItem(idx, { name: e.target.value })} />
                                    <input type="number" className="pixel-input" placeholder="Qty" value={it.qty} onChange={e => updateEditItem(idx, { qty: Number(e.target.value) })} />
                                    <button onClick={() => removeEditItem(idx)} className="btn-red flex items-center justify-center" style={{ padding: '0' }}>
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                {editForm.items.length === 0 && <div className="minecraft-font text-[#6f88ad] text-base">No items.</div>}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => saveOrderEdit(o.id)} className="btn-green inline-flex items-center gap-2"><Save className="w-3 h-3" /> Save</button>
                              <button onClick={() => setEditingId(null)} className="btn-ghost inline-flex items-center gap-2"><X className="w-3 h-3" /> Cancel</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'products' && isAdmin && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="pixel-font text-[#1cc4f0] text-sm">PRODUCTS ({products.length})</div>
              <div className="flex gap-2">
                <button onClick={openNewProduct} className="btn-cyan inline-flex items-center gap-2"><Plus className="w-3 h-3" /> New Product</button>
                <button onClick={() => { if (window.confirm('Reset products to defaults? Custom changes will be lost.')) { resetProducts(); toast({ title: 'Reset done' }); } }} className="btn-ghost inline-flex items-center gap-2"><RotateCcw className="w-3 h-3" /> Reset</button>
              </div>
            </div>

            {(newProductOpen || editingProduct) && (
              <div className="pixel-panel-inner p-5 mb-4">
                <div className="pixel-font text-[#1cc4f0] text-xs mb-3">{editingProduct ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">NAME *</label>
                    <input className="pixel-input" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">CATEGORY</label>
                    <select className="pixel-input" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">PRICE (USD) *</label>
                    <input type="number" step="0.01" className="pixel-input" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                  </div>
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">STOCK</label>
                    <input type="number" className="pixel-input" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">IMAGE URL</label>
                    <input className="pixel-input" placeholder="https://..." value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">DESCRIPTION</label>
                    <textarea className="pixel-input" rows={3} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={saveProduct} className="btn-green inline-flex items-center gap-2"><Save className="w-3 h-3" /> Save</button>
                  <button onClick={() => { setEditingProduct(null); setNewProductOpen(false); }} className="btn-ghost inline-flex items-center gap-2"><X className="w-3 h-3" /> Cancel</button>
                </div>
              </div>
            )}

            <table className="pixel-table">
              <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="pixel-font text-xs">{p.id}</td>
                    <td>{p.name}</td>
                    <td className="capitalize">{p.category}</td>
                    <td className="text-[#1cc4f0]">${Number(p.price).toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEditProduct(p)} className="btn-ghost inline-flex items-center gap-1" style={{ padding: '6px 10px' }}>
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id, p.name)} className="btn-red inline-flex items-center gap-1" style={{ padding: '6px 10px' }}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'discounts' && isAdmin && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="pixel-font text-[#1cc4f0] text-sm">DISCOUNT CODES ({discounts.length})</div>
              <button onClick={openNewDiscount} className="btn-cyan inline-flex items-center gap-2"><Plus className="w-3 h-3" /> New Code</button>
            </div>

            {(newDiscountOpen || editingDiscount) && (
              <div className="pixel-panel-inner p-5 mb-4">
                <div className="pixel-font text-[#1cc4f0] text-xs mb-3">{editingDiscount ? 'EDIT CODE' : 'NEW CODE'}</div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">CODE *</label>
                    <input className="pixel-input uppercase" value={discountForm.code} onChange={e => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })} disabled={!!editingDiscount} placeholder="WELCOME10" />
                  </div>
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">TYPE</label>
                    <select className="pixel-input" value={discountForm.type} onChange={e => setDiscountForm({ ...discountForm, type: e.target.value })}>
                      <option value="percent">Percent (%)</option>
                      <option value="usd">Fixed (USD)</option>
                    </select>
                  </div>
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">VALUE * ({discountForm.type === 'percent' ? '%' : 'USD'})</label>
                    <input type="number" step="0.01" className="pixel-input" value={discountForm.value} onChange={e => setDiscountForm({ ...discountForm, value: e.target.value })} />
                  </div>
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">EXPIRES AT</label>
                    <input type="date" className="pixel-input" value={discountForm.expiresAt?.slice(0, 10) || ''} onChange={e => setDiscountForm({ ...discountForm, expiresAt: e.target.value })} />
                  </div>
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">MAX USES (0 = unlimited)</label>
                    <input type="number" className="pixel-input" value={discountForm.maxUses} onChange={e => setDiscountForm({ ...discountForm, maxUses: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={saveDiscount} className="btn-green inline-flex items-center gap-2"><Save className="w-3 h-3" /> Save</button>
                  <button onClick={() => { setEditingDiscount(null); setNewDiscountOpen(false); }} className="btn-ghost inline-flex items-center gap-2"><X className="w-3 h-3" /> Cancel</button>
                </div>
              </div>
            )}

            <table className="pixel-table">
              <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Expires</th><th>Uses</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {discounts.map(d => {
                  const expired = d.expiresAt && new Date(d.expiresAt) < new Date();
                  const exhausted = d.maxUses > 0 && d.uses >= d.maxUses;
                  const active = !expired && !exhausted;
                  return (
                    <tr key={d.code}>
                      <td><span className="pixel-font text-sm text-[#1cc4f0]">{d.code}</span></td>
                      <td className="capitalize">{d.type === 'percent' ? 'Percent' : 'Fixed USD'}</td>
                      <td className="text-[#1cc4f0]">{d.type === 'percent' ? `${d.value}%` : `$${Number(d.value).toFixed(2)}`}</td>
                      <td>{d.expiresAt ? d.expiresAt.slice(0, 10) : 'Never'}</td>
                      <td>{d.uses || 0}{d.maxUses > 0 ? ` / ${d.maxUses}` : ''}</td>
                      <td>
                        <span className={`status-pill ${active ? 'status-delivered' : 'status-cancelled'}`}>
                          {active ? 'Active' : expired ? 'Expired' : 'Exhausted'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => openEditDiscount(d)} className="btn-ghost inline-flex items-center gap-1" style={{ padding: '6px 10px' }}>
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button onClick={() => handleDeleteDiscount(d.code)} className="btn-red inline-flex items-center gap-1" style={{ padding: '6px 10px' }}>
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'users' && isAdmin && (
          <table className="pixel-table">
            <thead><tr><th>Username</th><th>MC Name</th><th>Email</th><th>Role</th></tr></thead>
            <tbody>
              {allUsers.map(u => (
                <tr key={u.username}>
                  <td className="pixel-font text-xs">{u.username}</td>
                  <td>{u.mcName}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} disabled={u.username === user.username} onChange={e => handleRoleChange(u.username, e.target.value)} className="pixel-input max-w-[160px]">
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
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
