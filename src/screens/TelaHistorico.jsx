import React from 'react';
import { ChevronLeft, ScrollText } from 'lucide-react';
import LayoutBase from '../components/LayoutBase';

const formatarData = (dataIso) => {
  if (!dataIso) return '--/--';
  const data = new Date(dataIso);
  return data.toLocaleDateString('pt-BR');
};

const calcularDataFim = (dataIso, dias) => {
  if (!dataIso) return null;
  const data = new Date(dataIso);
  data.setDate(data.getDate() + dias);
  return data;
};

const TelaHistorico = ({ modoOffline, setTela, medicamentos }) => {
  return (
    <LayoutBase modoOffline={modoOffline}>
       <header className="bg-white p-4 sm:p-6 shadow-md flex items-center gap-3 sm:gap-4 sticky top-0 z-20">
        <button onClick={() => setTela('inicio')} className="p-3 sm:p-4 bg-slate-100 rounded-full active:bg-slate-200">
          <ChevronLeft size={36} className="text-slate-700 sm:w-12 sm:h-12" />
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800">Histórico</h1>
          <p className="text-slate-500 text-lg sm:text-xl font-medium">Lista de tratamentos</p>
        </div>
      </header>
      <main className="p-4 sm:p-6 max-w-2xl mx-auto pb-16 sm:pb-20">
        {medicamentos.length === 0 ? (
           <div className="text-center mt-16 sm:mt-20 opacity-60">
             <ScrollText size={80} className="mx-auto mb-4 sm:mb-6 text-slate-400 sm:w-24 sm:h-24" />
             <p className="text-2xl sm:text-3xl font-bold text-slate-400">Histórico vazio.</p>
           </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {medicamentos.map((med) => {
              const fim = calcularDataFim(med.dataInicio, med.dias);
              const finalizado = fim < new Date();
              return (
                <div key={med.id} className={`p-4 sm:p-6 rounded-xl sm:rounded-[2rem] shadow-md border-4 ${finalizado ? 'bg-slate-100 border-slate-200' : 'bg-white border-purple-100'}`}>
                  <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800 break-words">{med.nome}</h3>
                    {finalizado ? 
                      <span className="bg-slate-200 text-slate-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm uppercase whitespace-nowrap">Concluído</span> : 
                      <span className="bg-green-100 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm uppercase animate-pulse whitespace-nowrap">Em andamento</span>
                    }
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                      <p className="text-slate-500 font-bold text-xs sm:text-sm uppercase">Dosagem</p>
                      <p className="text-base sm:text-xl font-bold text-slate-800 break-words">{med.dosagem}</p>
                    </div>
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                      <p className="text-slate-500 font-bold text-xs sm:text-sm uppercase">Duração</p>
                      <p className="text-base sm:text-xl font-bold text-slate-800">{med.dias} dias</p>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-purple-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0">
                    <div>
                      <p className="text-purple-400 font-bold text-xs sm:text-sm uppercase">Início</p>
                      <p className="text-lg sm:text-2xl font-black text-purple-800">{formatarData(med.dataInicio)}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-purple-400 font-bold text-xs sm:text-sm uppercase">Término Previsto</p>
                      <p className="text-lg sm:text-2xl font-black text-purple-800">{formatarData(fim)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </LayoutBase>
  );
};

export default TelaHistorico;
