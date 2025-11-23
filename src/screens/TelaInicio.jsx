import React from 'react';
import { Plus, Calendar, ScrollText, Bell, Trash2 } from 'lucide-react';
import LayoutBase from '../components/LayoutBase';
import BotaoGrande from '../components/BotaoGrande';
import ModalExclusao from '../components/ModalExclusao';

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

const TelaInicio = ({ 
  modoOffline, 
  medicamentos, 
  setTela, 
  dadosModalExclusao, 
  setDadosModalExclusao, 
  excluirMedicamento 
}) => {
  const hoje = new Date();

  return (
    <LayoutBase modoOffline={modoOffline}>
      <ModalExclusao 
        aberto={!!dadosModalExclusao} 
        medicamento={dadosModalExclusao} 
        aoFechar={() => setDadosModalExclusao(null)} 
        aoConfirmar={excluirMedicamento} 
      />
      
      <header className="bg-blue-600 p-6 sm:p-10 text-white shadow-xl rounded-b-2xl sm:rounded-b-[3rem]">
        <h1 className="text-4xl sm:text-5xl font-black text-center tracking-tight drop-shadow-md">Tá na Hora</h1>
        <p className="text-center text-blue-100 mt-3 sm:mt-4 text-2xl sm:text-3xl font-medium">
          Hoje é dia {hoje.getDate()}/{hoje.getMonth()+1}
        </p>
      </header>

      <main className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-6 max-w-2xl mx-auto">
        <BotaoGrande 
          aoClicar={() => setTela('cadastro')} 
          icone={Plus} 
          rotulo="Cadastrar Novo Remédio" 
          classeCor="bg-blue-500 text-white hover:bg-blue-600" 
        />
        <BotaoGrande 
          aoClicar={() => setTela('calendario')} 
          icone={Calendar} 
          rotulo="Ver Calendário de Doses" 
          classeCor="bg-teal-500 text-white hover:bg-teal-600" 
        />
        <BotaoGrande 
          aoClicar={() => setTela('historico')} 
          icone={ScrollText} 
          rotulo="Ver Histórico Completo" 
          classeCor="bg-purple-500 text-white hover:bg-purple-600" 
        />

        {medicamentos.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-700 mb-4 sm:mb-6 pl-2">Remédios Ativos:</h3>
            <div className="space-y-4 sm:space-y-6">
              {medicamentos.map(med => (
                <div key={med.id} className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-[2rem] shadow-md border-l-8 sm:border-l-[16px] border-blue-500 flex flex-col gap-3 sm:gap-4 relative">
                  
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
                    <button 
                      onClick={() => tocarAlerta(med.nome)}
                      className="p-2 sm:p-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      title="Simular Alerta Sonoro"
                    >
                      <Bell size={24} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
                    </button>

                    <button 
                      onClick={() => setDadosModalExclusao(med)}
                      className="p-2 sm:p-3 bg-red-50 text-red-400 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                      title="Excluir Medicamento"
                    >
                      <Trash2 size={24} className="sm:w-8 sm:h-8" strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="flex justify-between items-start pr-20 sm:pr-32">
                    <div>
                      <p className="text-2xl sm:text-4xl font-black text-slate-800 mb-1 sm:mb-2 break-words">{med.nome}</p>
                      <p className="text-lg sm:text-2xl text-slate-500 font-semibold">{med.dosagem}</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-900 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-base sm:text-xl font-bold w-fit">
                      {med.dias} dias
                  </span>
                  
                  {med.conselho_ia && (
                    <div className="mt-2 bg-yellow-50 p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-yellow-200">
                      <p className="text-base sm:text-xl font-bold text-yellow-700 flex items-center gap-2 mb-1">💡 Dica do Especialista:</p>
                      <p className="text-lg sm:text-2xl text-slate-700 italic leading-relaxed">"{med.conselho_ia}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </LayoutBase>
  );
};

export default TelaInicio;
