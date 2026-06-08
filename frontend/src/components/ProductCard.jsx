import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast({ title: 'Added to cart', description: `${product.name} (1x)` });
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card block">
      <div className="product-img-box">
        {product.discount && <div className="discount-badge">-{product.discount}%</div>}
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => { e.target.src = 'https://mc.nerothe.com/img/1.21/minecraft_chest.png'; }}
        />
      </div>
      <div className="p-4">
        <div className="minecraft-font text-[#cfe6ff] text-lg leading-tight mb-2 min-h-[48px]">{product.name}</div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <span className="pixel-font text-[#1cc4f0] text-sm">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="minecraft-font text-[#6f88ad] text-base line-through">${product.oldPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
        <button onClick={handleAdd} className="btn-cyan w-full flex items-center justify-center gap-2">
          <Plus className="w-3 h-3" />
          <span>Add</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
