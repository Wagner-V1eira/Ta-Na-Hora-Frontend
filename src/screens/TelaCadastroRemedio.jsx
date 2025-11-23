import React, { useState } from 'react';
import { ChevronLeft, Check, Clock, Volume2, Loader2 } from 'lucide-react';
import LayoutBase from '../components/LayoutBase';

const TelaCadastro = ({
  modoOffline,
  setTela,
  formNome,
  setFormNome,
  formDosagem,
  setFormDosagem,
  formDias,
  setFormDias,
  formIntervaloHoras,
  setFormIntervaloHoras,
  formAlertaSonoro,
  setFormAlertaSonoro,
  formHorarioInicio,
  setFormHorarioInicio,
  formHorarioFim,
  setFormHorarioFim,
  salvarMedicamento
}) => {
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    await salvarMedicamento();
    setTimeout(() => setSalvando(false), 1000);
  };

  return (
    <LayoutBase modoOffline={modoOffline}>
      <header className="bg-white p-6 sm:p-8 shadow-md flex items-center gap-4 sticky top-0 z-20">
        <button onClick={() => setTela('inicio')} className="p-3 sm:p-4 bg-slate-100 rounded-full active:bg-slate-200">
          <ChevronLeft size={40} className="text-slate-700 sm:w-12 sm:h-12" />
        </button>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800">Novo Remédio</h1>
      </header>
      <main className="p-4 sm:p-6 flex flex-col gap-6 sm:gap-10 max-w-xl mx-auto pt-6 sm:pt-10">
        
        <div className="space-y-2 sm:space-y-3">
          <label className="text-2xl sm:text-3xl font-bold text-slate-700 ml-2">Nome do Remédio</label>
          <input 
            type="text" 
            value={formNome} 
            onChange={e => setFormNome(e.target.value)} 
            placeholder="Ex: Aspirina" 
            className="w-full p-6 sm:p-8 text-3xl sm:text-4xl font-medium rounded-2xl sm:rounded-3xl border-4 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm placeholder:text-slate-300" 
          />
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          <label className="text-2xl sm:text-3xl font-bold text-slate-700 ml-2">Dose (Opcional)</label>
          <input 
            type="text" 
            value={formDosagem} 
            onChange={e => setFormDosagem(e.target.value)} 
            placeholder="Ex: 1 após almoço" 
            className="w-full p-6 sm:p-8 text-2xl sm:text-3xl font-medium rounded-2xl sm:rounded-3xl border-4 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm placeholder:text-slate-300" 
          />
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          <label className="text-2xl sm:text-3xl font-bold text-slate-700 ml-2">Por quantos dias?</label>
          <div className="flex gap-3 sm:gap-4">
            {[7, 14, 30].map(d => (
              <button 
                key={d} 
                onClick={() => setFormDias(d.toString())} 
                className={`flex-1 p-4 sm:p-6 rounded-xl sm:rounded-2xl font-bold text-xl sm:text-2xl border-4 transition-all active:scale-95 ${formDias === d.toString() ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                {d} dias
              </button>
            ))}
          </div>
          <input 
            type="number" 
            value={formDias} 
            onChange={e => setFormDias(e.target.value)} 
            placeholder="Outro valor..." 
            className="w-full p-5 sm:p-6 text-2xl sm:text-3xl rounded-xl sm:rounded-2xl border-4 border-slate-200 mt-2 placeholder:text-slate-300" 
          />
        </div>

        <div className="space-y-2 sm:space-y-3">
          <label className="text-2xl sm:text-3xl font-bold text-slate-700 ml-2">De quantas em quantas horas?</label>
          <div className="flex gap-3 sm:gap-4">
            {[6, 8, 12, 24].map(h => (
              <button 
                key={h} 
                onClick={() => setFormIntervaloHoras(h.toString())} 
                className={`flex-1 p-4 sm:p-6 rounded-xl sm:rounded-2xl font-bold text-xl sm:text-2xl border-4 transition-all active:scale-95 ${formIntervaloHoras === h.toString() ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 sm:p-6 rounded-2xl border-4 border-blue-200 space-y-4">
          <div className="flex items-center gap-3 mb-3">
            <Clock size={32} className="text-blue-600" />
            <label className="text-2xl sm:text-3xl font-bold text-blue-800">Horário do Alerta (Opcional)</label>
          </div>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-4">
            Defina o período em que você deseja receber alertas sonoros para tomar o medicamento. 
            O sistema emitirá <strong>5 alertas</strong> distribuídos neste período.
          </p>
          
          <div className="bg-white p-4 sm:p-5 rounded-xl border-3 border-blue-300 mb-4">
            <label className="flex items-center gap-4 cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={formAlertaSonoro} 
                  onChange={e => setFormAlertaSonoro(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-20 h-10 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-10 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-9 after:w-9 after:transition-all peer-checked:bg-green-500"></div>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 size={28} className={formAlertaSonoro ? 'text-green-600' : 'text-slate-400'} />
                <span className="text-xl sm:text-2xl font-bold text-slate-700">
                  {formAlertaSonoro ? 'Alerta Sonoro ATIVADO' : 'Alerta Sonoro DESATIVADO'}
                </span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-lg sm:text-xl font-bold text-slate-700 ml-1">Hora Inicial</label>
              <input 
                type="time" 
                value={formHorarioInicio} 
                onChange={e => setFormHorarioInicio(e.target.value)} 
                className="w-full p-4 sm:p-5 text-2xl sm:text-3xl font-bold rounded-xl border-4 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg sm:text-xl font-bold text-slate-700 ml-1">Hora Final</label>
              <input 
                type="time" 
                value={formHorarioFim} 
                onChange={e => setFormHorarioFim(e.target.value)} 
                className="w-full p-4 sm:p-5 text-2xl sm:text-3xl font-bold rounded-xl border-4 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm" 
              />
            </div>
          </div>
          {formHorarioInicio && formHorarioFim && (
            <div className="bg-white p-4 rounded-xl border-2 border-blue-200 mt-3">
              <p className="text-base sm:text-lg text-slate-700">
                <strong>📢 Exemplo:</strong> Os alertas serão emitidos em intervalos regulares entre{' '}
                <span className="font-black text-blue-700">{formHorarioInicio}</span> e{' '}
                <span className="font-black text-blue-700">{formHorarioFim}</span>
              </p>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleSalvar} 
          disabled={salvando}
          className={`w-full text-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] font-black text-3xl sm:text-4xl shadow-xl mt-4 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4 transition-all border-b-8 border-green-800 ${
            salvando 
              ? 'bg-green-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 active:scale-95 active:border-b-0'
          }`}
        >
          {salvando ? (
            <>
              <Loader2 size={48} strokeWidth={4} className="animate-spin" />
              SALVANDO...
            </>
          ) : (
            <>
              <Check size={48} strokeWidth={4} />
              SALVAR
            </>
          )}
        </button>
      </main>
    </LayoutBase>
  );
};

export default TelaCadastro;
