import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[#f2fcf0]/80 border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => navigate('/')}
        >
          <span className="material-symbols-outlined text-primary text-3xl group-hover:rotate-12 transition-transform">
            water_drop
          </span>
          <span className="text-2xl font-bold italic tracking-tight text-primary font-display">Chuvisco</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate('/')} className="font-ui text-sm font-medium text-primary hover:text-primary-light transition-colors uppercase tracking-wider">O Jardim</button>
          <button onClick={() => navigate('/about')} className="font-ui text-sm font-medium text-text-main/60 hover:text-primary transition-colors uppercase tracking-wider">Sobre</button>
          <button
            onClick={() => navigate('/login')}
            className="font-ui text-sm font-medium text-text-main/60 hover:text-primary transition-colors uppercase tracking-wider"
          >
            Login
          </button>
        </div>

        <button
          className="md:hidden text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#f2fcf0] border-b border-primary/10 p-4 flex flex-col gap-4 shadow-lg animate-fade-in">
          <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} className="text-left font-ui text-sm font-medium text-primary uppercase tracking-wider">O Jardim</button>
          <button onClick={() => { navigate('/about'); setMobileMenuOpen(false); }} className="text-left font-ui text-sm font-medium text-text-main/60 uppercase tracking-wider">Sobre</button>
          <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="text-left font-ui text-sm font-medium text-text-main/60 uppercase tracking-wider">Login</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;