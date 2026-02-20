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
    <div className="flex min-h-screen w-full items-center justify-center font-display text-[#101b0d] overflow-hidden bg-[#f0fdf4]">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#132210 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      <div className="w-full max-w-[420px] px-6 relative z-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-primary/5">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6" onClick={() => navigate('/')}>
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="material-symbols-outlined text-primary text-4xl group-hover:rotate-12 transition-transform">
                  water_drop
                </span>
                <span className="text-3xl font-bold italic tracking-tight text-primary font-display">Chuvisco</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-text-main">O Portão</h1>
            <p className="mt-2 text-muted font-body">Entre para cuidar do seu jardim digital.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="group relative">
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted font-ui" htmlFor="email">Email</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-0 text-slate-300 group-focus-within:text-primary transition-colors">mail</span>
                  <input
                    className="peer block w-full border-0 border-b border-slate-100 bg-transparent py-3 pl-8 text-base text-slate-900 focus:border-primary focus:ring-0 placeholder:text-slate-300 font-body transition-all"
                    id="email"
                    type="email"
                    placeholder="naira@chuvisco.com"
                    required
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted font-ui" htmlFor="password">Senha</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-0 text-slate-300 group-focus-within:text-primary transition-colors">lock</span>
                  <input
                    className="peer block w-full border-0 border-b border-slate-100 bg-transparent py-3 pl-8 text-base text-slate-900 focus:border-primary focus:ring-0 placeholder:text-slate-300 font-body transition-all"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-fade-in">
                <span className="material-symbols-outlined text-lg">error</span>
                <span className="text-xs font-medium font-body italic">Chave incorreta. Tente "123". (Demo...)</span>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary px-8 py-4 text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98] ${shaking ? 'animate-shake' : ''}`}
              >
                <span className="font-ui text-sm font-bold tracking-wider uppercase">Abrir o Portão</span>
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>

            <div className="flex justify-center pt-2">
              <button onClick={() => navigate('/')} className="text-xs text-slate-400 hover:text-primary transition-colors font-body flex items-center gap-1 group" type="button">
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