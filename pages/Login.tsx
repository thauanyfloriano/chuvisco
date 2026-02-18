import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate validation error then success for demo
    setShaking(true);
    setError(true);
    setTimeout(() => setShaking(false), 820);
    
    // In a real app, this would be the success path
    setTimeout(() => {
        navigate('/admin');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row font-display text-[#101b0d] overflow-hidden bg-white">
      {/* Left Panel */}
      <div className="relative flex h-64 w-full flex-col justify-center bg-[#132210] px-10 py-12 lg:h-screen lg:w-[45%] lg:px-20 xl:w-[40%] text-white">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#37ec13 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center gap-3 text-primary mb-4 cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined text-4xl">yard</span>
            <span className="text-2xl font-bold tracking-tight text-white">Chuvisco</span>
          </div>
          <blockquote className="border-l-4 border-primary pl-6">
            <p className="text-3xl font-medium italic leading-snug lg:text-4xl xl:text-5xl">
              "A poesia é a música da alma, e acima de tudo, de almas grandes e sentimentais."
            </p>
            <footer className="mt-6 text-lg text-primary/80 font-body">— Voltaire</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-20 bg-surface">
        <div className="w-full max-w-[420px] space-y-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold lg:text-5xl">O Portão</h1>
            <p className="mt-3 text-lg text-slate-500 font-body">Entre para cuidar do jardim.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="group relative">
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted font-ui" htmlFor="email">Email</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-0 text-slate-400 group-focus-within:text-primary-dark transition-colors">mail</span>
                  <input 
                    className="peer block w-full border-0 border-b border-slate-200 bg-transparent py-3 pl-8 text-lg text-slate-900 focus:border-primary-dark focus:ring-0 placeholder:text-slate-300 font-body" 
                    id="email" 
                    type="email" 
                    placeholder="user@teste.com" 
                    required 
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted font-ui" htmlFor="password">Senha</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-0 text-slate-400 group-focus-within:text-primary-dark transition-colors">lock</span>
                  <input 
                    className="peer block w-full border-0 border-b border-slate-200 bg-transparent py-3 pl-8 text-lg text-slate-900 focus:border-primary-dark focus:ring-0 placeholder:text-slate-300 font-body" 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-fade-in">
                <span className="material-symbols-outlined text-lg">error</span>
                <span className="text-sm font-medium font-body">Chave incorreta. Tente "123". (Demo: Redirecionando...)</span>
              </div>
            )}

            <div className="pt-2">
              <button 
                type="submit" 
                className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#132210] px-8 py-4 text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${shaking ? 'animate-shake' : ''}`}
              >
                <span className="font-ui text-sm font-bold tracking-wider uppercase">Abrir o Portão</span>
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>
            
            <div className="flex justify-center pt-4">
              <button onClick={() => navigate('/')} className="text-sm text-slate-400 hover:text-primary-dark transition-colors font-body flex items-center gap-1 group" type="button">
                <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Voltar para o site
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;