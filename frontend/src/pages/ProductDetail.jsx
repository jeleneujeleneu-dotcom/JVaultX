import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../mock';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="pixel-font text-xl text-white mb-4">Product not found</h2>
        <Link to="/shop" className="btn-cyan inline-block">Back to shop</Link>
      </div>
    );
  }

  const cat = CATEGORIES.find(c => c.id === product.category);
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addToCart(product, qty);
    toast({ title: 'Added to cart!', description: `${product.name} (${qty}x)` });
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    nav('/cart');
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
      <button onClick={() => nav(-1)} className="btn-ghost inline-flex items-center gap-2 mb-6">
        <ArrowLeft className="w-3 h-3" /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="pixel-panel p-8 flex items-center justify-center min-h-[400px]" style={{ background: 'linear-gradient(180deg, #1a2238 0%, #0d1322 100%)' }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-48 h-48"
            style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.7))' }}
            onError={(e) => { e.target.src = 'https://mc.nerothe.com/img/1.21/minecraft_chest.png'; }}
          />
        </div>

        <div className="pixel-panel p-6">
          <div className="pixel-font text-[10px] text-[#1cc4f0] mb-2">{cat?.name?.toUpperCase()}</div>
          <h1 className="pixel-font text-2xl text-white mb-4 leading-tight">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="pixel-font text-2xl text-[#1cc4f0]">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="minecraft-font text-[#6f88ad] text-xl line-through">${product.oldPrice.toFixed(2)}</span>
            )}
            {product.discount && (
              <span className="pixel-font text-[10px] bg-[#d83b3b] text-white px-2 py-1">-{product.discount}%</span>
            )}
          </div>

          <p className="minecraft-font text-[#cfe6ff] text-xl mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border-2 border-[#25304a] bg-[#0a0e1a]">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-[#1cc4f0]/10 text-[#93b0d8]">
                <Minus className="w-4 h-4" />
              </button>
              <div className="pixel-font text-white w-12 text-center text-sm">{qty}</div>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-[#1cc4f0]/10 text-[#93b0d8]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="minecraft-font text-[#93b0d8] text-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1fae51]" />
              {product.stock > 100 ? 'In Stock' : `Only ${product.stock} left`}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleAdd} className="btn-ghost inline-flex items-center gap-2">
              <ShoppingCart className="w-3 h-3" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn-cyan inline-flex items-center gap-2">
              Buy Now
            </button>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-[#25304a] grid grid-cols-2 gap-4">
            <div>
              <div className="pixel-font text-[9px] text-[#6f88ad] mb-1">DELIVERY</div>
              <div className="minecraft-font text-[#cfe6ff] text-lg">Instant in-game</div>
            </div>
            <div>
              <div className="pixel-font text-[9px] text-[#6f88ad] mb-1">SERVER</div>
              <div className="minecraft-font text-[#cfe6ff] text-lg">2b2t.org</div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="pixel-font text-lg text-white mb-6">Related Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
