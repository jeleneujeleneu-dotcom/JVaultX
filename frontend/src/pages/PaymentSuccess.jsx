import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, X, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

const PaymentSuccess = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { finalizeOrder } = useCart();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [failed, setFailed] = useState(false);
  const status = params.get('status') || 'success';

  useEffect(() => {
    if (status === 'success') {
      const o = finalizeOrder();
      if (o) {
        setOrder(o);
        toast({ title: 'Payment confirmed!', description: `Order #${o.id} created` });
      } else {
        setFailed(true);
      }
    } else {
      setFailed(true);
    }
    // eslint-disable-next-line
  }, []);

  if (failed) {
    return (
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="pixel-panel p-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-[#d83b3b] border-2 border-[#9a2424] flex items-center justify-center" style={{ boxShadow: '0 4px 0 #5a1010' }}>
            <X className="w-8 h-8 text-white" />
          </div>
          <h2 className="pixel-font text-xl text-white mb-3">Payment Not Confirmed</h2>
          <p className="minecraft-font text-[#cfe6ff] text-lg mb-6">
            We couldn't find your pending checkout. If you completed payment on sell.app, contact support with your payment ID.
          </p>
          <button onClick={() => nav('/shop')} className="btn-cyan">Back to Shop</button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="pixel-panel p-10">
          <div className="minecraft-font text-[#1cc4f0] text-xl">Confirming payment...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="pixel-panel p-10">
        <div className="w-16 h-16 mx-auto mb-6 bg-[#1fae51] border-2 border-[#15813a] flex items-center justify-center" style={{ boxShadow: '0 4px 0 #0c5b27' }}>
          <Check className="w-8 h-8 text-[#04150a]" />
        </div>
        <h2 className="pixel-font text-xl text-white mb-3">Payment Confirmed!</h2>
        <p className="minecraft-font text-[#cfe6ff] text-xl mb-2">Order ID: <span className="text-[#1cc4f0]">#{order.id}</span></p>
        <p className="minecraft-font text-[#93b0d8] text-lg mb-8">
          Items for <span className="text-[#1cc4f0]">{order.mcName}</span> will be delivered in-game shortly.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => nav('/account')} className="btn-cyan">View Orders</button>
          <button onClick={() => nav('/shop')} className="btn-ghost">Continue Shopping</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
