import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Truck, RefreshCw, Mail, Clock, Shield, Check } from 'lucide-react';
import { DISCORD_URL } from '../mock';

const PAGES = {
  faq: {
    title: 'FAQ',
    Icon: HelpCircle,
    content: [
      { q: 'How fast is the delivery?', a: 'Most orders are delivered within 1–24 hours depending on your selected priority. High priority orders are handled within 1 hour.' },
      { q: 'Is using JVaultX safe?', a: 'Yes. We never share player accounts and all items are verified. We do not ask for your Minecraft password — only your in-game name.' },
      { q: 'What payment methods do you accept?', a: 'We use sell.app for payments. Supported methods include credit/debit cards, PayPal, Apple Pay, Google Pay and major crypto currencies (BTC, ETH, USDT, etc.).' },
      { q: 'Can I get a refund?', a: 'Yes — see our Refund Policy page. Refunds are processed if the items were not delivered.' },
      { q: 'How can I contact you?', a: 'Join our Discord for the fastest support, or use the Contact page.' },
    ],
  },
  delivery: {
    title: 'Delivery',
    Icon: Truck,
    content: [
      { q: 'Delivery methods', a: 'Random Location (FREE) — we drop items at a safe spot near spawn. Specified Coordinates (+$1) — you provide exact X/Y/Z. Meetup (+$4) — personal in-game handover.' },
      { q: 'Priority levels', a: 'Low (FREE) — within 24 hours. Medium (+$2) — within 6 hours. High (+$5) — within 1 hour.' },
      { q: 'Server support', a: 'We primarily operate on 2b2t.org. For other servers, contact us via Discord first.' },
      { q: 'What if I am offline?', a: 'For Random Location and Specified Coordinates delivery you do not need to be online. For Meetup we will arrange a time with you via Discord.' },
    ],
  },
  refund: {
    title: 'Refund Policy',
    Icon: RefreshCw,
    content: [
      { q: 'When can I get a refund?', a: 'Full refund is available if your order was not delivered within 72 hours of payment confirmation, or if delivered items were significantly different from what you ordered.' },
      { q: 'When can I NOT get a refund?', a: 'No refunds for: items already delivered and accepted; items lost in-game after delivery (e.g. PVP death, hardcore mode); orders where the buyer provided invalid Minecraft username or coordinates.' },
      { q: 'How to request a refund?', a: 'Open a ticket in our Discord with your order ID and reason for the refund. We typically respond within 24 hours.' },
      { q: 'Refund processing time', a: 'After approval refunds are processed within 5–10 business days through your original payment method via sell.app.' },
    ],
  },
  contact: {
    title: 'Contact',
    Icon: Mail,
    content: [
      { q: 'Discord (fastest)', a: 'Join our Discord server for instant support and community. Most issues are resolved within minutes.' },
      { q: 'Email', a: 'support@jvaultx.com — response time typically within 24 hours.' },
      { q: 'Business hours', a: 'Discord support is available 24/7. Email support: Mon–Fri 9:00–18:00 UTC.' },
    ],
  },
};

const InfoPage = () => {
  const { slug } = useParams();
  const page = PAGES[slug];

  if (!page) {
    return (
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="pixel-font text-xl text-white mb-4">Page not found</h2>
        <Link to="/" className="btn-cyan inline-block">Back home</Link>
      </div>
    );
  }

  const I = page.Icon;

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
      <Link to="/" className="btn-ghost inline-flex items-center gap-2 mb-6">
        <ArrowLeft className="w-3 h-3" /> Home
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-[#1cc4f0] border-2 border-[#08a0c8] flex items-center justify-center" style={{ boxShadow: '0 4px 0 #066d8a' }}>
          <I className="w-7 h-7 text-[#052235]" />
        </div>
        <h1 className="pixel-font text-2xl text-white" style={{ textShadow: '3px 3px 0 #08a0c8' }}>{page.title}</h1>
      </div>

      <div className="space-y-3">
        {page.content.map((item, idx) => (
          <div key={idx} className="pixel-panel p-5">
            <div className="pixel-font text-[#1cc4f0] text-sm mb-3">{item.q}</div>
            <p className="minecraft-font text-[#cfe6ff] text-lg leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="pixel-panel p-6 mt-8 text-center">
        <div className="pixel-font text-[#1cc4f0] text-sm mb-3">NEED MORE HELP?</div>
        <p className="minecraft-font text-[#93b0d8] text-lg mb-4">Join our Discord for fast support and community updates.</p>
        <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="btn-cyan inline-block">Join Discord</a>
      </div>

      {/* Quick stats / promises */}
      {slug === 'delivery' && (
        <div className="grid md:grid-cols-3 gap-3 mt-6">
          {[
            { Icon: Clock, l: 'Avg Delivery', v: 'Under 2h' },
            { Icon: Shield, l: 'Verified', v: '100% Safe' },
            { Icon: Check, l: 'Success Rate', v: '99.8%' },
          ].map(s => {
            const SI = s.Icon;
            return (
              <div key={s.l} className="pixel-panel p-4 text-center">
                <SI className="w-5 h-5 text-[#1cc4f0] mx-auto mb-2" />
                <div className="pixel-font text-[#1cc4f0] text-sm">{s.v}</div>
                <div className="minecraft-font text-[#93b0d8] text-base">{s.l}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InfoPage;
