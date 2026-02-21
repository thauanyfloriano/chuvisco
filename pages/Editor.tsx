import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../src/lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from "../hooks/use-toast";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Upload,
  X,
  Tag,
  AlignLeft,
  Trash2,
  Clock,
  Star,
  Settings as SettingsIcon,
} from 'lucide-react';

// BlockNote — imports exatamente como a documentação recomenda
import { useCreateBlockNote, SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { pt } from "@blocknote/core/locales";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);

  // Criar editor com locale Português
  const editor = useCreateBlockNote({
    dictionary: pt,
  });

  useEffect(() => {
    if (id) {
      fetchPoem(id);
    }
  }, [id]);

  const fetchPoem = async (poemId: string) => {
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .eq('id', poemId)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setTitle(data.title);
      setFeatured(data.featured || false);
      setImageUrl(data.image_url || '');
      setDescription(data.description || '');
      setCategory(data.category || '');
      setAuthorId(data.author_id);

      if (data.content) {
        try {
          // Tentar carregar como JSON (formato nativo BlockNote — preserva linhas em branco)
          const blocks = JSON.parse(data.content);
          editor.replaceBlocks(editor.topLevelBlocks, blocks);
        } catch {
          // Fallback: conteúdo antigo em Markdown
          const blocks = await editor.tryParseMarkdownToBlocks(data.content);
          editor.replaceBlocks(editor.topLevelBlocks, blocks);
        }
      }
    }
  };

  const handleSave = async (status: 'published' | 'draft') => {
    if (!title) {
      toast({
        variant: "destructive",
        title: "Título obrigatório",
        description: "Dê um nome à sua obra antes de salvar.",
      });
      return;
    }
    setSaving(true);

    try {
      // Salvar blocos como JSON — preserva TUDO, incluindo linhas em branco
      const blocks = editor.topLevelBlocks;
      const contentJson = JSON.stringify(blocks);

      // Gerar excerpt em texto limpo para listagens
      const markdown = await editor.blocksToMarkdownLossy(blocks);
      const excerpt = markdown.replace(/[#*`_>\[\]]/g, '').trim().substring(0, 150) + '...';

      let finalAuthorId = authorId;
      if (!finalAuthorId) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('name', 'Naira Floriano')
          .limit(1);

        if (profiles && profiles.length > 0) {
          finalAuthorId = profiles[0].id;
        } else {
          const { data: newProfile } = await supabase
            .from('profiles')
            .insert([{ name: 'Naira Floriano', role: 'Administradora', avatar_url: '' }])
            .select()
            .single();
          if (newProfile) finalAuthorId = newProfile.id;
        }
      }

      const poemData = {
        title,
        content: contentJson,   // Blocos JSON nativos do BlockNote
        excerpt,
        description,
        category,
        status,
        featured,
        image_url: imageUrl,
        author_id: finalAuthorId,
      };

      if (id) {
        const { error } = await supabase.from('poems').update(poemData).eq('id', id);
        if (error) throw error;
        toast({
          title: status === 'published' ? "Publicado!" : "Rascunho salvo",
          description: "As alterações foram guardadas.",
        });
      } else {
        const { error } = await supabase.from('poems').insert([poemData]);
        if (error) throw error;
        toast({ title: "Novo poema!", description: "Adicionado ao acervo." });
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error saving poem:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível guardar as alterações.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white selection:bg-primary/20 relative">
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#bbfda6]/20 via-transparent to-transparent"></div>

      {/* Meta Sidebar */}
      <aside className={`fixed inset-y-0 right-0 w-80 bg-[#f9fcf8] border-l border-primary/10 transition-transform duration-500 ease-in-out z-50 shadow-2xl ${showMeta ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-ui text-sm font-bold uppercase tracking-[0.2em] text-primary">Detalhes da Obra</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowMeta(false)} className="rounded-full h-8 w-8 hover:bg-primary/10">
              <X className="w-4 h-4 text-primary" />
            </Button>
          </div>

          <div className="space-y-8">
            {/* Capa */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest text-muted">
                <ImageIcon className="w-3 h-3" /> Capa
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2 ${imageUrl ? 'border-primary/20' : 'border-tertiary/20 hover:border-primary/40 bg-white'}`}
              >
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                ) : imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Capa" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="text-white w-6 h-6" />
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-primary/40 group-hover:text-primary/60" />
                    <span className="text-[10px] font-bold text-muted/60 uppercase tracking-widest">Enviar foto</span>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    setUploading(true);
                    const fileName = `poems/${Date.now()}-${file.name}`;
                    const { error } = await supabase.storage.from('poems-images').upload(fileName, file);
                    if (error) throw error;
                    const { data: { publicUrl } } = supabase.storage.from('poems-images').getPublicUrl(fileName);
                    setImageUrl(publicUrl);
                    toast({ title: "Upload concluído", description: "Imagem salva." });
                  } catch (err) {
                    console.error(err);
                    toast({ variant: "destructive", title: "Erro no upload", description: "Tente novamente." });
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            </div>

            {/* Descrição */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest text-muted">
                <AlignLeft className="w-3 h-3" /> Descrição
              </label>
              <Textarea
                placeholder="Breve resumo..."
                className="bg-white rounded-2xl border-tertiary/10 min-h-[100px] text-sm font-body resize-none focus:ring-primary/20"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Categoria */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest text-muted">
                <Tag className="w-3 h-3" /> Categoria
              </label>
              <Input
                placeholder="Ex: Amor, Natureza..."
                className="bg-white rounded-2xl border-tertiary/10 py-5 text-sm font-ui focus:ring-primary/20"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {/* Destaque */}
            <div
              onClick={() => setFeatured(!featured)}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${featured ? 'bg-accent/10 border-accent/30 text-primary-dark' : 'bg-white border-tertiary/10 text-muted'}`}
            >
              <div className="flex items-center gap-3">
                <Star className={`w-4 h-4 ${featured ? 'fill-accent text-accent' : ''}`} />
                <span className="font-ui text-xs font-bold uppercase tracking-widest">Destaque</span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${featured ? 'bg-accent' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all duration-300 ${featured ? 'left-[18px]' : 'left-0.5'}`}></div>
              </div>
            </div>

            {/* Excluir */}
            {id && (
              <Button
                variant="outline"
                className="w-full rounded-2xl border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 font-ui text-[10px] font-bold uppercase tracking-widest"
                onClick={async () => {
                  if (confirm('Excluir permanentemente?')) {
                    await supabase.from('poems').delete().eq('id', id);
                    navigate('/admin');
                  }
                }}
              >
                <Trash2 className="w-3 h-3 mr-2" /> Excluir Poema
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between bg-white/80 backdrop-blur-md px-4 lg:px-10 py-4 lg:py-6 border-b border-primary/5 z-20">
          <div className="flex items-center gap-2 lg:gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="rounded-full hover:bg-primary/5 h-10 w-10">
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Button>
            <div className="hidden sm:block h-6 w-px bg-primary/10"></div>
            <p className="hidden sm:block font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
              {saving ? 'Salvando...' : id ? 'Refinando' : 'Novo Gotejo'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMeta(true)}
              className="rounded-xl lg:rounded-2xl lg:px-4 lg:py-2 h-10 w-10 lg:w-auto font-ui text-[10px] font-bold uppercase tracking-wider text-muted hover:text-primary"
            >
              <SettingsIcon className="w-4 h-4 lg:mr-2" />
              <span className="hidden lg:inline">Detalhes</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="rounded-xl lg:rounded-2xl lg:px-4 lg:py-2 h-10 w-10 lg:w-auto font-ui text-[10px] font-bold uppercase tracking-widest border-primary/10 text-muted"
            >
              <Clock className="w-4 h-4 lg:mr-2" />
              <span className="hidden lg:inline">Rascunho</span>
            </Button>

            <Button
              disabled={saving}
              onClick={() => handleSave('published')}
              className="rounded-xl lg:rounded-2xl px-4 lg:px-8 h-10 lg:h-auto shadow-soft font-ui text-[10px] font-bold uppercase tracking-widest"
            >
              <Save className="w-4 h-4 lg:mr-2" />
              <span className="hidden lg:inline">{id ? 'Salvar' : 'Publicar'}</span>
            </Button>
          </div>
        </header>

        {/* Editor Area */}
        <main className="flex-grow overflow-y-auto custom-scrollbar">
          <div className="max-w-[800px] mx-auto px-6 lg:px-0 py-12 lg:py-16 space-y-6 lg:space-y-10">
            {/* Título */}
            <input
              className="w-full bg-transparent text-4xl lg:text-7xl font-display font-medium text-text-main placeholder:text-gray-200 border-none outline-none focus:ring-0 p-0 leading-tight italic"
              placeholder="Título da obra..."
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="h-px w-20 bg-primary/20"></div>

            {/* Editor BlockNote em Português — sem opções de mídia no menu / */}
            <div className="w-full min-h-[60vh] pb-16">
              <BlockNoteView
                editor={editor}
                theme="light"
                slashMenu={false}
              >
                <SuggestionMenuController
                  triggerCharacter="/"
                  getItems={async (query) => {
                    // Filtrar grupos de mídia, avançado e outros
                    const filtered = getDefaultReactSlashMenuItems(editor).filter(
                      (item) =>
                        item.group !== "Mídia" &&
                        item.group !== "Outros" &&
                        item.group !== "Avançado" &&
                        item.group !== "Media" &&
                        item.group !== "Other" &&
                        item.group !== "Advanced"
                    );
                    // Filtrar por query (busca pelo título ou aliases)
                    if (!query) return filtered;
                    const q = query.toLowerCase();
                    return filtered.filter(
                      (item) =>
                        item.title.toLowerCase().includes(q) ||
                        item.aliases?.some((a) => a.toLowerCase().includes(q))
                    );
                  }}
                />
              </BlockNoteView>
            </div>
          </div>
        </main>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/5 backdrop-blur-[2px] z-40 transition-opacity duration-500 ${showMeta ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowMeta(false)}
      ></div>
    </div>
  );
};

export default Editor;