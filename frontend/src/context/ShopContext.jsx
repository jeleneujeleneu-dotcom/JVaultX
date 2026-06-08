import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../mock';

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('jvaultx_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch { return DEFAULT_PRODUCTS; }
  });

  useEffect(() => {
    if (!localStorage.getItem('jvaultx_products')) {
      localStorage.setItem('jvaultx_products', JSON.stringify(DEFAULT_PRODUCTS));
    }
  }, []);

  const persist = (list) => {
    setProducts(list);
    localStorage.setItem('jvaultx_products', JSON.stringify(list));
  };

  const addProduct = (p) => {
    const newP = { ...p, id: p.id || `p_${Date.now()}` };
    persist([newP, ...products]);
    return newP;
  };

  const updateProduct = (id, patch) => {
    persist(products.map(p => p.id === id ? { ...p, ...patch } : p));
  };

  const deleteProduct = (id) => {
    persist(products.filter(p => p.id !== id));
  };

  const resetProducts = () => {
    persist(DEFAULT_PRODUCTS);
  };

  const getProduct = (id) => products.find(p => p.id === id);

  return (
    <ShopContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, resetProducts, getProduct }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
