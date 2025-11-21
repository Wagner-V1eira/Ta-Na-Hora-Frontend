import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Check, X, Pill, ChevronLeft, WifiOff, ScrollText, Trash2, Volume2, Bell } from 'lucide-react';

const DADOS_SIMULADOS = [
  { id: 1, nome: 'Aspirina (Teste)', dosagem: '1 ao dia', dias: 7, dataInicio: new Date().toISOString(), conselho_ia: 'Tome com bastante água.' },
];

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

const BotaoGrande = ({ aoClicar, icone: Icone, rotulo, classeCor }) => (
  <button
    onClick={aoClicar}
    className={`
      w-full p-8 rounded-[2rem] shadow-lg flex flex-col items-center justify-center gap-4
      transition-transform transform active:scale-95 touch-manipulation border-4 border-transparent
      ${classeCor}
    `}
  >
    {Icone && <Icone size={64} strokeWidth={2} />} 
    <span className="text-3xl font-black text-center leading-tight">{rotulo}</span>
  </button>
);

const ModalExclusao = ({ aberto, medicamento, aoFechar, aoConfirmar }) => {
  if (!aberto || !medicamento) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl text-center animate-in fade-in zoom-in duration-200 border-8 border-red-100">
        <div className="bg-red-100 text-red-600 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Trash2 size={60} strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-black text-red-600 mb-4">EXCLUIR REMÉDIO?</h2>
        <p className="text-2xl text-slate-600 mb-8 leading-relaxed font-bold">
          Você tem certeza que deseja apagar o<br />
          <strong className="text-slate-900 text-4xl block mt-3 mb-3 uppercase bg-slate-100 p-2 rounded-xl">
            {medicamento.nome}
          </strong>
          do sistema?
        </p>
        <div className="grid grid-cols-1 gap-4">
          <button onClick={aoConfirmar} className="p-6 bg-red-600 text-white rounded-3xl font-black text-3xl flex items-center justify-center gap-3 hover:bg-red-700 shadow-xl shadow-red-200 border-4 border-red-800">
            <Trash2 size={40} strokeWidth={3} /> SIM, APAGAR
          </button>
          <button onClick={aoFechar} className="p-6 bg-white text-slate-700 rounded-3xl font-black text-2xl flex items-center justify-center gap-3 hover:bg-slate-50 border-4 border-slate-200">
            <X size={40} strokeWidth={3} /> CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
};

