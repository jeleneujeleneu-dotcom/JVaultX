import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, AlertCircle, MapPin, Dice5, Users as UsersIcon, Zap, TicketPercent, Check, X, CreditCard, Wallet, Bitcoin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { SELL_APP, MIN_ORDER_USD, DELIVERY_OPTIONS, PRIORITIES } from '../mock';

const DELIVERY_ICONS = { random: Dice5, specified: MapPin, meetup: UsersIcon };

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex', Icon: CreditCard, color: '#1cc4f0' },
  { id: 'paypal', label: 'PayPal', sub: 'Pay with your account', Icon: Wallet, color: '#00457c' },
  { id: 'btc', label: 'Bitcoin', sub: 'BTC', Icon: Bitcoin, color: '#f7931a' },
  { id: 'ltc', label: 'Litecoin', sub: 'LTC', Icon: Bitcoin, color: '#a6a9aa' },
  { id: 'eth', label: 'Ethereum', sub: 'ETH', Icon: Bitcoin, color: '#627eea' },
  { id: 'usdt', label: 'Tether', sub: 'USDT (ERC20 / TRC20)', Icon: Bitcoin, color: '#26a17b' },
];

const Checkout = () => {
  const { items, subtotal, savePendingCheckout, calcTotals, validateDiscount } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();

  const [mcName, setMcName] = useState(user?.mcName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [deliveryOption, setDeliveryOption] = useState('random');
  const [priority, setPriority] = useState('low');
  const [coords, setCoords] = useState({ x: '', y: '', z: '' });
  const [meetupNote, setMeetupNote] = useState('');
  const [discountInput, setDiscountInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountErr, setDiscountErr] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [redirecting, setRedirecting] = useState(false);

  const totals = useMemo(
    () => calcTotals({ deliveryOption, priority, discountCode: appliedCode }),
    [items, deliveryOption, priority, appliedCode, calcTotals]
  );

  if (items.length === 0) {
    return (
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="pixel-font text-xl text-white mb-4">Your cart is empty</h2>
        <button onClick={() => nav('/shop')} className="btn-cyan">Go to shop</button>
      </div>
    );
  }

  if (subtotal < MIN_ORDER_USD) {
    return (
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        <div className="pixel-panel p-8 text-center">
          <AlertCircle className="w-10 h-10 text-[#e0a522] mx-auto mb-4" />
          <h2 className="pixel-font text-lg text-white mb-3">Minimum Order Not Met</h2>
          <p className="minecraft-font text-[#cfe6ff] text-lg mb-6">
            Subtotal <span className="text-[#1cc4f0]">${subtotal.toFixed(2)}</span> &lt; minimum <span className="text-[#1cc4f0]">${MIN_ORDER_USD.toFixed(2)}</span>.
          </p>
          <button onClick={() => nav('/shop')} className="btn-cyan">Add more items</button>
        </div>
      </div>
    );
  }

  const applyDiscount = () => {
    setDiscountErr('');
    const v = validateDiscount(discountInput);
    if (v.valid) {
      setAppliedCode(discountInput);
      toast({ title: 'Discount applied!', description: discountInput.toUpperCase() });
    } else {
      setAppliedCode('');
      setDiscountErr(v.error);
    }
  };
  const removeDiscount = () => {
    setAppliedCode('');
    setDiscountInput('');
    setDiscountErr('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mcName || !email) {
      toast({ title: 'Missing info', description: 'Please fill all required fields.' });
      return;
    }
    if (deliveryOption === 'specified') {
      if (coords.x === '' || coords.y === '' || coords.z === '') {
        toast({ title: 'Coords required', description: 'Provide X, Y, Z for specified delivery.' });
        return;
      }
    }
    if (deliveryOption === 'meetup' && !meetupNote.trim()) {
      toast({ title: 'Meetup details required', description: 'Add a note (time, place, etc).' });
      return;
    }

    setRedirecting(true);

    const pending = savePendingCheckout(user, {
      mcName, email,
      deliveryOption, priority,
      discountCode: appliedCode,
      requestedCoords: deliveryOption === 'specified' ? { x: Number(coords.x), y: Number(coords.y), z: Number(coords.z) } : null,
      meetupNote,
    });

    const returnUrl = `${window.location.origin}/payment-success?status=success&order=${pending.id}`;
    const itemsParam = encodeURIComponent(pending.items.map(i => `${i.qty}x ${i.name}`).join(', '));
    const url = `${SELL_APP.baseUrl}/?ref=jvaultx&pending=${pending.id}&player=${encodeURIComponent(mcName)}&email=${encodeURIComponent(email)}&total=${pending.total.toFixed(2)}&items=${itemsParam}&payment=${paymentMethod}&return_url=${encodeURIComponent(returnUrl)}`;

    const methodLabel = PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label || paymentMethod;
    toast({ title: 'Redirecting...', description: `Opening ${methodLabel} checkout` });
    setTimeout(() => { window.location.href = url; }, 600);
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
      <h1 className="pixel-font text-2xl text-white mb-8" style={{ textShadow: '3px 3px 0 #08a0c8' }}>Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr,380px] gap-6">
        <div className="space-y-4">
          {/* 1. PLAYER */}
          <div className="pixel-panel p-6">
            <div className="pixel-font text-[#1cc4f0] text-sm mb-4 pb-3 border-b-2 border-[#25304a]">1. PLAYER INFO</div>
            <div className="grid md:grid-cols-2 gap-4">
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

          {/* 2. DELIVERY */}
          <div className="pixel-panel p-6">
            <div className="pixel-font text-[#1cc4f0] text-sm mb-4 pb-3 border-b-2 border-[#25304a]">2. DELIVERY METHOD</div>
            <div className="grid md:grid-cols-3 gap-3">
              {DELIVERY_OPTIONS.map(d => {
                const I = DELIVERY_ICONS[d.id];
                const active = deliveryOption === d.id;
                return (
                  <button type="button" key={d.id} onClick={() => setDeliveryOption(d.id)}
                    className={`p-4 border-2 transition-all text-left ${active ? 'border-[#1cc4f0] bg-[#1cc4f0]/10' : 'border-[#25304a] bg-[#0a0e1a] hover:border-[#3a4a70]'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <I className={`w-5 h-5 ${active ? 'text-[#1cc4f0]' : 'text-[#93b0d8]'}`} />
                      <span className={`pixel-font text-[10px] ${d.fee === 0 ? 'text-[#1fae51]' : 'text-[#e0a522]'}`}>
                        {d.fee === 0 ? 'FREE' : `+$${d.fee}`}
                      </span>
                    </div>
                    <div className={`pixel-font text-[11px] mb-1 ${active ? 'text-[#1cc4f0]' : 'text-[#cfe6ff]'}`}>{d.label}</div>
                    <div className="minecraft-font text-[#93b0d8] text-base">{d.desc}</div>
                  </button>
                );
              })}
            </div>

            {deliveryOption === 'specified' && (
              <div className="mt-4 pixel-panel-inner p-4">
                <div className="pixel-font text-[10px] text-[#1cc4f0] mb-3">DELIVERY COORDINATES *</div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">X</label>
                    <input type="number" className="pixel-input" value={coords.x} onChange={e => setCoords({ ...coords, x: e.target.value })} placeholder="0" />
                  </div>
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">Y</label>
                    <input type="number" className="pixel-input" value={coords.y} onChange={e => setCoords({ ...coords, y: e.target.value })} placeholder="64" />
                  </div>
                  <div>
                    <label className="pixel-font text-[9px] text-[#93b0d8] block mb-1">Z</label>
                    <input type="number" className="pixel-input" value={coords.z} onChange={e => setCoords({ ...coords, z: e.target.value })} placeholder="0" />
                  </div>
                </div>
              </div>
            )}

            {deliveryOption === 'meetup' && (
              <div className="mt-4 pixel-panel-inner p-4">
                <label className="pixel-font text-[10px] text-[#1cc4f0] block mb-2">MEETUP DETAILS *</label>
                <textarea className="pixel-input" rows={3} value={meetupNote} onChange={e => setMeetupNote(e.target.value)}
                  placeholder="Server, location, your timezone..." />
              </div>
            )}
          </div>

          {/* 3. PRIORITY */}
          <div className="pixel-panel p-6">
            <div className="pixel-font text-[#1cc4f0] text-sm mb-4 pb-3 border-b-2 border-[#25304a]">3. PRIORITY</div>
            <div className="grid md:grid-cols-3 gap-3">
              {PRIORITIES.map(p => {
                const active = priority === p.id;
                return (
                  <button type="button" key={p.id} onClick={() => setPriority(p.id)}
                    className={`p-4 border-2 transition-all text-left ${active ? 'border-[#1cc4f0] bg-[#1cc4f0]/10' : 'border-[#25304a] bg-[#0a0e1a] hover:border-[#3a4a70]'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-5 h-5" style={{ color: p.color }} />
                      <span className={`pixel-font text-[10px] ${p.fee === 0 ? 'text-[#1fae51]' : 'text-[#e0a522]'}`}>
                        {p.fee === 0 ? 'FREE' : `+$${p.fee}`}
                      </span>
                    </div>
                    <div className={`pixel-font text-[11px] mb-1 ${active ? 'text-[#1cc4f0]' : 'text-[#cfe6ff]'}`}>{p.label}</div>
                    <div className="minecraft-font text-[#93b0d8] text-base">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. DISCOUNT */}
          <div className="pixel-panel p-6">
            <div className="pixel-font text-[#1cc4f0] text-sm mb-4 pb-3 border-b-2 border-[#25304a]">4. DISCOUNT CODE (OPTIONAL)</div>
            {!appliedCode ? (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <TicketPercent className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6f88ad]" />
                  <input className="pixel-input pl-9" value={discountInput} onChange={e => setDiscountInput(e.target.value)} placeholder="Enter promo code" />
                </div>
                <button type="button" onClick={applyDiscount} className="btn-cyan">Apply</button>
              </div>
            ) : (
              <div className="pixel-panel-inner p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#1fae51]" />
                  <div>
                    <div className="pixel-font text-[#1fae51] text-xs">{appliedCode.toUpperCase()} APPLIED</div>
                    <div className="minecraft-font text-[#93b0d8] text-base">-${totals.discountAmount.toFixed(2)} off</div>
                  </div>
                </div>
                <button type="button" onClick={removeDiscount} className="btn-ghost inline-flex items-center gap-1" style={{ padding: '6px 10px' }}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {discountErr && (
              <div className="mt-2 pixel-panel-inner p-2 minecraft-font text-[#d83b3b] text-base text-center">{discountErr}</div>
            )}
          </div>

          {/* 5. PAYMENT METHOD */}
          <div className="pixel-panel p-6">
            <div className="pixel-font text-[#1cc4f0] text-sm mb-4 pb-3 border-b-2 border-[#25304a]">5. PAYMENT METHOD</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PAYMENT_METHODS.map(p => {
                const I = p.Icon;
                const active = paymentMethod === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id)}
                    className={`p-4 border-2 transition-all text-left ${active ? 'border-[#1cc4f0] bg-[#1cc4f0]/10' : 'border-[#25304a] bg-[#0a0e1a] hover:border-[#3a4a70]'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 border-2 flex items-center justify-center" style={{ borderColor: active ? '#1cc4f0' : '#25304a', background: active ? '#0e1426' : 'transparent' }}>
                        <I className="w-4 h-4" style={{ color: p.color }} />
                      </div>
                      {active && <Check className="w-4 h-4 text-[#1cc4f0] ml-auto" />}
                    </div>
                    <div className={`pixel-font text-[10px] leading-tight mb-1 ${active ? 'text-[#1cc4f0]' : 'text-[#cfe6ff]'}`}>{p.label}</div>
                    <div className="minecraft-font text-[#93b0d8] text-sm">{p.sub}</div>
                  </button>
                );
              })}
            </div>
            <p className="minecraft-font text-[#6f88ad] text-base mt-3">
              Order is created <strong className="text-[#1fae51]">only after</strong> payment is confirmed. Secure checkout handled by our payment processor.
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="pixel-panel p-6 h-fit sticky top-4">
          <div className="pixel-font text-[#1cc4f0] text-sm mb-4 pb-3 border-b-2 border-[#25304a]">YOUR ORDER</div>
          <div className="space-y-2 mb-4 max-h-56 overflow-auto">
            {items.map(i => (
              <div key={i.id} className="flex justify-between minecraft-font text-base">
                <span className="text-[#cfe6ff]">{i.qty}× {i.name}</span>
                <span className="text-[#1cc4f0]">${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 pt-3 border-t-2 border-[#25304a] minecraft-font text-base">
            <div className="flex justify-between"><span className="text-[#93b0d8]">Subtotal</span><span className="text-[#cfe6ff]">${totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-[#93b0d8]">Delivery</span><span className={totals.deliveryFee === 0 ? 'text-[#1fae51]' : 'text-[#cfe6ff]'}>{totals.deliveryFee === 0 ? 'FREE' : `+$${totals.deliveryFee.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-[#93b0d8]">Priority</span><span className={totals.priorityFee === 0 ? 'text-[#1fae51]' : 'text-[#cfe6ff]'}>{totals.priorityFee === 0 ? 'FREE' : `+$${totals.priorityFee.toFixed(2)}`}</span></div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between"><span className="text-[#93b0d8]">Discount</span><span className="text-[#1fae51]">-${totals.discountAmount.toFixed(2)}</span></div>
            )}
          </div>
          <div className="flex justify-between items-baseline mt-3 pt-3 border-t-2 border-[#25304a]">
            <span className="pixel-font text-xs text-[#cfe6ff]">TOTAL</span>
            <span className="pixel-font text-xl text-[#1cc4f0]">${totals.total.toFixed(2)}</span>
          </div>
          <button type="submit" disabled={redirecting} className="btn-cyan w-full inline-flex items-center justify-center gap-2 mt-4">
            <ExternalLink className="w-3 h-3" /> {redirecting ? 'Processing...' : `Pay $${totals.total.toFixed(2)}`}
          </button>
          <p className="minecraft-font text-[#6f88ad] text-sm text-center mt-3">Secure 256-bit SSL checkout</p>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
