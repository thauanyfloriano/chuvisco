import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { supabase } from '../src/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Search,
  Plus,
  MoreHorizontal,
  Star,
  Edit2,
  Trash2,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';


const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const { data: poems, isLoading } = useQuery({
    queryKey: ['poems', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('poems')
        .select(`
          *,
          author:profiles (name, role, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('poems').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poems'] });

    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const willBeFeatured = !featured;

      // Se estiver ativando o destaque, remove de todos os outros primeiro
      if (willBeFeatured) {
        await supabase
          .from('poems')
          .update({ featured: false })
          .eq('featured', true);
      }

      const { error } = await supabase
        .from('poems')
        .update({ featured: willBeFeatured })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poems'] });

    },
  });

  const filteredPoems = poems?.filter((poem) =>
    poem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (poem: any) => {
    const isOwner = poem.profiles?.name === 'Naira Floriano' || poem.profiles?.role === 'Administradora';

    if (poem.status === 'published') {
      return <Badge className="bg-primary/10 text-primary border-primary/20">Publicado</Badge>;
    }

    if (isOwner) {
      return <Badge variant="outline" className="border-tertiary/20 text-muted">Rascunho</Badge>;
    }

    return <Badge className="bg-orange-50 text-orange-600 border-orange-100">Para Avaliar</Badge>;
  };

  return (
    <div className="flex lg:h-screen overflow-hidden bg-[#f8faf7] font-body text-text-main">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="pt-24 lg:pt-12 px-6 lg:px-12 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between z-10 gap-6">
          <div>
            <p className="font-ui text-secondary text-sm font-medium tracking-[0.2em] uppercase mb-2">Escrivaninha</p>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-primary italic">Seu Acervo</h2>
          </div>
          <Button
            onClick={() => navigate('/editor')}
            className="w-full md:w-auto rounded-2xl px-8 py-5 h-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm font-bold uppercase tracking-widest"
          >
            <Plus className="w-5 h-5 " /> Novo Gotejo
          </Button>
        </header>

        <div className="px-6 lg:px-12 mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Pesquisar por título..."
              className="pl-14 pr-6 py-7 rounded-2xl bg-white border-none shadow-soft group-focus-within:shadow-hover transition-all text-lg font-body w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-soft border border-primary/5 no-scrollbar whitespace-nowrap">
            {(['all', 'published', 'draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 lg:px-6 py-2.5 rounded-xl text-[9px] lg:text-xs font-bold uppercase tracking-widest transition-all flex-1 ${statusFilter === status
                  ? 'bg-primary text-white shadow-md'
                  : 'text-muted hover:text-primary hover:bg-primary/5'
                  }`}
              >
                {status === 'all' ? 'Tudo' : status === 'published' ? 'Publicados' : 'Rascunhos'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 lg:px-12 pb-20 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin"></div>
              <p className="font-ui text-sm text-muted animate-pulse">Buscando versos...</p>
            </div>
          ) : filteredPoems && filteredPoems.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredPoems.map((poem) => (
                <div
                  key={poem.id}
                  className="group bg-white rounded-[2rem] lg:rounded-[2.5rem] p-5 lg:p-8 shadow-soft border border-primary/5 hover:border-primary/20 hover:shadow-hover transition-all duration-500 flex flex-col sm:flex-row gap-5 lg:gap-8 items-start relative overflow-hidden"
                >
                  {/* Image Preview */}
                  <div className="w-full sm:w-32 h-40 sm:h-32 rounded-2xl lg:rounded-3xl overflow-hidden flex-shrink-0 bg-primary/5 border border-primary/10">
                    {poem.image_url ? (
                      <img src={poem.image_url} alt={poem.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/20 italic font-display text-4xl">
                        {poem.title[0]}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                      {getStatusBadge(poem)}
                      {poem.featured && (
                        <Badge className="bg-accent/10 text-accent-dark border-accent/20">
                          <Star className="w-3 h-3 mr-1 fill-accent" /> Destaque
                        </Badge>
                      )}
                    </div>

                    <h3
                      onClick={() => navigate(`/editor/${poem.id}`)}
                      className="font-display text-xl lg:text-2xl font-bold text-primary group-hover:text-primary-dark cursor-pointer transition-colors leading-tight italic line-clamp-2 break-all"
                    >
                      {poem.title}
                    </h3>

                    <p className="text-muted font-body text-xs lg:text-sm line-clamp-2 leading-relaxed opacity-70 break-all">
                      {poem.excerpt || "Sem resumo disponível..."}
                    </p>

                    <div className="pt-2 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden flex items-center justify-center border border-primary/20">
                          {poem.author?.avatar_url || poem.author?.role === 'Administradora' ? (
                            <img
                              src={poem.author?.avatar_url || "/src/assets/nai.jpg"}
                              alt={poem.author?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-primary">{poem.author?.name?.[0]}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 italic truncate">
                          {poem.author?.name || 'Autor Desconhecido'}
                        </span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 lg:h-10 lg:w-10 hover:bg-primary/5 text-muted transition-colors flex-shrink-0">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-primary/10 shadow-xl p-2 min-w-[180px]">
                          <DropdownMenuItem onClick={() => navigate(`/editor/${poem.id}`)} className="rounded-xl px-4 py-3 cursor-pointer group">
                            <Edit2 className="w-4 h-4 mr-3 text-muted group-hover:text-primary" />
                            <span className="font-ui text-sm font-medium">Editar Poema</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleFeaturedMutation.mutate({ id: poem.id, featured: poem.featured })}
                            className="rounded-xl px-4 py-3 cursor-pointer group"
                          >
                            <Star className={`w-4 h-4 mr-3 ${poem.featured ? 'fill-accent text-accent' : 'text-muted group-hover:text-accent'}`} />
                            <span className="font-ui text-sm font-medium">{poem.featured ? 'Remover Destaque' : 'Destacar'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-primary/5 my-1" />
                          <DropdownMenuItem
                            onClick={() => { if (confirm('Excluir permanentemente?')) deleteMutation.mutate(poem.id); }}
                            className="rounded-xl px-4 py-3 cursor-pointer text-red-500 hover:bg-red-50 focus:bg-red-50 group"
                          >
                            <Trash2 className="w-4 h-4 mr-3 text-red-400" />
                            <span className="font-ui text-sm font-semibold">Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-primary/20" />
              </div>
              <div>
                <h4 className="font-display text-2xl font-bold text-primary italic">Nenhum gotejo encontrado</h4>
                <p className="text-muted font-body max-w-xs mx-auto">O acervo está em silêncio. Que tal começar uma nova história?</p>
              </div>
              <Button onClick={() => navigate('/editor')} variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5">
                Iniciar Escrita
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;