import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ORDERS } from '../mock';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const c = localStorage.getItem('jvaultx_cart');
      return c ? JSON.parse(c) : [];
    } catch { return []; }
  });
  const [orders, setOrders] = useState(() => {
    try {
      const o = localStorage.getItem('jvaultx_orders');
      return o ? JSON.parse(o) : MOCK_ORDERS;
    } catch { return MOCK_ORDERS; }
  });

  useEffect(() => {
    if (!localStorage.getItem('jvaultx_orders')) {
      localStorage.setItem('jvaultx_orders', JSON.stringify(MOCK_ORDERS));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jvaultx_cart', JSON.stringify(items));
  }, [items]);

  const persistOrders = (list) => {
    setOrders(list);
    localStorage.setItem('jvaultx_orders', JSON.stringify(list));
  };

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };
  const clearCart = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  // Save pending checkout (cart + buyer info) before redirecting to sell.app
  const savePendingCheckout = (user, info) => {
    const pending = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      userId: user?.username || 'guest',
      mcName: info.mcName,
      email: info.email,
      items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      total,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('jvaultx_pending_checkout', JSON.stringify(pending));
    return pending;
  };

  // Convert pending checkout into a real PAID order (called on /payment-success)
  const finalizeOrder = () => {
    const raw = localStorage.getItem('jvaultx_pending_checkout');
    if (!raw) return null;
    const pending = JSON.parse(raw);
    const newOrder = {
      id: pending.id,
      userId: pending.userId,
      mcName: pending.mcName,
      email: pending.email,
      items: pending.items.map(i => ({ name: i.name, qty: i.qty })),
      total: pending.total,
      status: 'paid',
      date: new Date().toISOString().slice(0, 10),
      coords: { x: 0, y: 0, z: 0 },
      notes: '',
    };
    persistOrders([newOrder, ...orders]);
    localStorage.removeItem('jvaultx_pending_checkout');
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    persistOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateOrderCoords = (orderId, coords, notes) => {
    persistOrders(orders.map(o => o.id === orderId ? { ...o, coords: { ...o.coords, ...coords }, notes: notes !== undefined ? notes : o.notes } : o));
  };

  const updateOrderItems = (orderId, newItems) => {
    persistOrders(orders.map(o => o.id === orderId ? { ...o, items: newItems } : o));
  };

  return (
    <CartContext.Provider value={{
      items, total, itemCount,
      addToCart, removeFromCart, updateQty, clearCart,
      orders, savePendingCheckout, finalizeOrder,
      updateOrderStatus, updateOrderCoords, updateOrderItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
