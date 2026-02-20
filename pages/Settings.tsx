import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { supabase } from '../src/lib/supabaseClient';
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";

const Settings: React.FC = () => {
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('name', 'Naira Floriano')
                .single();

            if (error) throw error;

            if (data) {
                setName(data.name);
                setAbout(data.about || '');
                setAvatarUrl(data.avatar_url || '');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    name,
                    about,
                    avatar_url: avatarUrl,
                    updated_at: new Date()
                })
                .eq('name', 'Naira Floriano');

            if (error) throw error;
            toast({
                title: "Perfil atualizado",
                description: "Suas informações foram salvas com sucesso.",
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                variant: "destructive",
                title: "Erro ao salvar",
                description: "Não foi possível atualizar seu perfil.",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#f0fdf4] font-body text-text-main">
            <Sidebar />

            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                <header className="pt-12 px-12 pb-6 flex items-end justify-between z-10">
                    <div>
                        <p className="font-ui text-secondary text-sm font-medium tracking-wider uppercase mb-2">Configurações</p>
                        <h2 className="font-display font-bold text-4xl text-primary">Sobre Mim</h2>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-12 pb-24 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-10 text-muted">Carregando perfil...</div>
                    ) : (
                        <div className="max-w-2xl bg-white p-10 rounded-[2.5rem] shadow-soft border border-tertiary/10">
                            <div className="space-y-8">
                                <div className="flex items-center gap-8 mb-4">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/5 border-2 border-primary/20 shadow-inner flex items-center justify-center">
                                            {avatarUrl ? (
                                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-primary text-4xl">person</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => document.getElementById('avatar-upload')?.click()}
                                            disabled={uploading}
                                            className="absolute bottom-0 right-0 bg-primary h-8 w-8 rounded-full text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-sm">{uploading ? 'sync' : 'photo_camera'}</span>
                                        </button>
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                try {
                                                    setUploading(true);
                                                    const fileExt = file.name.split('.').pop();
                                                    const fileName = `avatars/avatar-${Math.random()}.${fileExt}`;
                                                    const { error: uploadError } = await supabase.storage
                                                        .from('avatars')
                                                        .upload(fileName, file);
                                                    if (uploadError) throw uploadError;
                                                    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
                                                    setAvatarUrl(publicUrl);
                                                } catch (err) {
                                                    console.error(err);
                                                    toast({ variant: "destructive", title: "Erro no upload", description: "Verifique o bucket 'avatars'." });
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl font-bold text-text-main">Foto de Perfil</h3>
                                        <p className="text-sm text-muted font-body">Esta foto aparecerá nas suas publicações.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="group relative">
                                        <label className="mb-2 block font-ui text-[10px] font-bold uppercase tracking-widest text-muted transition-colors group-focus-within:text-primary">Nome de Exibição</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50/50 rounded-2xl px-6 py-4 text-lg border-none focus:ring-1 focus:ring-primary/20 transition-all"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="group relative">
                                        <label className="mb-2 block font-ui text-[10px] font-bold uppercase tracking-widest text-muted transition-colors group-focus-within:text-primary">Minha História</label>
                                        <textarea
                                            className="w-full bg-gray-50/50 rounded-2xl px-6 py-5 text-lg border-none focus:ring-1 focus:ring-primary/20 transition-all min-h-[160px] resize-none leading-relaxed"
                                            placeholder="Conte um pouco sobre quem você é..."
                                            value={about}
                                            onChange={(e) => setAbout(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="w-full rounded-2xl py-8 h-auto font-ui font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
                                    >
                                        {saving ? 'Guardando...' : 'Salvar Alterações'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Settings;
