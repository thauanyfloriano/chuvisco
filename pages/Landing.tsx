import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const poems = [
  {
    id: '1',
    title: 'O Silêncio da Manhã',
    excerpt: 'O orvalho repousa sobre a folha cansada, esperando o sol que tarda a nascer. No jardim, o silêncio é uma prece...',
    category: 'Natureza',
    date: '12 OUT',
    author: { name: 'Ana Silva', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ86t6cTMObADp_rKDOtlTomGApOzWvK4nzeTgVXEfGQ64TRQGCpw4SS5rtt9Ik9ukI0XMNYQ65XMW_nKefKjIeGqMTJlxcXI7T8Y9wSG1Ae4gMXcBpOR0S77Q-1RVWyis0RyzyvO4IKnH3PRv1Ixi4DFCGmWpPo_i0oIa0ODcBwzcbA_FqT8i4gFV9VSrSk1g8Fp9MBCKgHvHW3BUcs_9oBCl1RhiJCJU3nBb-C5_om9mMnEEIcDJA1G6lWgSeGB0M8E60cWGcrI' },
    bgClass: 'bg-white dark:bg-[#1a2e16]',
    borderClass: 'border border-[#e9f3e7] dark:border-white/5'
  },
  {
    id: '2',
    title: 'Raízes Profundas',
    excerpt: 'Somos feitos de terra e memória, caminhhando sobre o chão que nossos pais pisaram. As raízes não prendem, elas sustentam...',
    category: 'Reflexão',
    date: '28 SET',
    author: { name: 'Carlos Mendes', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc1JGe_w0sOuIDQ9gkAiycCpM5FQ9Pdj8i_gvasiS8G-7149wpb1ApyeVCb07Goly7QiG6feHCWJ1viBZJYKy0RgzFzCjmc0Y_tQWHlu7dTbVg0B97LeZd7avCABh3ZtF7WaYHpmlKNei3tKts55RLwMVUNQyRlA9LeeGEVs2zCecak59cVyNqcuoz0jh9MvU1pkIY9veQdcPSQqIRMFlg9KkjkPttZ_sqfpA0ltquqO34YLHjYB5HADUXb1i2qwFDUzHMGpNr0AM' },
    bgClass: 'bg-[#f2fcf0] dark:bg-[#1a2e16]',
    borderClass: 'border border-transparent dark:border-white/5'
  },
  {
    id: '3',
    title: 'Vento Norte',
    excerpt: 'O vento que traz o frio também traz a clareza dos dias límpidos.',
    date: '15 SET',
    category: 'Destaque',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBozM8qJ2NDqsGfj7hu_lv2wXOQr9eKMBBeeqW6_OpQz8LjvL2t77FlpAJjr206OzgCzHL__dlzVav5aywCxEK8R3tRykLtJmtxDnA-edXWJXW5ZI7W7TjQzmNpj4y57lesMflsNBRKr3kUICoPog8Ci78LXlX0rVzAMMtiLxcIJcCQK1mQITmvdiilAdXWsMtHgADOWPgHFcec_1i7vR0EqpVrLH7M4a8Yhtr1hweM8Z8Wt4HY_s9jOdnjVCYeJldZiGgtVf7HAZk'
  },
  {
    id: '4',
    title: 'Concreto e Flor',
    excerpt: 'Na fresta do asfalto quente, uma pequena pétala amarela resiste. Não há força maior que a vida...',
    category: 'Urbano',
    date: '10 SET',
    author: { name: 'Lara Ferreira', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSK3iTCZY2pPhakxaofSax7EiFk5Ukngvi8fPbZVvQbPjWx3w_SbGHV-TQMx1XkV7ErEzA7KSbLC0Usw6KHQ4pMXN9OoGSOqEtRX0Nbmj9gbDytvR6bcm6W5TSwOL6gyxmSKxFplryFAcE5kyDtLb7_bNTcrcyPBn7ZwJmfljZr9LffaGTlasb6r7_iFNxoquqJR6lUzhk0BAGrnWeghtI1e-U4zPbYs5MGFkHhn7wcuU2Y9P3m6Ltk9FKClwye672hwO7LAuinV0' },
    bgClass: 'bg-white dark:bg-[#1a2e16]',
    borderClass: 'border border-[#e9f3e7] dark:border-white/5'
  },
  {
    id: '5',
    title: 'Ecos',
    excerpt: 'Sua voz ainda ecoa nos corredores vazios da casa. Não como um fantasma, mas como uma música suave que se recusa a terminar.',
    category: 'Amor',
    date: '02 SET',
    author: { name: 'Pedro Henrique', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsl0SdT4-MDXhPj13m0fpV-SA0Xl9fgwdzH-VvC1BVyBMbsi6sXfNQV21Tg1g1tv-xEO7p2mu8tjXXHID_GSjMqiquzZCfGHc4iH2LtlPVcASFvS9gOActNe2gHTVwFvCVJ2U6FL2X44MYvZ44fQ-VBrmWFEj1B4npzaoSfeCuF-eGECXclaUB_4ye_J7qfo6mfWOeeS81_j3MfcCXwQHZw_kjjyyxuK4ARgabFyEGs88oF48NiAfiJy7RFpN7T94o15iPS-IA5So' },
    bgClass: 'bg-white dark:bg-[#1a2e16]',
    borderClass: 'border border-[#e9f3e7] dark:border-white/5'
  }
];

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f2fcf0] dark:bg-[#132210] font-display min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-gradient-to-br from-primary-pale/40 to-accent/20 rounded-full blur-[100px] -z-10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-primary-pale/30 to-transparent rounded-full blur-[80px] -z-10"></div>
        
        <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col gap-8 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-primary/20 w-fit backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-ui text-xs font-medium uppercase tracking-wider text-primary">Poema em destaque</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-primary leading-[1.1]">
              <span className="italic block text-text-main">A Dança</span>
              da Chuva
            </h1>
            
            <p className="text-xl md:text-2xl text-text-main/80 font-normal leading-relaxed max-w-lg font-body">
              Uma coleção curada de versos para a mente tranquila. Onde o silêncio encontra a poesia em um refúgio digital.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate('/read')}
                className="group flex items-center justify-center gap-3 bg-primary hover:bg-[#326927] text-white px-8 py-4 rounded-xl text-lg font-ui font-medium transition-all shadow-soft hover:shadow-hover hover:-translate-y-1"
              >
                Ler agora
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button 
                onClick={() => document.getElementById('acervo')?.scrollIntoView({behavior: 'smooth'})}
                className="flex items-center justify-center gap-3 bg-white hover:bg-white/80 text-primary border border-primary/20 px-8 py-4 rounded-xl text-lg font-ui font-medium transition-all hover:border-primary/50"
              >
                Explorar acervo
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-6 relative h-full min-h-[400px] flex items-center justify-center lg:justify-end">
            <div 
              className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 ease-out group cursor-pointer"
              onClick={() => navigate('/read')}
            >
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtUkGzzFtgH2YvCGsYxd18oopcOAR_Jr9XlrG1VZbhg0Iaud-lD0WDqGoZ41-Dd1A5FQBeLTgR5fG9r-FrBlxVc0WRTgpWQ7e4NQdSOTIYlQdr5TvCFajs4ajktAFW0oRJjhNNj2fCor9vOvo6UowkRsdEFDSEk_qSx-MJ0PQZ1gUluKlt55CGkmGc0Zkz1JyGUGD6w0GDj6ZUpw1kH3SRsu7LXMMdhrZkLqrPwrEJCU1DExLYJjKAOcD2c2FNi0oGmHIS7nXWwcw" alt="Ferns" className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101b0d]/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="font-ui text-xs uppercase tracking-widest mb-2 opacity-80">Por Cecília Meireles</p>
                <p className="font-display text-2xl italic">"Basta-me um pequeno gesto, feito de longe e de leve, para que venhas comigo e eu para sempre te leve..."</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
          <span className="font-ui text-xs uppercase tracking-widest text-primary">Role para ler</span>
          <span className="material-symbols-outlined text-primary">keyboard_arrow_down</span>
        </div>
      </header>
      
      {/* Content Grid */}
      <main id="acervo" className="relative z-10 bg-white dark:bg-[#0f1a0b] py-24 rounded-t-[3rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="font-ui text-primary font-medium tracking-wider uppercase text-sm mb-2 block">Acervo</span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-main">Poemas Recentes</h2>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
            </div>
          </div>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 pb-20 space-y-8">
            {poems.map(poem => (
              <article key={poem.id} className="break-inside-avoid group cursor-pointer" onClick={() => navigate('/read')}>
                 {poem.imageUrl ? (
                    <div className="relative h-[420px] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 group-hover:shadow-lg">
                      <img src={poem.imageUrl} alt={poem.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101b0d] via-[#101b0d]/40 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-ui text-xs font-semibold text-white/90 uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">{poem.category}</span>
                          <span className="font-ui text-xs font-medium text-white/60">{poem.date}</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-3 leading-tight font-display">{poem.title}</h3>
                        <p className="text-white/80 line-clamp-2 font-light font-body">{poem.excerpt}</p>
                      </div>
                    </div>
                 ) : (
                    <div className={`relative p-8 md:p-10 rounded-[1.5rem] shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300 ${poem.bgClass} ${poem.borderClass}`}>
                      <div className="flex justify-between items-start mb-6">
                        <span className={`font-ui text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${poem.bgClass === 'bg-[#f2fcf0] dark:bg-[#1a2e16]' ? 'bg-white/60 text-primary-light' : 'bg-[#f2fcf0] text-primary-light'}`}>{poem.category}</span>
                        <span className="font-ui text-xs font-medium text-text-main/40">{poem.date}</span>
                      </div>
                      <h3 className="text-3xl font-bold text-text-main mb-4 group-hover:text-primary transition-colors font-display">{poem.title}</h3>
                      <p className="text-lg text-text-main/70 leading-relaxed font-normal mb-6 font-body">{poem.excerpt}</p>
                      {poem.author && (
                        <div className="flex items-center gap-3 pt-4 border-t border-black/5 dark:border-white/10">
                          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                            <img src={poem.author.avatarUrl} alt={poem.author.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-ui text-sm font-medium text-text-main/60">{poem.author.name}</span>
                        </div>
                      )}
                    </div>
                 )}
              </article>
            ))}

            <article className="break-inside-avoid mb-8 group cursor-pointer" onClick={() => navigate('/editor')}>
                <div className="relative bg-[#3b7c2e] p-8 md:p-10 rounded-[1.5rem] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white flex flex-col items-center justify-center text-center min-h-[300px]">
                    <span className="material-symbols-outlined text-5xl mb-4 text-accent/80">edit_note</span>
                    <h3 className="text-2xl font-bold mb-3 font-display">Envie sua Poesia</h3>
                    <p className="text-white/80 mb-6 font-light font-body">
                        O jardim está sempre aberto a novas sementes. Compartilhe seus versos conosco.
                    </p>
                    <button className="bg-white text-primary px-6 py-2 rounded-full font-ui font-medium text-sm hover:bg-accent transition-colors">
                        Começar a escrever
                    </button>
                </div>
            </article>
          </div>
          
          <div className="flex justify-center pb-20">
            <button className="flex items-center gap-2 text-primary font-ui font-medium hover:text-primary-light transition-colors border-b border-primary/20 pb-1 hover:border-primary">
              Ver todos os poemas
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
            </button>
          </div>
        </div>
      </main>

       {/* Footer */}
        <footer className="bg-[#f6f8f6] dark:bg-[#0f1a0b] py-16 border-t border-primary/10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary/60">water_drop</span>
                <span className="text-xl font-bold italic text-text-main/80 font-display">Chuvisco</span>
            </div>
            <div className="flex gap-8 font-ui text-sm text-text-main/60">
                <a className="hover:text-primary transition-colors" href="#">Termos</a>
                <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
                <a className="hover:text-primary transition-colors" href="#">Contato</a>
            </div>
            <p className="font-ui text-xs text-text-main/40 uppercase tracking-widest">
                © 2023 Chuvisco Sereno.
            </p>
            </div>
        </footer>
    </div>
  );
};

export default Landing;