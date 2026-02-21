import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { invalidateSession } from '../src/lib/auth';
import { Menu, X } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botão Hambúrguer Mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-6 right-6 z-[60] p-3 rounded-2xl bg-primary text-white shadow-lg focus:outline-none"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay Escura Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-[280px] lg:w-[250px] bg-gradient-to-b from-primary to-[#2f6325] 
        flex flex-col justify-between h-full text-white shrink-0 shadow-xl 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
       overflow-hidden`}>
        <div className="p-8 relative z-10">
          <div className="mb-12 cursor-pointer flex items-center gap-2 group" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined text-accent text-3xl group-hover:rotate-12 transition-transform">
              water_drop
            </span>
            <div>
              <h1 className="font-display italic text-2xl tracking-wide leading-none">Chuvisco</h1>
              <p className="font-ui text-[10px] text-accent/80 tracking-widest uppercase mt-1">Admin</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <button
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left ${isActive('/admin') ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
              onClick={() => { navigate('/admin'); setIsOpen(false); }}
            >
              <span className="material-symbols-outlined text-[20px]">book_2</span>
              <span className="font-ui font-medium text-sm tracking-wide">Poemas</span>
            </button>

            <button
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left ${isActive('/editor') ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
              onClick={() => { navigate('/editor'); setIsOpen(false); }}
            >
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
              <span className="font-ui font-medium text-sm tracking-wide">Escrever</span>
            </button>
          </nav>
        </div>

        <div className="p-8 relative z-10">
          <button
            onClick={() => { navigate('/settings'); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-ui text-sm font-medium ${location.pathname === '/settings' ? 'bg-white/20 text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
            <span className="tracking-wide">Configurações</span>
          </button>

          <button
            onClick={async () => {
              await invalidateSession(); // Invalida no banco de dados
              localStorage.removeItem('chuvisco_auth_token');
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-ui text-sm font-medium text-red-300 hover:bg-red-500/10"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            <span className="tracking-wide">Sair</span>
          </button>

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
            <div
              onClick={() => navigate('/settings')}
              className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 overflow-hidden group cursor-pointer hover:bg-accent/30 transition-colors"
            >
              <img
                src="/nai.jpg"
                alt="Naira Floriano"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = '<span class="material-symbols-outlined text-accent text-xl">person</span>';
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-ui text-sm font-medium">Naira Floriano</span>
              <span className="font-ui text-xs text-white/50">Administradora</span>
            </div>
          </div>
        </div>

        {/* Decorative leaf texture overlay */}
        <div className="absolute bottom-0 left-0 w-full h-64 opacity-5 pointer-events-none mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1596324683526-0e121516404b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center"></div>
      </aside>
    </>
  );
};

export default Sidebar;