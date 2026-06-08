import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Shield, Vault, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const loc = useLocation();
  const nav = useNavigate();
  const path = loc.pathname;

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop/offers', label: 'Offers' },
  ];

  return (
    <header className="relative z-20 border-b-2 border-[#25304a] bg-[#0a0e1a]/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1cc4f0] border-2 border-[#08a0c8] flex items-center justify-center" style={{ boxShadow: '0 4px 0 #066d8a' }}>
            <Vault className="w-5 h-5 text-[#052235]" />
          </div>
          <div>
            <div className="pixel-font text-[#1cc4f0] text-lg leading-none">JVaultX</div>
            <div className="minecraft-font text-[#6f88ad] text-sm">premium minecraft shop</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`nav-link ${path === l.to ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative nav-link flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#1cc4f0] text-[#052235] pixel-font text-[9px] px-1.5 py-0.5 border-2 border-[#08a0c8]">{itemCount}</span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link flex items-center gap-1">
                  <Shield className="w-4 h-4" /> Admin
                </Link>
              )}
              {user.role === 'delivery' && (
                <Link to="/admin" className="nav-link flex items-center gap-1">
                  <Truck className="w-4 h-4" /> Delivery
                </Link>
              )}
              <Link to="/account" className="nav-link flex items-center gap-1">
                <User className="w-4 h-4" /> {user.mcName}
              </Link>
              <button onClick={() => { logout(); nav('/'); }} className="nav-link flex items-center gap-1">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-cyan">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
