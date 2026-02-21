import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../src/lib/supabaseClient';

const ReadingView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [poem, setPoem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPoem(id);
  }, [id]);

  const fetchPoem = async (poemId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('poems')
        .select(`
          *,
          author:profiles(name, role, avatar_url)
        `)
        .eq('id', poemId)
        .single();

      if (error) throw error;
      setPoem(data);
    } catch (error) {
      console.error('Error fetching poem:', error);
      navigate('/'); // Redirect to home on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-text-muted">Carregando...</div>;
  }

  if (!poem) return null;

  return (
    <div className="bg-[#f9fcf8] text-text-main antialiased min-h-screen flex flex-col items-center relative selection:bg-[#bbfda6]">
      {/* Back Navigation */}
      <div className="absolute top-6 left-4 lg:top-8 lg:left-8 z-50">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl transition-all duration-300 hover:bg-[#bbfda6]/50"
        >
          <span className="material-symbols-outlined text-muted group-hover:text-primary transition-colors text-[18px] lg:text-[20px]">arrow_back</span>
          <span className="font-ui text-muted font-medium text-[10px] lg:text-sm tracking-widest uppercase group-hover:text-primary transition-colors">Voltar ao jardim</span>
        </button>
      </div>

      <main className="w-full max-w-[720px] px-6 pb-32 pt-24 lg:pt-[160px] flex flex-col items-center animate-fade-in">
        <header className="flex flex-col items-center w-full mb-12 text-center">
          <div className="mb-6">
            <span className="font-ui text-muted text-xs font-bold tracking-[0.15em] uppercase">
              {new Date(poem.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="font-display text-primary text-5xl md:text-[56px] font-bold leading-tight mb-8 break-all">
            {poem.title}
          </h1>
          <div className="text-[#7bbc6a] opacity-80">
            <span className="material-symbols-outlined text-3xl">spa</span>
          </div>
        </header>

        <article className="w-full font-body text-text-main text-[21px] leading-[1.8] tracking-wide break-all">
          <div dangerouslySetInnerHTML={{ __html: poem.content }} />
        </article>

        <footer className="mt-24 w-full flex flex-col items-center border-t border-[#7bbc6a]/30 pt-12">
          {poem.author && (
            <>
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border border-[#7bbc6a] shadow-sm flex items-center justify-center bg-primary/5">
                {poem.author.avatar_url || poem.author.role === 'Administradora' ? (
                  <img src={poem.author.avatar_url || "/src/assets/nai.jpg"} alt={poem.author.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-primary text-4xl">water_drop</span>
                )}
              </div>
              <p className="font-ui text-sm text-muted tracking-widest uppercase mb-2">Escrito por</p>
              <h3 className="font-display text-2xl text-primary italic">{poem.author.name}</h3>
            </>
          )}

          <div className="mt-16 group cursor-pointer" onClick={() => navigate('/')}>
            <p className="font-ui text-xs text-muted/70 text-center mb-2 uppercase tracking-wide group-hover:text-primary transition-colors">Outras Leituras</p>
            <div className="text-center font-display text-xl text-text-main group-hover:text-primary transition-colors border-b border-transparent group-hover:border-primary/30 pb-1">
              Voltar para o Acervo →
            </div>
          </div>
        </footer>
      </main>

      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#bbfda6]/20 via-transparent to-transparent"></div>
    </div>
  );
};

export default ReadingView;