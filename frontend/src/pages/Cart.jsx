import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, total, updateQty, removeFromCart, clearCart } = useCart();
  const nav = useNavigate();

  if (items.length === 0) {
    return (
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="pixel-panel p-12">
          <ShoppingBag className="w-12 h-12 text-[#6f88ad] mx-auto mb-4" />
          <h2 className="pixel-font text-xl text-white mb-3">Your cart is empty</h2>
          <p className="minecraft-font text-[#93b0d8] text-lg mb-6">Browse our shop and add some items.</p>
          <Link to="/shop" className="btn-cyan inline-block">Go to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
      <h1 className="pixel-font text-2xl text-white mb-8" style={{ textShadow: '3px 3px 0 #08a0c8' }}>Shopping Cart</h1>

      <div className="grid lg:grid-cols-[1fr,360px] gap-6">
        <div className="pixel-panel p-6">
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="pixel-panel-inner p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-[#0a0e1a] border-2 border-[#25304a] flex items-center justify-center flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-10 h-10" style={{ imageRendering: 'pixelated' }} onError={(e) => { e.target.src = 'https://mc.nerothe.com/img/1.21/minecraft_chest.png'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="minecraft-font text-[#cfe6ff] text-lg truncate">{item.name}</div>
                  <div className="pixel-font text-[#1cc4f0] text-xs mt-1">${item.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center border-2 border-[#25304a] bg-[#0a0e1a]">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center text-[#93b0d8] hover:bg-[#1cc4f0]/10">
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="pixel-font text-white w-10 text-center text-xs">{item.qty}</div>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center text-[#93b0d8] hover:bg-[#1cc4f0]/10">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="pixel-font text-[#1cc4f0] text-sm w-20 text-right">${(item.price * item.qty).toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center text-[#d83b3b] hover:bg-[#d83b3b]/10 border-2 border-transparent hover:border-[#d83b3b]">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center pt-4 border-t-2 border-[#25304a]">
            <button onClick={clearCart} className="btn-ghost">Clear Cart</button>
            <Link to="/shop" className="minecraft-font text-[#1cc4f0] text-lg hover:underline">← Continue shopping</Link>
          </div>
        </div>

        {/* Summary */}
        <div className="pixel-panel p-6 h-fit">
          <div className="pixel-font text-[#1cc4f0] text-sm mb-4 pb-3 border-b-2 border-[#25304a]">ORDER SUMMARY</div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between minecraft-font text-lg">
              <span className="text-[#93b0d8]">Subtotal</span>
              <span className="text-[#cfe6ff]">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between minecraft-font text-lg">
              <span className="text-[#93b0d8]">Delivery</span>
              <span className="text-[#1fae51]">FREE</span>
            </div>
            <div className="flex justify-between minecraft-font text-lg">
              <span className="text-[#93b0d8]">Tax</span>
              <span className="text-[#cfe6ff]">$0.00</span>
            </div>
          </div>
          <div className="flex justify-between items-baseline mb-6 pt-3 border-t-2 border-[#25304a]">
            <span className="pixel-font text-xs text-[#cfe6ff]">TOTAL</span>
            <span className="pixel-font text-xl text-[#1cc4f0]">${total.toFixed(2)}</span>
          </div>
          <button onClick={() => nav('/checkout')} className="btn-cyan w-full">Checkout</button>
          <p className="minecraft-font text-[#6f88ad] text-base text-center mt-3">Secure payment • Instant delivery</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
