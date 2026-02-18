import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-[250px] bg-gradient-to-b from-primary to-[#2f6325] flex flex-col justify-between h-full text-white shrink-0 shadow-xl z-20 relative overflow-hidden">
      <div className="p-8 relative z-10">
        <div className="mb-12 cursor-pointer" onClick={() => navigate('/')}>
          <h1 className="font-display italic text-3xl tracking-wide">Chuvisco</h1>
          <p className="font-ui text-xs text-accent/80 tracking-widest uppercase mt-1">Admin</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button 
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left ${isActive('/admin') ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            onClick={() => navigate('/admin')}
          >
            <span className="material-symbols-outlined text-[20px]">book_2</span>
            <span className="font-ui font-medium text-sm tracking-wide">Poemas</span>
          </button>
          
          <button 
             className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left ${isActive('/editor') ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
             onClick={() => navigate('/editor')}
          >
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            <span className="font-ui font-medium text-sm tracking-wide">Escrever</span>
          </button>
          
          <button className="group flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all duration-200 w-full text-left">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="font-ui font-medium text-sm tracking-wide">Configurações</span>
          </button>
        </nav>
      </div>

      <div className="p-8 relative z-10">
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-red-200 transition-colors duration-200 w-full text-left"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-ui font-medium text-sm tracking-wide">Sair</span>
        </button>
        
        <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-display font-bold text-lg border border-accent/30">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-ui text-sm font-medium">Ana Silva</span>
            <span className="font-ui text-xs text-white/50">Poetisa</span>
          </div>
        </div>
      </div>
      
      {/* Decorative leaf texture overlay */}
      <div className="absolute bottom-0 left-0 w-full h-64 opacity-5 pointer-events-none mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1596324683526-0e121516404b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center"></div>
    </aside>
  );
};

export default Sidebar;