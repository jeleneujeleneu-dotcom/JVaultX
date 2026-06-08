import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Bitcoin, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const Checkout = () => {
  const { items, total, placeOrder } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();

  const [mcName, setMcName] = useState(user?.mcName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);

  if (items.length === 0 && !success) {
    return (
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="pixel-font text-xl text-white mb-4">Your cart is empty</h2>
        <button onClick={() => nav('/shop')} className="btn-cyan">Go to shop</button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mcName || !email) {
      toast({ title: 'Missing info', description: 'Please fill all required fields.' });
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv)) {
      toast({ title: 'Missing card info', description: 'Please complete card details.' });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      const order = placeOrder(user);
      setSuccess(order);
      setProcessing(false);
      toast({ title: 'Order placed!', description: `Order #${order.id} created.` });
    }, 1500);
  };

  if (success) {
    return (
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="pixel-panel p-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-[#1fae51] border-2 border-[#15813a] flex items-center justify-center" style={{ boxShadow: '0 4px 0 #0c5b27' }}>
            <Check className="w-8 h-8 text-[#04150a]" />
          </div>
          <h2 className="pixel-font text-xl text-white mb-3">Order Confirmed!</h2>
          <p className="minecraft-font text-[#cfe6ff] text-xl mb-2">Order ID: <span className="text-[#1cc4f0]">#{success.id}</span></p>
          <p className="minecraft-font text-[#93b0d8] text-lg mb-8">Items will be delivered to <span className="text-[#1cc4f0]">{mcName}</span> in-game shortly.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => nav('/account')} className="btn-cyan">View Orders</button>
            <button onClick={() => nav('/shop')} className="btn-ghost">Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
      <h1 className="pixel-font text-2xl text-white mb-8" style={{ textShadow: '3px 3px 0 #08a0c8' }}>Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr,360px] gap-6">
        <div className="space-y-4">
          <div className="pixel-panel p-6">
            <div className="pixel-font text-[#1cc4f0] text-sm mb-4 pb-3 border-b-2 border-[#25304a]">1. PLAYER INFO</div>
            <div className="space-y-4">
              <div>
                <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">MINECRAFT USERNAME *</label>
                <input className="pixel-input" value={mcName} onChange={e => setMcName(e.target.value)} placeholder="Notch" required />
              </div>
              <div>
                <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">EMAIL *</label>
                <input type="email" className="pixel-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
              </div>
            </div>
          </div>

          <div className="pixel-panel p-6">
            <div className="pixel-font text-[#1cc4f0] text-sm mb-4 pb-3 border-b-2 border-[#25304a]">2. PAYMENT METHOD</div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { id: 'card', label: 'Card', Icon: CreditCard },
                { id: 'paypal', label: 'PayPal', Icon: Wallet },
                { id: 'crypto', label: 'Crypto', Icon: Bitcoin },
              ].map(p => {
                const I = p.Icon;
                const active = paymentMethod === p.id;
                return (
                  <button type="button" key={p.id} onClick={() => setPaymentMethod(p.id)}
                    className={`p-4 border-2 transition-all flex flex-col items-center gap-2 ${active ? 'border-[#1cc4f0] bg-[#1cc4f0]/10' : 'border-[#25304a] bg-[#0a0e1a]'}`}>
                    <I className={`w-5 h-5 ${active ? 'text-[#1cc4f0]' : 'text-[#93b0d8]'}`} />
                    <span className={`pixel-font text-[10px] ${active ? 'text-[#1cc4f0]' : 'text-[#93b0d8]'}`}>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">CARD NUMBER</label>
                  <input className="pixel-input" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">EXPIRY</label>
                    <input className="pixel-input" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="pixel-font text-[10px] text-[#93b0d8] block mb-2">CVV</label>
                    <input className="pixel-input" value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="123" />
                  </div>
                </div>
              </div>
            )}
            {paymentMethod === 'paypal' && (
              <div className="minecraft-font text-[#cfe6ff] text-lg p-4 bg-[#0a0e1a] border-2 border-[#25304a]">You will be redirected to PayPal after clicking pay.</div>
            )}
            {paymentMethod === 'crypto' && (
              <div className="minecraft-font text-[#cfe6ff] text-lg p-4 bg-[#0a0e1a] border-2 border-[#25304a]">BTC/ETH/USDT payment instructions will appear on the next step.</div>
            )}
          </div>
        </div>

        <div className="pixel-panel p-6 h-fit">
          <div className="pixel-font text-[#1cc4f0] text-sm mb-4 pb-3 border-b-2 border-[#25304a]">YOUR ORDER</div>
          <div className="space-y-2 mb-4 max-h-64 overflow-auto">
            {items.map(i => (
              <div key={i.id} className="flex justify-between minecraft-font text-base">
                <span className="text-[#cfe6ff]">{i.qty}× {i.name}</span>
                <span className="text-[#1cc4f0]">${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-baseline mb-4 pt-3 border-t-2 border-[#25304a]">
            <span className="pixel-font text-xs text-[#cfe6ff]">TOTAL</span>
            <span className="pixel-font text-lg text-[#1cc4f0]">${total.toFixed(2)}</span>
          </div>
          <button type="submit" disabled={processing} className="btn-cyan w-full">
            {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
          <p className="minecraft-font text-[#6f88ad] text-sm text-center mt-3">This is a demo — no real payment processed.</p>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
