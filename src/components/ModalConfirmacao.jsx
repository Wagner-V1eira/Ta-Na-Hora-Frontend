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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl text-center animate-in fade-in zoom-in duration-200 border-3 border-slate-200 relative my-3">
        
        <button 
          onClick={() => tocarAlerta(medicamento.nome)}
          className="absolute top-3 right-3 p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
          title="Ouvir nome do remédio"
        >
          <Volume2 size={24} strokeWidth={3} />
        </button>

        <div className="bg-blue-100 text-blue-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Pill size={44} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-3">Hora do Remédio</h2>
        
        {numeroAlerta && totalAlertas && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-3 inline-block border-2 border-blue-300">
            <p className="text-lg sm:text-xl font-bold">
              🔔 Alerta {numeroAlerta} de {totalAlertas}
            </p>
          </div>
        )}

        <p className="text-lg sm:text-xl text-slate-600 mb-4 leading-relaxed font-medium">
          Você vai tomar o <br />
          <strong className="text-blue-700 text-2xl sm:text-3xl block mt-2 mb-2 uppercase tracking-wide break-words">
            {medicamento.nome}
          </strong>
          agora?
        </p>
        {medicamento.conselho_ia && (
           <div className="mb-5 bg-yellow-50 p-4 rounded-xl border-l-6 border-yellow-400 text-left shadow-sm">
             <p className="text-base font-bold text-yellow-800 mb-1 flex items-center gap-2">
               💡 Dica:
             </p>
             <p className="text-base sm:text-lg text-slate-700 italic leading-snug">
               "{medicamento.conselho_ia}"
             </p>
           </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={aoFechar} className="p-5 bg-red-100 text-red-700 rounded-2xl font-black text-xl flex flex-col items-center justify-center gap-2 hover:bg-red-200 border-3 border-red-200 transition-colors">
            <X size={32} strokeWidth={3} /> NÃO
          </button>
          <button onClick={aoConfirmar} className="p-5 bg-green-600 text-white rounded-2xl font-black text-xl flex flex-col items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-200 border-3 border-green-600 transition-colors">
            <Check size={32} strokeWidth={3} /> SIM
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;
