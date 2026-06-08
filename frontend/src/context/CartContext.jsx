import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ORDERS } from '../mock';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const c = localStorage.getItem('jvaultx_cart');
    if (c) setItems(JSON.parse(c));
    const o = localStorage.getItem('jvaultx_orders');
    if (o) setOrders(JSON.parse(o));
    else {
      setOrders(MOCK_ORDERS);
      localStorage.setItem('jvaultx_orders', JSON.stringify(MOCK_ORDERS));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jvaultx_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      }
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

  const placeOrder = (user) => {
    const newOrder = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      userId: user?.username || 'guest',
      items: items.map(i => ({ name: i.name, qty: i.qty })),
      total,
      status: 'pending',
      date: new Date().toISOString().slice(0, 10),
      coords: { x: Math.floor(Math.random() * 30000), y: 64, z: Math.floor(Math.random() * 30000) },
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('jvaultx_orders', JSON.stringify(updated));
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem('jvaultx_orders', JSON.stringify(updated));
  };

  return (
    <CartContext.Provider value={{ items, total, itemCount, addToCart, removeFromCart, updateQty, clearCart, orders, placeOrder, updateOrderStatus }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
