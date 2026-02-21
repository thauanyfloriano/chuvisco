import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../src/lib/supabaseClient';

const About: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
            setProfile(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f2fcf0] font-display min-h-screen">
            <Navbar />

            <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-12 text-center mb-8">
                        <span className="font-ui text-primary font-medium tracking-widest uppercase text-sm mb-4 block">A Autora</span>
                        <h1 className="text-5xl md:text-7xl font-bold text-text-main leading-tight italic">Naira Floriano</h1>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3">
                            <img
                                src={profile?.avatar_url || "/nai.jpg"}
                                alt="Naira Floriano"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -top-10 -left-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="space-y-6 text-xl text-text-main/80 font-body leading-relaxed text-justify">
                            {profile?.about ? (
                                profile.about.split('\n').map((para: string, i: number) => (
                                    <p key={i}>{para}</p>
                                ))
                            ) : (
                                <>
                                    <p>
                                        Seja bem-vindo ao Chuvisco, meu pequeno refúgio de palavras. Eu sou Naira Floriano, e este espaço nasceu da minha necessidade de transformar silêncios em versos, e sentimentos em gotejos de poesia.
                                    </p>
                                    <p>
                                        Acredito que a poesia não precisa ser barulhenta para ser sentida. Muitas vezes, ela é como uma chuva fina de final de tarde: suave, constante e capaz de lavar a alma.
                                    </p>
                                    <p>
                                        Aqui, você encontrará pedaços de mim e, espero, pedaços de você também. Sinta-se à vontade para explorar o jardim, caminhar entre os versos e se deixar molhar por cada chuvisco de inspiração.
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="pt-8 border-t border-primary/10 flex flex-col gap-6">
                            <p className="font-ui text-sm uppercase tracking-[0.2em] text-primary font-bold">Conecte-se comigo</p>
                            <div className="flex gap-6">
                                <a href="#" className="flex items-center gap-2 text-text-main/60 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">alternate_email</span>
                                    <span className="font-ui text-sm font-medium">Instagram</span>
                                </a>
                                <a href="#" className="flex items-center gap-2 text-text-main/60 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">textsms</span>
                                    <span className="font-ui text-sm font-medium">Newsletter</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white/50 py-12 border-t border-primary/10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="font-ui text-xs text-text-main/40 uppercase tracking-[0.3em]">Chuvisco Sereno © 2023</p>
                </div>
            </footer>
        </div>
    );
};

export default About;
