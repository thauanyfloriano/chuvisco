import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabaseClient';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [poems, setPoems] = useState<any[]>([]);
  const [featuredPoem, setFeaturedPoem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tudo');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const MOCK_HERO_IMAGE = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=2670";
  const MOCK_CARD_IMAGES = [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2560",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=2560",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=2560",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=2560"
  ];

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

  const categories = ['Tudo', ...Array.from(new Set(poems.map(p => p.category)))];

  const filteredPoems = poems.filter(poem => {
    const matchesSearch = poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poem.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tudo' || poem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#f2fcf0] dark:bg-[#132210] font-display min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative flex flex-col lg:flex-row min-h-[90vh] w-full overflow-hidden bg-white dark:bg-[#132210]"
        style={featuredPoem?.image_url ? {
          '--mobile-bg': `url(${featuredPoem.image_url})`
        } as React.CSSProperties : {}}
      >
        {/* Mobile Background Overlay */}
        <div className="absolute inset-0 lg:hidden z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50 scale-105"
            style={{ backgroundImage: `url(${featuredPoem?.image_url || MOCK_HERO_IMAGE})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/40 to-[#f2fcf0]"></div>
        </div>
        {/* Asymmetric Layout: Left Vertical Anchor */}
        <div className="hidden lg:flex w-24 border-r border-primary/10 items-center justify-center py-12">
          <h1 className="vertical-text text-5xl font-black uppercase tracking-[0.2em] text-primary/10 dark:text-primary-pale/10 rotate-180">
            Chuvisco
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 relative ">
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center px-8 lg:px-20 pt-32 pb-20 lg:pt-28 lg:pb-28 z-10">
            <div className="max-w-xl animate-fade-in">
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-6 block">
                {loading ? 'Buscando...' : featuredPoem ? 'Poesia em Destaque' : 'Chuvisco Sereno'}
              </span>
              <h2 className="text-5xl lg:text-6xl font-display font-bold leading-tight mb-8 text-primary italic break-words">
                {loading ? '...' : featuredPoem?.title || 'Cative sua alma com versos'}
              </h2>
              <div className="drop-cap text-lg lg:text-xl leading-relaxed italic text-text-main/70 dark:text-primary-pale/70 mb-12 font-body break-words whitespace-pre-wrap">
                {loading ? '...' : featuredPoem?.excerpt || 'Pequenos gotejos de sentimentos transformados em palavras. Explore um jardim onde cada verso é uma semente e cada estrofe um florescer.'}
              </div>

              {featuredPoem?.author && (
                <div className="flex items-center gap-3 mb-10 p-4 bg-primary-pale/20 rounded-2xl w-fit border border-primary/5">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20 shadow-sm flex items-center justify-center bg-white">
                    {featuredPoem.author.avatar_url || featuredPoem.author.role === 'Administradora' ? (
                      <img src={featuredPoem.author.avatar_url || "/nai.jpg"} alt={featuredPoem.author.name} className="w-full h-full object-cover" />
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
                {featuredPoem && (
                  <button
                    onClick={() => navigate(`/read/${featuredPoem.id}`)}
                    className="bg-primary text-white px-10 py-5 rounded-xl font-ui font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-hover hover:-translate-y-1 transition-all group"
                  >
                    <span>Ler Agora</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                )}
                <button
                  onClick={() => document.getElementById('acervo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border border-primary/20 text-primary px-10 py-5 rounded-xl font-ui font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/5 transition-colors"
                >
                  <span className="material-symbols-outlined">auto_stories</span>
                  <span>Explorar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Visual Column */}
          <div className="hidden lg:block lg:col-span-5 relative min-h-full overflow-hidden">
            {/* Abstract Botanical Background Element */}
            <div className="absolute inset-0 bg-primary-pale/20 dark:bg-background-dark/40 transform skew-x-[-6deg] translate-x-12 z-0"></div>

            {/* Featured Image display */}
            <div className="absolute inset-0 z-10 overflow-hidden transform skew-x-[-6deg] translate-x-16 border-l-8 border-white dark:border-[#132210] shadow-2xl">
              <img
                src={featuredPoem?.image_url || MOCK_HERO_IMAGE}
                alt={featuredPoem?.title}
                className="w-full h-full object-cover transform skew-x-[6deg] -translate-x-16 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent"></div>
            </div>

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
      <main id="acervo" className="relative z-10 bg-gradient-to-r from-white to-primary-pale/20 dark:from-[#0f1a0b] dark:to-[#0a1407] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.05)] ">
        <div className="py-16 bg-white">

          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="font-ui text-primary font-medium tracking-wider uppercase text-sm mb-2 block">Acervo</span>
                <h2 className="text-4xl md:text-5xl font-bold text-text-main">Poemas Recentes</h2>
              </div>
              <div className="flex gap-2 relative">
                <button
                  onClick={() => { setShowFilters(!showFilters); setShowSearch(false); }}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${showFilters ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:border-primary hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                </button>
                <button
                  onClick={() => { setShowSearch(!showSearch); setShowFilters(false); }}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${showSearch ? 'bg-primary text-white border-primary' : 'border-gray-200 hover:border-primary hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </button>
              </div>
            </div>

            {/* Search Bar - Expandable */}
            <div className={`overflow-hidden transition-all duration-300 ${showSearch ? 'max-h-20 mb-8 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <div className="relative group max-w-2xl mx-auto">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors">search</span>
                <input
                  type="text"
                  placeholder="Pesquisar por título ou trecho..."
                  className="w-full bg-primary/5 border border-primary/10 rounded-2xl py-5 pl-14 pr-6 font-body text-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filters - Expandable */}
            <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-20 mb-12 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-full font-ui text-xs font-bold uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-md scale-105' : 'bg-primary/5 text-primary hover:bg-primary/10'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 pb-20">
              {loading ? (
                <div className="text-center w-full py-20 column-span-all">
                  <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted font-ui text-xs uppercase tracking-widest">Buscando versos...</p>
                </div>
              ) : filteredPoems.length === 0 ? (
                <div className="text-center w-full py-20 bg-primary/5 rounded-[3rem] border border-dashed border-primary/20 column-span-all">
                  <span className="material-symbols-outlined text-5xl text-primary/20 mb-4">water_drop</span>
                  <h3 className="text-2xl font-display font-bold text-primary italic mb-2">Nenhum gotejo encontrado</h3>
                  <p className="text-muted font-body">Tente termos diferentes ou outros filtros.</p>
                  <button onClick={() => { setSearchTerm(''); setSelectedCategory('Tudo'); }} className="mt-6 text-primary font-ui font-bold uppercase tracking-widest text-xs hover:underline">Limpar busca</button>
                </div>
              ) : filteredPoems.map((poem, idx) => {
                // Pinterest Style: Variação maior de proporções
                const aspects = [
                  'aspect-[3/4]',
                  'aspect-[4/5]',
                  'aspect-[2/3]',
                  'aspect-[3/5]',
                  'aspect-square'
                ];
                const aspectClass = aspects[idx % aspects.length];

                return (
                  <article key={poem.id} className="break-inside-avoid group cursor-pointer mb-6" onClick={() => navigate(`/read/${poem.id}`)}>
                    <div className={`relative ${aspectClass} rounded-[2rem] overflow-hidden shadow-sm hover:shadow-hover hover:-translate-y-2 transition-all duration-700 group-hover:z-10`}>
                      <img
                        src={poem.imageUrl || MOCK_CARD_IMAGES[idx % MOCK_CARD_IMAGES.length]}
                        alt={poem.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101b0d] via-[#101b0d]/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

                      <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="mb-3">
                          <span className="font-ui text-[9px] font-bold text-white uppercase tracking-widest bg-primary/60 backdrop-blur-md px-3 py-1 rounded-full">{poem.category}</span>
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold mb-2 leading-tight font-display break-words italic text-white">{poem.title}</h3>
                        <p className="text-white/70 text-xs line-clamp-3 font-light font-body mb-4 break-words group-hover:text-white/90 transition-colors whitespace-pre-wrap">{poem.excerpt}</p>

                        {poem.author && (
                          <div className="flex items-center gap-3 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30">
                              {poem.author.avatarUrl || poem.author.role === 'Administradora' ? (
                                <img src={poem.author.avatarUrl || "/nai.jpg"} alt={poem.author.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-white text-[12px]">water_drop</span>
                              )}
                            </div>
                            <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-white/80">{poem.author.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

              <article className="break-inside-avoid mb-6 group cursor-pointer" onClick={() => navigate('/submit')}>
                <div className="relative bg-primary min-h-[320px] p-10 rounded-[2rem] shadow-lg hover:shadow-hover hover:-translate-y-2 transition-all duration-500 text-white flex flex-col items-center justify-center text-center overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 rotate-12">
                    <span className="material-symbols-outlined text-9xl">edit_note</span>
                  </div>
                  <span className="material-symbols-outlined text-5xl mb-6 text-accent animate-bounce">edit_note</span>
                  <h3 className="text-2xl font-bold mb-4 font-display italic">Semeie seus Versos</h3>
                  <p className="text-white/70 mb-8 font-light font-body text-sm leading-relaxed">
                    O acervo floresce com a sua participação. Compartilhe sua alma conosco.
                  </p>
                  <button className="bg-white text-primary px-8 py-3 rounded-full font-ui font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-all hover:scale-105 active:scale-95 shadow-md">
                    Cultivar Agora
                  </button>
                </div>
              </article>
            </div>
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

          <p className="font-ui text-xs text-text-main/40 uppercase tracking-widest">
            © {new Date().getFullYear()} Chuvisco Sereno.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;