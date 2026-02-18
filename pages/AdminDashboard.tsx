import React from 'react';
import Sidebar from '../components/Sidebar';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f0fdf4] font-body text-text-main">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="pt-12 px-12 pb-6 flex items-end justify-between z-10">
          <div>
            <p className="font-ui text-secondary text-sm font-medium tracking-wider uppercase mb-2">Bem-vinda de volta</p>
            <h2 className="font-display font-bold text-4xl text-primary">Meus Poemas</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <input 
                className="pl-10 pr-4 py-2.5 rounded-full bg-white border border-tertiary/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-ui text-sm w-64 text-text-main placeholder-muted transition-all shadow-sm group-hover:shadow-md" 
                placeholder="Buscar poemas..." 
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-[18px]">search</span>
            </div>
            <button className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-primary border border-tertiary/30 shadow-sm hover:shadow-md hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-12 pb-24 custom-scrollbar">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Total Publicado', value: '24', icon: 'auto_stories', color: 'text-primary', bg: 'bg-green-50' },
              { label: 'Rascunhos', value: '3', icon: 'edit_document', color: 'text-muted', bg: 'bg-gray-50' },
              { label: 'Leituras este mês', value: '1.2k', icon: 'trending_up', color: 'text-blue-600', bg: 'bg-blue-50' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-soft border border-tertiary/10 flex items-start justify-between">
                <div>
                  <p className="font-ui text-muted text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="font-display text-3xl text-primary">{stat.value}</p>
                </div>
                <span className={`p-2 rounded-lg ${stat.bg} ${stat.color} material-symbols-outlined`}>{stat.icon}</span>
              </div>
            ))}
          </div>

          {/* List */}
          <div className="flex flex-col gap-4">
             {[
               { title: 'A Dança da Chuva', status: 'Publicado', date: '12 OUT 2023', icon: 'water_drop', iconBg: 'bg-primary/5', iconColor: 'text-primary' },
               { title: 'O Silêncio da Manhã', status: 'Rascunho', date: 'Última edição: 10 OUT 2023', icon: 'wb_twilight', iconBg: 'bg-gray-50', iconColor: 'text-muted' },
               { title: 'Raízes', status: 'Publicado', date: '05 SET 2023', icon: 'forest', iconBg: 'bg-primary/5', iconColor: 'text-primary' },
               { title: 'O Vento Norte', status: 'Publicado', date: '28 AGO 2023', icon: 'wind_power', iconBg: 'bg-primary/5', iconColor: 'text-primary' }
             ].map((poem, i) => (
               <div key={i} className="group bg-white p-6 rounded-[24px] shadow-soft hover:shadow-hover border border-tertiary/10 hover:border-tertiary/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                   <div className={`h-14 w-14 rounded-2xl ${poem.iconBg} flex items-center justify-center ${poem.iconColor} shrink-0`}>
                     <span className="material-symbols-outlined">{poem.icon}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                     <h3 className="font-display text-xl font-bold text-text-main leading-tight">{poem.title}</h3>
                     <div className="flex items-center gap-3">
                       <span className={`font-ui text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${poem.status === 'Publicado' ? 'bg-accent/30 text-primary-dark border-accent/20' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>{poem.status}</span>
                       <span className="font-ui text-xs text-muted font-medium flex items-center gap-1">
                         <span className="material-symbols-outlined text-[12px]">{poem.status === 'Publicado' ? 'calendar_today' : 'schedule'}</span>
                         {poem.date}
                       </span>
                     </div>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                   <button className="p-2 rounded-full hover:bg-gray-100 text-muted hover:text-primary transition-colors" title="Editar">
                     <span className="material-symbols-outlined text-[20px]">edit</span>
                   </button>
                   <button className="p-2 rounded-full hover:bg-red-50 text-muted hover:text-red-500 transition-colors" title="Excluir">
                     <span className="material-symbols-outlined text-[20px]">delete</span>
                   </button>
                   {poem.status === 'Publicado' && (
                     <button className="p-2 rounded-full hover:bg-gray-100 text-muted hover:text-primary transition-colors" title="Visualizar">
                       <span className="material-symbols-outlined text-[20px]">visibility</span>
                     </button>
                   )}
                 </div>
               </div>
             ))}
          </div>

          <div className="fixed bottom-12 right-12">
            <button className="group relative flex items-center justify-center h-16 w-16 bg-primary rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50">
              <span className="material-symbols-outlined text-white text-[32px] group-hover:rotate-90 transition-transform duration-300">add</span>
              <span className="absolute right-full mr-4 bg-white text-text-main font-ui font-medium text-sm py-1 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">Novo Poema</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;