import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import CategorySidebar from '../components/CategorySidebar';
import ProductCard from '../components/ProductCard';
import { PRODUCTS, CATEGORIES } from '../mock';

const Shop = () => {
  const { categoryId } = useParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');

  const filtered = useMemo(() => {
    let list = categoryId ? PRODUCTS.filter(p => p.category === categoryId) : PRODUCTS;
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'low') list = [...list].sort((a,b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a,b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }, [categoryId, search, sort]);

  const currentCat = CATEGORIES.find(c => c.id === categoryId);

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="pixel-font text-2xl text-white mb-2" style={{ textShadow: '3px 3px 0 #08a0c8' }}>
          {currentCat ? currentCat.name : 'All Products'}
        </h1>
        <p className="minecraft-font text-[#93b0d8] text-lg">
          {filtered.length} items available
        </p>
      </div>

      <div className="grid lg:grid-cols-[260px,1fr] gap-6">
        <CategorySidebar />

        <div>
          {/* Toolbar */}
          <div className="pixel-panel p-4 mb-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6f88ad]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search items..."
                className="pixel-input pl-9"
              />
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="pixel-input max-w-[200px]"
            >
              <option value="default">Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="pixel-panel p-12 text-center">
              <div className="minecraft-font text-[#93b0d8] text-xl">No items found.</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
