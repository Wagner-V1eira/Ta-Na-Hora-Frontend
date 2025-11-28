import React from 'react';
import { Pill, Volume2, X, Check } from 'lucide-react';

const tocarAlerta = (nomeRemedio) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const frase = `Atenção. Tá na hora de tomar o seu remédio: ${nomeRemedio}`;
    const fala = new SpeechSynthesisUtterance(frase);
    
    fala.lang = 'pt-BR'; 
    fala.rate = 0.9;     
    fala.pitch = 1;      

    window.speechSynthesis.speak(fala);
  } else {
    alert("Seu navegador não suporta áudio.");
  }
};

const ModalConfirmacao = ({ aberto, medicamento, aoFechar, aoConfirmar, numeroAlerta, totalAlertas }) => {
  if (!aberto || !medicamento) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl p-4 sm:p-5 w-full max-w-sm sm:max-w-sm shadow-2xl text-center animate-in fade-in zoom-in duration-200 border-3 border-slate-200 relative my-3">
        
        <button 
          onClick={() => tocarAlerta(medicamento.nome)}
          className="absolute top-2 right-2 p-1.5 sm:p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
          title="Ouvir nome do remédio"
        >
          <Volume2 size={18} className="sm:w-5 sm:h-5" strokeWidth={3} />
        </button>

        <div className="bg-blue-100 text-blue-700 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <Pill size={32} className="sm:w-9 sm:h-9" />
        </div>
        <h2 className="text-lg sm:text-2xl font-black text-slate-800 mb-2">Hora do Remédio</h2>
        
        {numeroAlerta && totalAlertas && (
          <div className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg mb-2 inline-block border-2 border-blue-300">
            <p className="text-sm sm:text-base font-bold">
              🔔 Alerta {numeroAlerta} de {totalAlertas}
            </p>
          </div>
        )}

        <p className="text-sm sm:text-base text-slate-600 mb-2 sm:mb-3 leading-relaxed font-medium">
          Você vai tomar o <br />
          <strong className="text-base sm:text-xl text-blue-700 block mt-1 mb-1 uppercase tracking-wide break-words">
            {medicamento.nome}
          </strong>
          agora?
        </p>
        {medicamento.conselho_ia && (
           <div className="mb-3 bg-yellow-50 p-2 sm:p-3 rounded-xl border-l-3 sm:border-l-4 border-yellow-400 text-left shadow-sm">
             <p className="text-xs sm:text-sm font-bold text-yellow-800 mb-1 flex items-center gap-1">
               💡 Dica:
             </p>
             <p className="text-xs sm:text-sm text-slate-700 italic leading-snug">
               "{medicamento.conselho_ia}"
             </p>
           </div>
        )}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button onClick={aoFechar} className="p-3 sm:p-4 bg-red-100 text-red-700 rounded-xl font-black text-base sm:text-lg flex flex-col items-center justify-center gap-1 hover:bg-red-200 border-3 border-red-200 transition-colors active:scale-95">
            <X size={24} className="sm:w-7 sm:h-7" strokeWidth={3} /> NÃO
          </button>
          <button onClick={aoConfirmar} className="p-3 sm:p-4 bg-green-600 text-white rounded-xl font-black text-base sm:text-lg flex flex-col items-center justify-center gap-1 hover:bg-green-700 shadow-lg shadow-green-200 border-3 border-green-600 transition-colors active:scale-95">
            <Check size={24} className="sm:w-7 sm:h-7" strokeWidth={3} /> SIM
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;
