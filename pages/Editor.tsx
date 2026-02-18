import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('A Dança da Chuva');
  const [isToolbarVisible, setToolbarVisible] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Simulate showing formatting toolbar on selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        setToolbarVisible(true);
      } else {
        setToolbarVisible(false);
      }
    };
    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-main font-display antialiased selection:bg-primary/30">
      {/* Top Navigation / Toolbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-primary/20 bg-[#f9fcf8]/90 px-6 py-4 backdrop-blur-md transition-all sm:px-10">
        <div className="flex items-center gap-4 flex-1">
          <button 
             onClick={() => navigate('/admin')}
             className="group flex items-center gap-2 text-text-main text-sm font-medium font-ui leading-normal transition-colors hover:text-primary-dark"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
            <span>Cancelar</span>
          </button>
        </div>
        
        <div className="hidden md:flex flex-col items-center justify-center flex-1">
          <div className="flex items-center gap-2 text-text-muted text-xs font-ui tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Salvo às 14:00
          </div>
        </div>
        
        <div className="flex flex-1 justify-end gap-3">
          <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl bg-primary-light/20 px-4 py-2.5 text-text-main text-sm font-bold leading-normal tracking-[0.015em] font-ui transition-colors hover:bg-primary/20">
            <span className="truncate">Salvar Rascunho</span>
          </button>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-white text-sm font-bold leading-normal tracking-[0.015em] font-ui shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-95">
            <span className="truncate">Publicar</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex justify-center w-full px-4 py-8 sm:py-16">
        <div className="w-full max-w-[720px] relative">
            
          {/* Simulated Floating Toolbar */}
          <div 
            className={`absolute top-[280px] left-1/2 -translate-x-1/2 -translate-y-16 z-40 transition-all duration-300 ${isToolbarVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
          >
            <div className="flex items-center gap-1 bg-text-main text-white rounded-lg p-1 shadow-float">
              {['format_bold', 'format_italic', 'format_quote', 'format_clear'].map(icon => (
                  <button key={icon} className="p-2 hover:bg-white/20 rounded transition-colors" title={icon}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  </button>
              ))}
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-text-main mx-auto"></div>
          </div>

          <div className="group mb-8">
            <input 
              className="w-full bg-transparent text-5xl sm:text-6xl font-bold text-text-main placeholder:text-gray-300 border-none outline-none focus:ring-0 p-0 leading-tight font-display tracking-tight" 
              placeholder="O Título..." 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div 
            ref={editorRef}
            className="editor-content w-full min-h-[60vh] text-xl sm:text-2xl leading-relaxed text-text-main/90 outline-none font-display resize-none group empty:before:content-[attr(placeholder)] empty:before:text-gray-400 empty:before:italic" 
            contentEditable 
            suppressContentEditableWarning
          >
            <p className="mb-6">
                A chuva cai lá fora,<br/>
                como um suspiro antigo da terra.<br/>
                Eu observo através do vidro,<br/>
                o mundo se dissolvendo em cinza e verde.
            </p>
            <p className="mb-6">
                <span className="bg-primary/20 decoration-clone p-1 rounded">Cada gota é uma memória</span> que retorna,<br/>
                lavando a poeira dos dias esquecidos.<br/>
                O cheiro de terra molhada invade a sala,<br/>
                e por um momento, o tempo para.
            </p>
            <p className="mb-6">
                Não há pressa, não há ruído,<br/>
                apenas o ritmo constante da água,<br/>
                batendo suavemente,<br/>
                como um coração que ainda pulsa.
            </p>
          </div>

          <div className="mt-12 flex justify-between items-center border-t border-primary/20 pt-6 text-text-muted text-sm font-ui">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">text_fields</span>
              105 palavras
            </span>
            <span className="flex items-center gap-1 opacity-70">Rascunho</span>
          </div>
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-tr from-[#9bdd88]/10 to-transparent rounded-full blur-3xl opacity-40"></div>
      </div>
    </div>
  );
};

export default Editor;