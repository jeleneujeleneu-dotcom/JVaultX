import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../mock';
import { useShop } from '../context/ShopContext';

const CategorySidebar = () => {
  const nav = useNavigate();
  const { categoryId } = useParams();
  const { products, getCategoryCount } = useShop();

  return (
    <aside className="pixel-panel p-4">
      <div className="pixel-font text-[#1cc4f0] text-xs mb-4 border-b-2 border-[#25304a] pb-3">CATEGORIES</div>
      <div className="space-y-1">
        <div
          className={`cat-link ${!categoryId ? 'active' : ''}`}
          onClick={() => nav('/shop')}
        >
          <Icons.LayoutGrid className="w-4 h-4" />
          <span className="flex-1">All Products</span>
          <span className="pixel-font text-[10px] text-[#6f88ad]">{products.length}</span>
        </div>
        {CATEGORIES.map(c => {
          const Icon = Icons[c.icon] || Icons.Box;
          const count = getCategoryCount(c.id);
          return (
            <div
              key={c.id}
              className={`cat-link ${categoryId === c.id ? 'active' : ''}`}
              onClick={() => nav(`/shop/${c.id}`)}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">{c.name}</span>
              <span className="pixel-font text-[10px] text-[#6f88ad]">{count}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default CategorySidebar;
