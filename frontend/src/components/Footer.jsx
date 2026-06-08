import React from 'react';
import { MessageCircle, Twitter, Youtube } from 'lucide-react';

const Footer = () => (
  <footer className="relative z-10 border-t-2 border-[#25304a] bg-[#0a0e1a]/90 mt-20">
    <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
      <div>
        <div className="pixel-font text-[#1cc4f0] text-base mb-4">JVaultX</div>
        <p className="minecraft-font text-[#93b0d8] text-lg">The most reliable Minecraft 2b2t shop with instant delivery and verified items.</p>
      </div>
      <div>
        <div className="pixel-font text-[#e6f1ff] text-xs mb-4">SHOP</div>
        <ul className="space-y-1 minecraft-font text-lg text-[#93b0d8]">
          <li>Offers</li><li>Kits</li><li>Packs</li><li>Tools</li>
        </ul>
      </div>
      <div>
        <div className="pixel-font text-[#e6f1ff] text-xs mb-4">SUPPORT</div>
        <ul className="space-y-1 minecraft-font text-lg text-[#93b0d8]">
          <li>FAQ</li><li>Delivery</li><li>Refund Policy</li><li>Contact</li>
        </ul>
      </div>
      <div>
        <div className="pixel-font text-[#e6f1ff] text-xs mb-4">SOCIAL</div>
        <div className="flex gap-3">
          <a className="w-10 h-10 border-2 border-[#25304a] flex items-center justify-center hover:border-[#1cc4f0] cursor-pointer"><MessageCircle className="w-4 h-4 text-[#1cc4f0]" /></a>
          <a className="w-10 h-10 border-2 border-[#25304a] flex items-center justify-center hover:border-[#1cc4f0] cursor-pointer"><Twitter className="w-4 h-4 text-[#1cc4f0]" /></a>
          <a className="w-10 h-10 border-2 border-[#25304a] flex items-center justify-center hover:border-[#1cc4f0] cursor-pointer"><Youtube className="w-4 h-4 text-[#1cc4f0]" /></a>
        </div>
      </div>
    </div>
    <div className="border-t-2 border-[#25304a] py-4 text-center minecraft-font text-[#6f88ad] text-base">
      © 2026 JVaultX. Not affiliated with Mojang AB.
    </div>
  </footer>
);

export default Footer;
