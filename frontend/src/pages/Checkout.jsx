import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { SELL_APP, MIN_ORDER_USD } from '../mock';

const Checkout = () => {
  const { items, total, savePendingCheckout } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();

  const [mcName, setMcName] = useState(user?.mcName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [redirecting, setRedirecting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="pixel-font text-xl text-white mb-4">Your cart is empty</h2>
        <button onClick={() => nav('/shop')} className="btn-cyan">Go to shop</button>
      </div>
    );
  }

  if (total < MIN_ORDER_USD) {
    return (
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        <div className="pixel-panel p-8 text-center">
          <AlertCircle className="w-10 h-10 text-[#e0a522] mx-auto mb-4" />
          <h2 className="pixel-font text-lg text-white mb-3">Minimum Order Not Met</h2>
          <p className="minecraft-font text-[#cfe6ff] text-lg mb-6">
            Total <span className="text-[#1cc4f0]">${total.toFixed(2)}</span> &lt; minimum <span className="text-[#1cc4f0]">${MIN_ORDER_USD.toFixed(2)}</span>.
          </p>
          <button onClick={() => nav('/shop')} className="btn-cyan">Add more items</button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mcName || !email) {
      toast({ title: 'Missing info', description: 'Please fill all required fields.' });
      return;
    }
    setRedirecting(true);

    // Save pending checkout (NOT an order yet - order is created only after payment)
    const pending = savePendingCheckout(user, { mcName, email });

    // Build sell.app checkout link. Real integration would use sell.app Invoice API on a backend.
    // For now we redirect to your store URL. After successful payment, sell.app should redirect to:
    //   {your-site}/payment-success?status=success&order={pending.id}
    // Configure that as the return URL in your sell.app settings.
    const returnUrl = `${window.location.origin}/payment-success?status=success&order=${pending.id}`;
    const itemsParam = encodeURIComponent(pending.items.map(i => `${i.qty}x ${i.name}`).join(', '));
    const url = `${SELL_APP.baseUrl}/?ref=jvaultx&pending=${pending.id}&player=${encodeURIComponent(mcName)}&email=${encodeURIComponent(email)}&total=${total.toFixed(2)}&items=${itemsParam}&return_url=${encodeURIComponent(returnUrl)}`;

    toast({ title: 'Redirecting...', description: 'Opening sell.app checkout' });
    setTimeout(() => {
      window.location.href = url;
    }, 600);
  };

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
            <div className="pixel-font text-[#1cc4f0] text-sm mb-4 pb-3 border-b-2 border-[#25304a]">2. PAYMENT</div>
            <div className="pixel-panel-inner p-5 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#1cc4f0] border-2 border-[#08a0c8] flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 4px 0 #066d8a' }}>
                <ShieldCheck className="w-6 h-6 text-[#052235]" />
              </div>
              <div>
                <div className="pixel-font text-[#1cc4f0] text-sm mb-2">PAY WITH SELL.APP</div>
                <p className="minecraft-font text-[#cfe6ff] text-lg leading-relaxed">
                  You'll be redirected to <span className="text-[#1cc4f0]">sell.app</span> to complete payment securely. Cards, PayPal, crypto and more.
                </p>
                <p className="minecraft-font text-[#6f88ad] text-base mt-2">
                  Your order is created <strong className="text-[#1fae51]">only after</strong> payment is confirmed.
                </p>
              </div>
            </div>
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
          <button type="submit" disabled={redirecting} className="btn-cyan w-full inline-flex items-center justify-center gap-2">
            <ExternalLink className="w-3 h-3" /> {redirecting ? 'Opening sell.app...' : `Pay $${total.toFixed(2)} with sell.app`}
          </button>
          <p className="minecraft-font text-[#6f88ad] text-sm text-center mt-3">Secure checkout • sell.app handles payments</p>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
