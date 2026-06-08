import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Package, Shield, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../mock';
import { useShop } from '../context/ShopContext';

const Home = () => {
  const { products, getCategoryCount } = useShop();
  const featured = products.filter(p => p.featured);
  const newItems = products.slice(0, 8);

  return (
    <div className="relative z-10">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="hero-glow" />
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-[#25304a] bg-[#0e1426] mb-6">
              <Zap className="w-3 h-3 text-[#1cc4f0]" />
              <span className="pixel-font text-[10px] text-[#1cc4f0]">INSTANT DELIVERY</span>
            </div>
            <h1 className="pixel-font text-3xl md:text-5xl text-white leading-tight mb-6" style={{ textShadow: '4px 4px 0 #08a0c8, 8px 8px 0 rgba(0,0,0,0.5)' }}>
              JVaultX<br/>
              <span className="text-[#1cc4f0]">Shop</span>
            </h1>
            <p className="minecraft-font text-[#93b0d8] text-2xl mb-8 leading-relaxed">
              The cheapest 2b2t shop with fast delivery times. Kits, items, blocks and more — instantly delivered to your in-game inventory.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop" className="btn-cyan inline-flex items-center gap-2">
                Shop Now <ArrowRight className="w-3 h-3" />
              </Link>
              <Link to="/shop/offers" className="btn-ghost inline-flex items-center gap-2">
                View Offers
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { v: '50K+', l: 'Orders' },
                { v: '24/7', l: 'Delivery' },
                { v: '4.9★', l: 'Rating' },
              ].map(s => (
                <div key={s.l} className="pixel-panel p-3 text-center">
                  <div className="pixel-font text-[#1cc4f0] text-lg">{s.v}</div>
                  <div className="minecraft-font text-[#93b0d8] text-base">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="pixel-panel p-6">
              <div className="grid grid-cols-3 gap-3">
                {featured.slice(0,9).map((p,i) => (
                  <div key={p.id} className="pixel-panel-inner aspect-square flex items-center justify-center hover:scale-105 transition-transform" style={{ animationDelay: `${i*0.1}s` }}>
                    <img src={p.image} alt={p.name} className="w-12 h-12" style={{ imageRendering: 'pixelated' }} onError={(e) => { e.target.src='https://mc.nerothe.com/img/1.21/minecraft_chest.png'; }} />
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <div className="pixel-font text-[#1cc4f0] text-xs">FEATURED ITEMS</div>
                <div className="minecraft-font text-[#93b0d8] text-lg">Hand-picked best sellers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="pixel-font text-xl text-white">Categories</h2>
          <Link to="/shop" className="minecraft-font text-[#1cc4f0] text-lg hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.slice(0, 12).map(c => (
            <Link key={c.id} to={`/shop/${c.id}`} className="pixel-panel p-4 text-center hover:border-[#1cc4f0] transition-colors">
              <div className="pixel-font text-xs text-[#1cc4f0] mb-1">{c.name}</div>
              <div className="minecraft-font text-[#93b0d8] text-base">{getCategoryCount(c.id)} items</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#1cc4f0]" />
              <span className="pixel-font text-[#1cc4f0] text-[10px]">HOT DEALS</span>
            </div>
            <h2 className="pixel-font text-xl text-white">Featured Offers</h2>
          </div>
          <Link to="/shop/offers" className="minecraft-font text-[#1cc4f0] text-lg hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* WHY US */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="pixel-font text-xl text-white text-center mb-8">Why JVaultX?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { i: Zap, t: 'Instant Delivery', d: 'Items in your inventory within minutes after purchase.' },
            { i: Shield, t: 'Verified & Safe', d: 'All items legit. No bans, no scams, no worries.' },
            { i: Package, t: 'Best Prices', d: 'Cheapest 2b2t shop on the market. Guaranteed.' },
          ].map(f => {
            const I = f.i;
            return (
              <div key={f.t} className="pixel-panel p-6 text-center hover:border-[#1cc4f0] transition-colors">
                <div className="w-12 h-12 mx-auto mb-3 bg-[#1cc4f0] border-2 border-[#08a0c8] flex items-center justify-center" style={{ boxShadow: '0 4px 0 #066d8a' }}>
                  <I className="w-5 h-5 text-[#052235]" />
                </div>
                <div className="pixel-font text-[#1cc4f0] text-sm mb-2">{f.t}</div>
                <div className="minecraft-font text-[#93b0d8] text-lg">{f.d}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* NEW ITEMS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="pixel-font text-xl text-white mb-6">Latest Items</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newItems.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
};

export default Home;
