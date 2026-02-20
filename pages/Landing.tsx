import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabaseClient';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [poems, setPoems] = useState<any[]>([]);
  const [featuredPoem, setFeaturedPoem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPoems();
  }, []);

  const fetchPoems = async () => {
    try {
      setLoading(true);
      // Fetch featured poem
      const { data: featuredData } = await supabase
        .from('poems')
        .select(`*, author:profiles(name, role, avatar_url)`)
        .eq('featured', true)
        .eq('status', 'published')
        .limit(1)
        .single();

      setFeaturedPoem(featuredData);

      // Fetch recent poems
      const { data: recentData, error } = await supabase
        .from('poems')
        .select(`
          *,
          author:profiles(name, role, avatar_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (recentData) {
        const mappedPoems = recentData.map((item: any, index: number) => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          category: item.category || 'Geral',
          date: new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase(),
          author: {
            name: item.author?.name || 'Autor',
            avatarUrl: item.author?.avatar_url || '',
            role: item.author?.role || 'Visitante'
          },
          imageUrl: item.image_url,
          bgClass: index % 2 === 0 ? 'bg-white dark:bg-[#1a2e16]' : 'bg-[#f2fcf0] dark:bg-[#1a2e16]',
          borderClass: index % 2 === 0 ? 'border border-[#e9f3e7] dark:border-white/5' : 'border border-transparent dark:border-white/5'
        }));
        setPoems(mappedPoems);
      }
    } catch (error) {
      console.error('Error fetching poems:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f2fcf0] dark:bg-[#132210] font-display min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row min-h-[90vh] w-full overflow-hidden bg-white dark:bg-[#132210]">
        {/* Asymmetric Layout: Left Vertical Anchor */}
        <div className="hidden lg:flex w-24 border-r border-primary/10 items-center justify-center py-12">
          <h1 className="vertical-text text-5xl font-black uppercase tracking-[0.2em] text-primary/10 dark:text-primary-pale/10 rotate-180">
            Chuvisco Sereno
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center px-8 lg:px-20 py-20 lg:py-0 z-10">
            <div className="max-w-xl animate-fade-in">
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-6 block">
                {featuredPoem ? 'Poesia em Destaque' : 'The Featured Poem'}
              </span>
              <h2 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-8 text-primary italic">
                {featuredPoem?.title || 'Whispers of the Emerald Mist'}
              </h2>
              <div className="drop-cap text-lg lg:text-2xl leading-relaxed italic text-text-main/70 dark:text-primary-pale/70 mb-12 font-body">
                {featuredPoem?.excerpt || 'In the quiet hush of falling rain, where emerald leaves embrace the mist, a sanctuary waits for those who seek the whispers of the earth. Here, time is measured in droplets, and every silver streak against the moss tells a story of rebirth.'}
              </div>

              {featuredPoem?.author && (
                <div className="flex items-center gap-3 mb-10 p-4 bg-primary-pale/20 rounded-2xl w-fit border border-primary/5">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 shadow-sm flex items-center justify-center bg-white">
                    {featuredPoem.author.avatar_url || featuredPoem.author.role === 'Administradora' ? (
                      <img src={featuredPoem.author.avatar_url || "/src/assets/nai.jpg"} alt={featuredPoem.author.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-primary text-2xl">water_drop</span>
                    )}
                  </div>
                  <div>
                    <p className="font-ui text-[10px] uppercase tracking-widest text-primary/60 font-bold">Cultivado por</p>
                    <p className="font-display text-lg text-primary font-medium italic">{featuredPoem.author.name}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => featuredPoem && navigate(`/read/${featuredPoem.id}`)}
                  className="bg-primary text-white px-10 py-5 rounded-xl font-ui font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-hover hover:-translate-y-1 transition-all group"
                >
                  <span>Ler Agora</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button
                  onClick={() => document.getElementById('acervo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-primary/20 text-primary px-10 py-5 rounded-xl font-ui font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/5 transition-colors"
                >
                  <span className="material-symbols-outlined">auto_stories</span>
                  <span>Explorar Acervo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5 relative min-h-[500px] lg:min-h-full overflow-hidden">
            {/* Abstract Botanical Background Element */}
            <div className="absolute inset-0 bg-primary-pale/20 dark:bg-background-dark/40 transform skew-x-[-6deg] translate-x-12 z-0"></div>

            {featuredPoem?.image_url ? (
              <div className="absolute inset-0 z-10 overflow-hidden transform skew-x-[-6deg] translate-x-16 border-l-8 border-white dark:border-[#132210] shadow-2xl">
                <img
                  src={featuredPoem.image_url}
                  alt={featuredPoem.title}
                  className="w-full h-full object-cover transform skew-x-[6deg] -translate-x-16 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent"></div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12 z-10">
                <div className="relative w-full h-full max-w-md lg:max-w-none">
                  {/* Editorial Image Card 1 */}
                  <div className="absolute top-0 right-0 w-2/3 aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl z-20 transform translate-y-4 border-2 border-white/20">
                    <img alt="Rain on leaves" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzWb0DUPIFaRpTUM7uUey7MgRM00EpIYPMrVLSpd3Uz6MnNIDPCB79Ts4p-9wn8rCU37h4OkcCS67gUduYn9YS4r4L2tbTd-1eDG-AHh_IOmNo6EbG_5jp5g9JI5OB8f_mEcwlKkFay-meDB9r-5aCePW22xaqlhjBWCpwTBEOn3oCC4ikJ7cNepwl2pcxVXO6cDSPUeXDL1npMhUHypM4j9bttxHqLUxqUVsAfAvWJTPx6Mz52oEv9dlYwAlzDPQ_6usiiQNBdrg" />
                  </div>
                  {/* Editorial Image Card 2 */}
                  <div className="absolute bottom-12 left-0 w-1/2 aspect-square rounded-2xl overflow-hidden shadow-xl z-30 border-4 border-white dark:border-background-dark">
                    <img alt="Misty garden" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrIsPHVzCOlFRcF-_gu_SjhAMWTi5AMnwvH6egpotdxvwOOyUbaT0jlkt9YToYEC5Q8xemLCfNRK80qA1zCEbTWsIG9sQmxf2bqX-Zo_SFjiNVVnptgP6RnyYfH6AQm6t0zaUbROvL7QKRja_A9qgWUjo12cLJdavQ4yUfV3uoe7Wjqf7tmmlhxoRkNPB0VwS2EXhvwYGIlj8myd9ihzdTjsoJ3_wu-V5l9CMb9g5_iH6hyFoV0rxMV2TFCLuTai_HobyplXc45Q" />
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute top-1/4 -left-8 size-24 bg-primary/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-1/4 right-0 size-32 bg-primary-pale/20 rounded-full blur-3xl"></div>
                </div>
              </div>
            )}

            {/* Floating Botanical Symbols (Decorative) */}
            <div className="absolute top-10 right-10 text-primary/40 z-20">
              <span className="material-symbols-outlined text-6xl">eco</span>
            </div>
            <div className="absolute bottom-10 right-20 text-primary-pale/30 z-20">
              <span className="material-symbols-outlined text-4xl">water_drop</span>
            </div>
          </div>
        </div>
      </section>

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
            {loading ? (
              <div className="text-center w-full col-span-full py-10 text-muted">Carregando poemas...</div>
            ) : poems.map(poem => (
              <article key={poem.id} className="break-inside-avoid group cursor-pointer" onClick={() => navigate(`/read/${poem.id}`)}>
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
                      <p className="text-white/80 line-clamp-2 font-light font-body mb-6">{poem.excerpt}</p>

                      {poem.author && (
                        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30 backdrop-blur-sm">
                            {poem.author.avatarUrl || poem.author.role === 'Administradora' ? (
                              <img src={poem.author.avatarUrl || "/src/assets/nai.jpg"} alt={poem.author.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-white text-lg">water_drop</span>
                            )}
                          </div>
                          <span className="font-ui text-sm font-medium text-white/80">{poem.author.name}</span>
                        </div>
                      )}
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
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                          {poem.author.avatarUrl || poem.author.role === 'Administradora' ? (
                            <img src={poem.author.avatarUrl || "/src/assets/nai.jpg"} alt={poem.author.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-primary text-lg">water_drop</span>
                          )}
                        </div>
                        <span className="font-ui text-sm font-medium text-text-main/60">{poem.author.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}

            <article className="break-inside-avoid mb-8 group cursor-pointer" onClick={() => navigate('/submit')}>
              <div className="relative bg-[#3b7c2e] p-8 md:p-10 rounded-[1.5rem] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white flex flex-col items-center justify-center text-center min-h-[300px]">
                <span className="material-symbols-outlined text-5xl mb-4 text-accent/80">edit_note</span>
                <h3 className="text-2xl font-bold mb-3 font-display">Envie sua Poesia</h3>
                <p className="text-white/80 mb-6 font-light font-body">
                  O jardim está sempre aberto a novas sementes. Compartilhe seus versos conosco.
                </p>
                <button className="bg-white text-primary px-6 py-2 rounded-full font-ui font-medium text-sm hover:bg-accent transition-colors">
                  Enviar Poesia
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