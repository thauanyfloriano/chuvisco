import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReadingView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f9fcf8] text-text-main antialiased min-h-screen flex flex-col items-center relative selection:bg-[#bbfda6]">
      {/* Fixed Back Navigation */}
      <div className="fixed top-8 left-8 z-50">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#bbfda6]/50"
        >
          <span className="material-symbols-outlined text-muted group-hover:text-primary transition-colors text-[20px]">arrow_back</span>
          <span className="font-ui text-muted font-medium text-sm tracking-wide uppercase group-hover:text-primary transition-colors">Voltar ao jardim</span>
        </button>
      </div>

      <main className="w-full max-w-[720px] px-6 pb-32 pt-[160px] flex flex-col items-center animate-fade-in">
        <header className="flex flex-col items-center w-full mb-12 text-center">
          <div className="mb-6">
            <span className="font-ui text-muted text-xs font-bold tracking-[0.15em] uppercase">12 de Outubro, 2023</span>
          </div>
          <h1 className="font-display text-primary text-5xl md:text-[56px] font-bold leading-tight mb-8">
            A Dança da Chuva
          </h1>
          <div className="text-[#7bbc6a] opacity-80">
            <span className="material-symbols-outlined text-3xl">spa</span>
          </div>
        </header>

        <article className="w-full font-body text-text-main text-[21px] leading-[1.8] tracking-wide">
          <p className="drop-cap mb-8">
            O primeiro pingo caiu como uma promessa antiga, selada no envelope cinza das nuvens. Não houve trovão para anunciar sua chegada, apenas o suspiro úmido da terra que aguardava, paciente, pelo beijo frio que despertaria as raízes adormecidas sob o solo seco de agosto.
          </p>
          <p className="mb-8">
            A janela emoldura o espetáculo silencioso. Gotas deslizam pelo vidro como memórias que tentamos segurar, mas que escorrem inevitavelmente para o esquecimento. O jardim lá fora, antes estático e poeirento, agora respira. As samambaias desenrolam suas espirais tímidas, bebendo a neblina que se forma rente ao chão.
          </p>
          <p className="mb-8">
            Há uma música secreta no ritmo da água contra as folhas de antúrio. Um tamborilar suave, quase imperceptível, que dita o compasso da tarde. O tempo, esse tirano dos relógios, parece suspender sua marcha forçada. Aqui dentro, o silêncio não é vazio; é cheio de ecos de uma natureza que se renova sem pedir licença.
          </p>
          <p className="mb-8">
            Fecho o livro sobre o colo. As palavras impressas parecem menores diante da poesia líquida que cai do céu. É preciso saber ler a chuva também, decifrar seus versos de água doce que lavam não apenas o telhado, mas a poeira que acumulamos na alma durante os dias de sol impiedoso.
          </p>
          <p>
            E assim ficamos: eu e a chuva, em um diálogo sem palavras, onde o único dever é existir e deixar que a água leve o que já não serve mais, nutrindo o que ainda está por florescer.
          </p>
        </article>

        <footer className="mt-24 w-full flex flex-col items-center border-t border-[#7bbc6a]/30 pt-12">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border border-[#7bbc6a] shadow-sm">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMPAvE_MNafgYC6kjStqbeczr4tKvLdakMdEdJ3S7VGzBtiAnsf56oClOyCpco17NEx-XWEXsDVDPs-Q3gLwpIHs-lRnQvP96x-YZOWHvb9ZiAJvFX0K-Ufx-rbwcxm0hxHdewN33ZJE7nxmek2RSAhGwXnrfcEDHaCIrPIt0B6WDVwMmdrzYc2oyt1I5BCTRSmIehxvQG0fUhbcmz5bYuM6pvydqnB9wk9WZg95Un812tVUze0iHK0Jp48JXADwK5mw5KIHhPYF4" alt="Clara Mendes" className="w-full h-full object-cover" />
          </div>
          <p className="font-ui text-sm text-muted tracking-widest uppercase mb-2">Escrito por</p>
          <h3 className="font-display text-2xl text-primary italic">Clara Mendes</h3>

          <div className="mt-16 group cursor-pointer" onClick={() => navigate('/read')}>
            <p className="font-ui text-xs text-muted/70 text-center mb-2 uppercase tracking-wide group-hover:text-primary transition-colors">Próxima Leitura</p>
            <div className="text-center font-display text-xl text-text-main group-hover:text-primary transition-colors border-b border-transparent group-hover:border-primary/30 pb-1">
              O Silêncio dos Pinheiros →
            </div>
          </div>
        </footer>
      </main>

      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#bbfda6]/20 via-transparent to-transparent"></div>
    </div>
  );
};

export default ReadingView;