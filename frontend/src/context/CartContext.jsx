import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ORDERS, DEFAULT_DISCOUNTS, DELIVERY_OPTIONS, PRIORITIES } from '../mock';

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
  const [discounts, setDiscounts] = useState(() => {
    try {
      const d = localStorage.getItem('jvaultx_discounts');
      return d ? JSON.parse(d) : DEFAULT_DISCOUNTS;
    } catch { return DEFAULT_DISCOUNTS; }
  });

  useEffect(() => {
    if (!localStorage.getItem('jvaultx_orders')) localStorage.setItem('jvaultx_orders', JSON.stringify(MOCK_ORDERS));
    if (!localStorage.getItem('jvaultx_discounts')) localStorage.setItem('jvaultx_discounts', JSON.stringify(DEFAULT_DISCOUNTS));
  }, []);

  useEffect(() => {
    localStorage.setItem('jvaultx_cart', JSON.stringify(items));
  }, [items]);

  const persistOrders = (list) => {
    setOrders(list);
    localStorage.setItem('jvaultx_orders', JSON.stringify(list));
  };
  const persistDiscounts = (list) => {
    setDiscounts(list);
    localStorage.setItem('jvaultx_discounts', JSON.stringify(list));
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

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  // Discount validation
  const validateDiscount = (code) => {
    if (!code) return { valid: false, error: 'Enter a code' };
    const d = discounts.find(x => x.code.toLowerCase() === code.toLowerCase());
    if (!d) return { valid: false, error: 'Invalid code' };
    if (d.expiresAt && new Date(d.expiresAt) < new Date()) return { valid: false, error: 'Code expired' };
    if (d.maxUses > 0 && d.uses >= d.maxUses) return { valid: false, error: 'Code limit reached' };
    return { valid: true, discount: d };
  };

  const calcTotals = ({ deliveryOption = 'random', priority = 'low', discountCode = '' } = {}) => {
    const delivery = DELIVERY_OPTIONS.find(d => d.id === deliveryOption) || DELIVERY_OPTIONS[0];
    const prio = PRIORITIES.find(p => p.id === priority) || PRIORITIES[0];
    let discountAmount = 0;
    let discountValid = false;
    if (discountCode) {
      const v = validateDiscount(discountCode);
      if (v.valid) {
        discountValid = true;
        const d = v.discount;
        if (d.type === 'percent') discountAmount = (subtotal * d.value) / 100;
        else discountAmount = d.value;
        // cap to subtotal
        discountAmount = Math.min(discountAmount, subtotal);
      }
    }
    const fees = delivery.fee + prio.fee;
    const total = Math.max(0, subtotal + fees - discountAmount);
    return { subtotal, deliveryFee: delivery.fee, priorityFee: prio.fee, discountAmount, discountValid, total };
  };

  // Save pending checkout (NOT an order yet)
  const savePendingCheckout = (user, info) => {
    const totals = calcTotals(info);
    const pending = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      userId: user?.username || 'guest',
      mcName: info.mcName,
      email: info.email,
      items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      subtotal: totals.subtotal,
      deliveryOption: info.deliveryOption,
      deliveryFee: totals.deliveryFee,
      priority: info.priority,
      priorityFee: totals.priorityFee,
      discountCode: totals.discountValid ? info.discountCode : '',
      discountAmount: totals.discountAmount,
      total: totals.total,
      requestedCoords: info.requestedCoords || null,
      meetupNote: info.meetupNote || '',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('jvaultx_pending_checkout', JSON.stringify(pending));
    return pending;
  };

  // Convert pending checkout to a paid order
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
      subtotal: pending.subtotal,
      deliveryOption: pending.deliveryOption,
      deliveryFee: pending.deliveryFee,
      priority: pending.priority,
      priorityFee: pending.priorityFee,
      discountCode: pending.discountCode,
      discountAmount: pending.discountAmount,
      total: pending.total,
      status: 'paid',
      date: new Date().toISOString().slice(0, 10),
      coords: pending.deliveryOption === 'specified' && pending.requestedCoords
        ? { ...pending.requestedCoords }
        : { x: 0, y: 0, z: 0 },
      notes: pending.deliveryOption === 'meetup' && pending.meetupNote
        ? `Meetup: ${pending.meetupNote}`
        : '',
    };
    persistOrders([newOrder, ...orders]);

    // Bump discount usage
    if (pending.discountCode) {
      const updated = discounts.map(d =>
        d.code.toLowerCase() === pending.discountCode.toLowerCase() ? { ...d, uses: (d.uses || 0) + 1 } : d
      );
      persistDiscounts(updated);
    }

    localStorage.removeItem('jvaultx_pending_checkout');
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) =>
    persistOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));

  const updateOrderCoords = (orderId, coords, notes) =>
    persistOrders(orders.map(o => o.id === orderId ? { ...o, coords: { ...o.coords, ...coords }, notes: notes !== undefined ? notes : o.notes } : o));

  const updateOrderItems = (orderId, newItems) =>
    persistOrders(orders.map(o => o.id === orderId ? { ...o, items: newItems } : o));

  const updateOrderPriority = (orderId, priority) =>
    persistOrders(orders.map(o => o.id === orderId ? { ...o, priority } : o));

  // Discounts CRUD
  const addDiscount = (d) => {
    if (discounts.find(x => x.code.toLowerCase() === d.code.toLowerCase())) {
      return { success: false, error: 'Code already exists' };
    }
    persistDiscounts([{ ...d, uses: 0 }, ...discounts]);
    return { success: true };
  };
  const updateDiscount = (code, patch) =>
    persistDiscounts(discounts.map(d => d.code === code ? { ...d, ...patch } : d));
  const deleteDiscount = (code) =>
    persistDiscounts(discounts.filter(d => d.code !== code));

  return (
    <CartContext.Provider value={{
      items, subtotal, total: subtotal, itemCount,
      addToCart, removeFromCart, updateQty, clearCart,
      orders, savePendingCheckout, finalizeOrder,
      updateOrderStatus, updateOrderCoords, updateOrderItems, updateOrderPriority,
      discounts, addDiscount, updateDiscount, deleteDiscount, validateDiscount,
      calcTotals,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
