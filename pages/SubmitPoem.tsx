import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../src/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from "../hooks/use-toast";
import {
    Send,
    User,
    BookOpen,
    Sprout,
    Sparkles,
    ArrowRight
} from 'lucide-react';

const SubmitPoem: React.FC = () => {
    const [title, setTitle] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const editorRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!title || !authorName || !editorRef.current?.innerText.trim()) {
            toast({
                variant: "destructive",
                title: "Campos incompletos",
                description: "Preencha tudo para enviar sua poesia.",
            });
            return;
        }

        setStatus('submitting');
        try {
            let author_id = null;
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('name', authorName)
                .limit(1);

            if (profile && profile.length > 0) {
                author_id = profile[0].id;
            } else {
                const { data: newProfile } = await supabase
                    .from('profiles')
                    .insert([{ name: authorName, role: 'Visitante' }])
                    .select()
                    .single();
                if (newProfile) author_id = newProfile.id;
            }

            const content = editorRef.current.innerHTML;
            const excerpt = editorRef.current.innerText.substring(0, 150) + '...';

            const { error } = await supabase
                .from('poems')
                .insert([{
                    title,
                    content,
                    excerpt,
                    author_id,
                    status: 'draft',
                    category: 'Visitante'
                }]);

            if (error) throw error;

            setStatus('success');
            toast({
                title: "Poesia recebida!",
                description: "Enviado para avaliação. Obrigado!",
            });

            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            console.error('Error submitting poem:', error);
            setStatus('idle');
            toast({
                variant: "destructive",
                title: "Erro no envio",
                description: "Tente novamente mais tarde.",
            });
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Sparkles className="text-primary w-10 h-10 animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-display text-4xl font-bold text-primary italic">Sua voz ecoou...</h2>
                        <p className="font-body text-text-main/60 text-lg leading-relaxed">
                            Obrigado por confiar sua poesia ao nosso jardim.
                        </p>
                    </div>
                    <Button onClick={() => navigate('/')} variant="outline" className="rounded-full px-8 py-6 h-auto font-ui font-bold uppercase tracking-widest">
                        Voltar ao Início
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfdfc] font-body text-text-main flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
                <div className="w-full max-w-[800px] space-y-12">
                    <header className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <Sprout className="text-primary w-6 h-6" />
                            <span className="font-ui text-xs font-bold uppercase tracking-[0.3em] text-secondary">Cultive uma ideia</span>
                        </div>
                        <h1 className="font-display text-5xl md:text-7xl font-bold text-primary italic leading-tight">Envie sua Poesia</h1>
                    </header>

                    <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-soft border border-primary/5 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest text-muted">
                                    <BookOpen className="w-3 h-3" /> Título
                                </label>
                                <Input
                                    placeholder="Nome do sentir..."
                                    className="bg-gray-50/50 border-none rounded-2xl py-8 text-2xl font-display font-medium focus:ring-primary/10"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest text-muted">
                                    <User className="w-3 h-3" /> Assinatura
                                </label>
                                <Input
                                    placeholder="Seu nome..."
                                    className="bg-gray-50/50 border-none rounded-2xl py-8 text-xl font-body focus:ring-primary/10"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 font-ui text-[10px] font-bold uppercase tracking-widest text-muted">
                                <Send className="w-3 h-3" /> Seus Versos
                            </label>
                            <div
                                ref={editorRef}
                                className="w-full min-h-[300px] text-2xl leading-relaxed text-text-main/80 outline-none font-body prose prose-lg max-w-none empty:before:content-[attr(placeholder)] empty:before:text-gray-200"
                                contentEditable
                                suppressContentEditableWarning
                                placeholder="Deixe as palavras fluírem..."
                            ></div>
                        </div>

                        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-2 text-text-main/40 text-sm italic font-body">
                                <Sparkles className="w-4 h-4" />
                                Sua obra passará por revisão
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={status === 'submitting'}
                                className="w-full md:w-auto rounded-2xl px-10 py-8 h-auto font-ui font-bold uppercase tracking-[0.2em]"
                            >
                                {status === 'submitting' ? 'Semeando...' : (
                                    <>
                                        Enviar Poesia <ArrowRight className="ml-3 w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SubmitPoem;