const ModalConfirmacao = ({ aberto, medicamento, aoFechar, aoConfirmar }) => {
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

const LayoutBase = ({ children, modoOffline }) => (
  <div className="min-h-screen bg-slate-50 font-sans pb-10 relative">
    {children}
    {modoOffline && (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-2 text-center text-sm flex items-center justify-center gap-2 z-50 opacity-90">
        <WifiOff size={16} />
        Modo Simulação (Servidor Offline)
      </div>
    )}
  </div>
);

export default function App() {
  const [tela, setTela] = useState('inicio');
  const [medicamentos, setMedicamentos] = useState([]);
  const [registros, setRegistros] = useState({});
  const [dadosModal, setDadosModal] = useState(null);
  const [dadosModalExclusao, setDadosModalExclusao] = useState(null);
  const [modoOffline, setModoOffline] = useState(false);
  const [formNome, setFormNome] = useState('');
  const [formDosagem, setFormDosagem] = useState('');
  const [formDias, setFormDias] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/medicamentos');
        if (!res.ok) throw new Error('Falha');
        const dados = await res.json();
        setMedicamentos(dados);
        setModoOffline(false);
      } catch (erro) {
        console.warn("Backend offline.", erro);
        setModoOffline(true);
        setMedicamentos(prev => prev.length > 0 ? prev : DADOS_SIMULADOS);
      }
    };
    carregar();
  }, []);

  const salvarMedicamento = async () => {
    if (!formNome || !formDias) {
      alert("Por favor, preencha o nome e os dias.");
      return;
    }
    const novoMed = {
      id: modoOffline ? Date.now() : null, 
      nome: formNome,
      dosagem: formDosagem,
      dias: parseInt(formDias),
      dataInicio: new Date().toISOString(),
      conselho_ia: modoOffline ? "Simulação: Servidor offline." : null
    };
    try {
      let medFinal = novoMed;
      if (!modoOffline) {
        const resposta = await fetch('http://localhost:5000/api/medicamentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoMed)
        });
        medFinal = await resposta.json();
      }
      setMedicamentos([...medicamentos, medFinal]);
      setFormNome('');
      setFormDosagem('');
      setFormDias('');
      setTela('inicio');
    } catch {
      alert("Erro crítico ao salvar.");
    }
  };

  const excluirMedicamento = async () => {
    if (!dadosModalExclusao) return;
    const idParaExcluir = dadosModalExclusao.id;
    setMedicamentos(prev => prev.filter(m => m.id !== idParaExcluir));
    if (!modoOffline) {
      try {
        await fetch(`http://localhost:5000/api/medicamentos/${idParaExcluir}`, { method: 'DELETE' });
      } catch (erro) { console.error("Erro backend", erro); }
    }
    setDadosModalExclusao(null);
  };

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

  const aoClicarDia = (dia, med) => {
    const status = obterStatusDia(dia, med);
    if (status === 'amarelo' || status === 'vermelho') {
      setDadosModal({ dia, med });
    }
  };

  const confirmarTomarRemedio = async () => {
    if (dadosModal) {
      const { dia, med } = dadosModal;
      const chaveData = `${med.id}_${hoje.getFullYear()}-${hoje.getMonth()}-${dia}`;
      setRegistros(prev => ({ ...prev, [chaveData]: 'tomado' }));
      if (!modoOffline) {
        try {
          await fetch('http://localhost:5000/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_med: med.id,
              date: `${hoje.getFullYear()}-${hoje.getMonth()}-${dia}`,
              data: `${hoje.getFullYear()}-${hoje.getMonth()}-${dia}`,
              status: 'tomado'
            })
          });
        } catch (erro) { console.error("Erro registro", erro); }
      }
      setDadosModal(null);
    }
  };

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

  if (tela === 'inicio') {
    return (
      <LayoutBase modoOffline={modoOffline}>
        <ModalExclusao aberto={!!dadosModalExclusao} medicamento={dadosModalExclusao} aoFechar={() => setDadosModalExclusao(null)} aoConfirmar={excluirMedicamento} />
        
        <header className="bg-blue-600 p-10 text-white shadow-xl rounded-b-[3rem]">
          <h1 className="text-5xl font-black text-center tracking-tight drop-shadow-md">Tá na Hora</h1>
          <p className="text-center text-blue-100 mt-4 text-3xl font-medium">
            Hoje é dia {hoje.getDate()}/{hoje.getMonth()+1}
          </p>
        </header>

        <main className="p-6 flex flex-col gap-6 mt-6 max-w-2xl mx-auto">
          <BotaoGrande aoClicar={() => setTela('cadastro')} icone={Plus} rotulo="Cadastrar Novo Remédio" classeCor="bg-blue-500 text-white hover:bg-blue-600" />
          <BotaoGrande aoClicar={() => setTela('calendario')} icone={Calendar} rotulo="Ver Calendário de Doses" classeCor="bg-teal-500 text-white hover:bg-teal-600" />
          <BotaoGrande aoClicar={() => setTela('historico')} icone={ScrollText} rotulo="Ver Histórico Completo" classeCor="bg-purple-500 text-white hover:bg-purple-600" />

          {medicamentos.length > 0 && (
            <div className="mt-8">
              <h3 className="text-3xl font-black text-slate-700 mb-6 pl-2">Remédios Ativos:</h3>
              <div className="space-y-6">
                {medicamentos.map(med => (
                  <div key={med.id} className="bg-white p-8 rounded-[2rem] shadow-md border-l-[16px] border-blue-500 flex flex-col gap-4 relative">
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => tocarAlerta(med.nome)}
                        className="p-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        title="Simular Alerta Sonoro"
                      >
                        <Bell size={32} strokeWidth={2.5} />
                      </button>

                      <button 
                        onClick={() => setDadosModalExclusao(med)}
                        className="p-3 bg-red-50 text-red-400 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                        title="Excluir Medicamento"
                      >
                        <Trash2 size={32} strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="flex justify-between items-start pr-32">
                      <div>
                        <p className="text-4xl font-black text-slate-800 mb-2">{med.nome}</p>
                        <p className="text-2xl text-slate-500 font-semibold">{med.dosagem}</p>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-900 px-6 py-3 rounded-2xl text-xl font-bold w-fit">
                        {med.dias} dias
                    </span>
                    
                    {med.conselho_ia && (
                      <div className="mt-2 bg-yellow-50 p-5 rounded-2xl border-2 border-yellow-200">
                        <p className="text-xl font-bold text-yellow-700 flex items-center gap-2 mb-1">💡 Dica do Especialista:</p>
                        <p className="text-2xl text-slate-700 italic leading-relaxed">"{med.conselho_ia}"</p>
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
  }

  if (tela === 'historico') {
    return (
      <LayoutBase modoOffline={modoOffline}>
         <header className="bg-white p-6 shadow-md flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setTela('inicio')} className="p-4 bg-slate-100 rounded-full active:bg-slate-200"><ChevronLeft size={48} className="text-slate-700" /></button>
          <div><h1 className="text-4xl font-black text-slate-800">Histórico</h1><p className="text-slate-500 text-xl font-medium">Lista de tratamentos</p></div>
        </header>
        <main className="p-6 max-w-2xl mx-auto pb-20">
          {medicamentos.length === 0 ? (
             <div className="text-center mt-20 opacity-60"><ScrollText size={100} className="mx-auto mb-6 text-slate-400" /><p className="text-3xl font-bold text-slate-400">Histórico vazio.</p></div>
          ) : (
            <div className="space-y-6">
              {medicamentos.map((med) => {
                const fim = calcularDataFim(med.dataInicio, med.dias);
                const finalizado = fim < new Date();
                return (
                  <div key={med.id} className={`p-6 rounded-[2rem] shadow-md border-4 ${finalizado ? 'bg-slate-100 border-slate-200' : 'bg-white border-purple-100'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-3xl font-black text-slate-800">{med.nome}</h3>
                      {finalizado ? <span className="bg-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold text-sm uppercase">Concluído</span> : <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold text-sm uppercase animate-pulse">Em andamento</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-50 p-4 rounded-2xl"><p className="text-slate-500 font-bold text-sm uppercase">Dosagem</p><p className="text-xl font-bold text-slate-800">{med.dosagem}</p></div>
                      <div className="bg-slate-50 p-4 rounded-2xl"><p className="text-slate-500 font-bold text-sm uppercase">Duração</p><p className="text-xl font-bold text-slate-800">{med.dias} dias</p></div>
                    </div>
                    <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 flex justify-between items-center">
                      <div><p className="text-purple-400 font-bold text-sm uppercase">Início</p><p className="text-2xl font-black text-purple-800">{formatarData(med.dataInicio)}</p></div>
                      <div className="text-right"><p className="text-purple-400 font-bold text-sm uppercase">Término Previsto</p><p className="text-2xl font-black text-purple-800">{formatarData(fim)}</p></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </LayoutBase>
    );
  }

  if (tela === 'cadastro') {
    return (
      <LayoutBase modoOffline={modoOffline}>
        <header className="bg-white p-6 shadow-md flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setTela('inicio')} className="p-4 bg-slate-100 rounded-full active:bg-slate-200"><ChevronLeft size={48} className="text-slate-700" /></button>
          <h1 className="text-4xl font-black text-slate-800">Novo Remédio</h1>
        </header>
        <main className="p-6 flex flex-col gap-10 max-w-xl mx-auto pt-10">
          <div className="space-y-3"><label className="text-3xl font-bold text-slate-700 ml-2">Nome do Remédio</label><input type="text" value={formNome} onChange={e => setFormNome(e.target.value)} placeholder="Ex: Aspirina" className="w-full p-8 text-4xl font-medium rounded-3xl border-4 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm placeholder:text-slate-300" /></div>
          <div className="space-y-3"><label className="text-3xl font-bold text-slate-700 ml-2">Dose (Opcional)</label><input type="text" value={formDosagem} onChange={e => setFormDosagem(e.target.value)} placeholder="Ex: 1 após almoço" className="w-full p-8 text-3xl font-medium rounded-3xl border-4 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm placeholder:text-slate-300" /></div>
          <div className="space-y-3">
            <label className="text-3xl font-bold text-slate-700 ml-2">Por quantos dias?</label>
            <div className="flex gap-4">{[7, 14, 30].map(d => (<button key={d} onClick={() => setFormDias(d.toString())} className={`flex-1 p-6 rounded-2xl font-bold text-2xl border-4 transition-all active:scale-95 ${formDias === d.toString() ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500'}`}>{d} dias</button>))}</div>
             <input type="number" value={formDias} onChange={e => setFormDias(e.target.value)} placeholder="Outro valor..." className="w-full p-6 text-3xl rounded-2xl border-4 border-slate-200 mt-2 placeholder:text-slate-300" />
          </div>
          <button onClick={salvarMedicamento} className="w-full bg-green-600 hover:bg-green-700 text-white p-8 rounded-[2rem] font-black text-4xl shadow-xl mt-8 flex items-center justify-center gap-4 active:scale-95 transition-transform border-b-8 border-green-800 active:border-b-0 active:mt-10"><Check size={56} strokeWidth={4} /> SALVAR</button>
        </main>
      </LayoutBase>
    );
  }

  if (tela === 'calendario') {
    return (
      <LayoutBase modoOffline={modoOffline}>
        <ModalConfirmacao aberto={!!dadosModal} medicamento={dadosModal?.med} aoFechar={() => setDadosModal(null)} aoConfirmar={confirmarTomarRemedio} />
        <header className="bg-white p-6 shadow-md flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setTela('inicio')} className="p-4 bg-slate-100 rounded-full active:bg-slate-200"><ChevronLeft size={48} className="text-slate-700" /></button>
          <div><h1 className="text-4xl font-black text-slate-800">Calendário</h1><p className="text-slate-500 text-xl font-medium">Toque no dia para confirmar</p></div>
        </header>
        <main className="p-4 space-y-10 pb-24 pt-8 max-w-2xl mx-auto">
          {medicamentos.length === 0 ? (
            <div className="text-center mt-20 opacity-60"><Pill size={100} className="mx-auto mb-6 text-slate-400" /><p className="text-3xl font-bold text-slate-400">Nenhum remédio cadastrado.</p></div>
          ) : (
            medicamentos.map(med => (
              <div key={med.id} className="bg-white rounded-[2.5rem] shadow-lg overflow-hidden border-4 border-slate-100">
                <div className="bg-slate-50 p-8 border-b-4 border-slate-200">
                  <h3 className="text-3xl font-black text-slate-800 flex items-center gap-4"><div className="bg-blue-100 p-3 rounded-full text-blue-600"><Pill size={40} /></div>{med.nome}</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-7 gap-3 text-center mb-4">{['D','S','T','Q','Q','S','S'].map((d, i) => <span key={i} className="text-xl font-black text-slate-400">{d}</span>)}</div>
                  <div className="grid grid-cols-7 gap-3">
                    {listaDias.map(dia => {
                      const status = obterStatusDia(dia, med);
                      let classeFundo = 'bg-slate-50 text-slate-300';
                      if (status === 'amarelo') classeFundo = 'bg-yellow-100 text-yellow-800 border-4 border-yellow-400 cursor-pointer font-black animate-pulse shadow-md scale-105';
                      if (status === 'verde') classeFundo = 'bg-green-500 text-white border-4 border-green-600 font-black shadow-md';
                      if (status === 'vermelho') classeFundo = 'bg-red-100 text-red-600 border-4 border-red-300 font-black';
                      return (
                        <div key={dia} onClick={() => aoClicarDia(dia, med)} className={`aspect-square flex items-center justify-center rounded-2xl text-2xl relative transition-transform active:scale-90 ${classeFundo}`}>
                          {dia}
                          {status === 'verde' && <Check size={32} strokeWidth={4} className="absolute bottom-1 right-1 drop-shadow-md" />}
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
  }
}