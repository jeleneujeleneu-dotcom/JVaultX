import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Twitter, Youtube } from 'lucide-react';
import { DISCORD_URL } from '../mock';

const Footer = () => (
  <footer className="relative z-10 border-t-2 border-[#25304a] bg-[#0a0e1a]/90 mt-20">
    <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
      <div>
        <div className="pixel-font text-[#1cc4f0] text-base mb-4">JVaultX</div>
        <p className="minecraft-font text-[#93b0d8] text-lg">The most reliable Minecraft 2b2t shop with instant delivery and verified items.</p>
      </div>
      <div>
        <div className="pixel-font text-[#e6f1ff] text-xs mb-4">SHOP</div>
        <ul className="space-y-1 minecraft-font text-lg">
          <li><Link to="/shop/offers" className="text-[#93b0d8] hover:text-[#1cc4f0] transition-colors">Offers</Link></li>
          <li><Link to="/shop/kits" className="text-[#93b0d8] hover:text-[#1cc4f0] transition-colors">Kits</Link></li>
          <li><Link to="/shop/packs" className="text-[#93b0d8] hover:text-[#1cc4f0] transition-colors">Packs</Link></li>
          <li><Link to="/shop/tools" className="text-[#93b0d8] hover:text-[#1cc4f0] transition-colors">Tools</Link></li>
        </ul>
      </div>
      <div>
        <div className="pixel-font text-[#e6f1ff] text-xs mb-4">SUPPORT</div>
        <ul className="space-y-1 minecraft-font text-lg">
          <li><Link to="/info/faq" className="text-[#93b0d8] hover:text-[#1cc4f0] transition-colors">FAQ</Link></li>
          <li><Link to="/info/delivery" className="text-[#93b0d8] hover:text-[#1cc4f0] transition-colors">Delivery</Link></li>
          <li><Link to="/info/refund" className="text-[#93b0d8] hover:text-[#1cc4f0] transition-colors">Refund Policy</Link></li>
          <li><Link to="/info/contact" className="text-[#93b0d8] hover:text-[#1cc4f0] transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div>
        <div className="pixel-font text-[#e6f1ff] text-xs mb-4">SOCIAL</div>
        <div className="flex gap-3">
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" title="Discord" className="w-10 h-10 border-2 border-[#25304a] flex items-center justify-center hover:border-[#1cc4f0] cursor-pointer transition-colors"><MessageCircle className="w-4 h-4 text-[#1cc4f0]" /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter" className="w-10 h-10 border-2 border-[#25304a] flex items-center justify-center hover:border-[#1cc4f0] cursor-pointer transition-colors"><Twitter className="w-4 h-4 text-[#1cc4f0]" /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube" className="w-10 h-10 border-2 border-[#25304a] flex items-center justify-center hover:border-[#1cc4f0] cursor-pointer transition-colors"><Youtube className="w-4 h-4 text-[#1cc4f0]" /></a>
        </div>
      </div>
    </div>
    <div className="border-t-2 border-[#25304a] py-4 text-center minecraft-font text-[#6f88ad] text-base">
      © 2026 JVaultX. Not affiliated with Mojang AB.
    </div>
  </footer>
);

export default Footer;
