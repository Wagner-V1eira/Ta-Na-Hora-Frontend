import React from 'react';
import { ChevronLeft, Pill, Check, Bell } from 'lucide-react';
import LayoutBase from '../components/LayoutBase';
import ModalConfirmacao from '../components/ModalConfirmacao';

const TelaCalendario = ({
  modoOffline,
  setTela,
  medicamentos,
  dadosModal,
  setDadosModal,
  confirmarTomarRemedio,
  registros,
  aoClicarDia
}) => {
  const hoje = new Date();
  const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
  const listaDias = Array.from({ length: diasNoMes }, (_, i) => i + 1);

  const obterStatusDia = (dia, med) => {
    const chaveData = `${med.id}_${hoje.getFullYear()}-${hoje.getMonth()}-${dia}`;
    if (registros[chaveData] === 'tomado') return 'verde';
    const dataAtualLoop = new Date(hoje.getFullYear(), hoje.getMonth(), dia);
    const dataInicio = new Date(med.dataInicio);
    dataInicio.setHours(0,0,0,0);
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataInicio.getDate() + med.dias);
    if (dataAtualLoop < dataInicio || dataAtualLoop >= dataFim) return 'nenhum';
    const dataHojeReal = new Date();
    dataHojeReal.setHours(0,0,0,0);
    if (dataAtualLoop < dataHojeReal) return 'vermelho';
    return 'amarelo';
  };

  return (
    <LayoutBase modoOffline={modoOffline}>
      <ModalConfirmacao 
        aberto={!!dadosModal} 
        medicamento={dadosModal?.med} 
        numeroAlerta={dadosModal?.numeroAlerta}
        totalAlertas={dadosModal?.totalAlertas}
        aoFechar={() => setDadosModal(null)} 
        aoConfirmar={confirmarTomarRemedio} 
      />
      <header className="bg-white p-4 sm:p-6 shadow-md flex items-center gap-3 sm:gap-4 sticky top-0 z-20">
        <button onClick={() => setTela('inicio')} className="p-3 sm:p-4 bg-slate-100 rounded-full active:bg-slate-200">
          <ChevronLeft size={40} className="text-slate-700 sm:w-12 sm:h-12" />
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800">Calendário</h1>
          <p className="text-slate-500 text-lg sm:text-xl font-medium">Toque no dia para confirmar</p>
        </div>
      </header>
      <main className="p-3 sm:p-4 space-y-6 sm:space-y-10 pb-20 sm:pb-24 pt-6 sm:pt-8 max-w-2xl mx-auto">
        {medicamentos.length === 0 ? (
          <div className="text-center mt-20 opacity-60">
            <Pill size={80} className="mx-auto mb-6 text-slate-400 sm:w-24 sm:h-24" />
            <p className="text-2xl sm:text-3xl font-bold text-slate-400">Nenhum remédio cadastrado.</p>
          </div>
        ) : (
          medicamentos.map(med => (
            <div key={med.id} className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-lg overflow-hidden border-4 border-slate-100">
              <div className="bg-slate-50 p-5 sm:p-8 border-b-4 border-slate-200">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-3 sm:gap-4">
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-full text-blue-600">
                    <Pill size={32} className="sm:w-10 sm:h-10" />
                  </div>
                  <span className="break-words">{med.nome}</span>
                </h3>
                {med.horarioInicio && med.horarioFim && (
                  <div className="mt-3 flex items-center gap-2 text-lg sm:text-xl text-blue-700 font-bold bg-blue-50 p-3 rounded-xl">
                    <Bell size={24} className="animate-pulse" />
                    Alertas: {med.horarioInicio} - {med.horarioFim}
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center mb-3 sm:mb-4">
                  {['D','S','T','Q','Q','S','S'].map((d, i) => 
                    <span key={i} className="text-lg sm:text-xl font-black text-slate-400">{d}</span>
                  )}
                </div>
                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {listaDias.map(dia => {
                    const status = obterStatusDia(dia, med);
                    let classeFundo = 'bg-slate-50 text-slate-300';
                    if (status === 'amarelo') classeFundo = 'bg-yellow-100 text-yellow-800 border-4 border-yellow-400 cursor-pointer font-black animate-pulse shadow-md scale-105';
                    if (status === 'verde') classeFundo = 'bg-green-500 text-white border-4 border-green-600 font-black shadow-md';
                    if (status === 'vermelho') classeFundo = 'bg-red-100 text-red-600 border-4 border-red-300 font-black';
                    return (
                      <div 
                        key={dia} 
                        onClick={() => aoClicarDia(dia, med)} 
                        className={`aspect-square flex items-center justify-center rounded-xl sm:rounded-2xl text-xl sm:text-2xl relative transition-transform active:scale-90 ${classeFundo}`}
                      >
                        {dia}
                        {status === 'verde' && <Check size={24} strokeWidth={4} className="absolute bottom-0.5 right-0.5 drop-shadow-md sm:w-8 sm:h-8" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </LayoutBase>
  );
};

export default TelaCalendario;
