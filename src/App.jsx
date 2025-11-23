import React, { useState, useEffect } from 'react';
import TelaInicio from './screens/TelaInicio';
import TelaCadastroRemedio from './screens/TelaCadastroRemedio';
import TelaCalendario from './screens/TelaCalendario';
import TelaHistorico from './screens/TelaHistorico';

const DADOS_SIMULADOS = [
  { id: 1, nome: 'Aspirina (Teste)', dosagem: '1 ao dia', dias: 7, dataInicio: new Date().toISOString(), conselho_ia: 'Tome com bastante água.', horarioInicio: '12:00', horarioFim: '13:00' },
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
  const [formIntervaloHoras, setFormIntervaloHoras] = useState('12');
  const [formHorarioInicio, setFormHorarioInicio] = useState('');
  const [formHorarioFim, setFormHorarioFim] = useState('');
  const [formAlertaSonoro, setFormAlertaSonoro] = useState(true);

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

  useEffect(() => {
    const verificarAlertasBackend = async () => {
      if (modoOffline) return;
      
      try {
        const res = await fetch('http://localhost:5000/api/alertas');
        if (!res.ok) return;
        
        const alertas = await res.json();
        
        if (alertas.length > 0 && !dadosModal) {
          const primeiroAlerta = alertas[0];
          tocarAlerta(primeiroAlerta.nome);
          
          const hoje = new Date();
          setDadosModal({ 
            dia: hoje.getDate(), 
            med: primeiroAlerta,
            numeroAlerta: primeiroAlerta.numeroAlerta,
            totalAlertas: primeiroAlerta.totalAlertas
          });
        }
      } catch (erro) {
        console.error("Erro ao verificar alertas:", erro);
      }
    };
    
    verificarAlertasBackend();
    const intervalo = setInterval(verificarAlertasBackend, 60000); 
    
    return () => clearInterval(intervalo);
  }, [modoOffline]);

  const salvarMedicamento = async () => {
    if (!formNome || !formDias) {
      alert("Por favor, preencha o nome e os dias.");
      return;
    }

    const novoMed = {
      nome: formNome,
      dosagem: formDosagem || 'Não especificado',
      dias: parseInt(formDias),
      dataInicio: new Date().toISOString(),
      conselho_ia: '',
      intervaloHoras: parseInt(formIntervaloHoras),
      horarioInicio: formHorarioInicio,
      horarioFim: formHorarioFim,
      alertaSonoro: formAlertaSonoro ? 1 : 0
    };

    if (modoOffline) {
      const id = medicamentos.length > 0 ? Math.max(...medicamentos.map(m => m.id)) + 1 : 1;
      setMedicamentos(prev => [...prev, { id, ...novoMed }]);
      setFormNome('');
      setFormDosagem('');
      setFormDias('');
      setFormIntervaloHoras('12');
      setFormHorarioInicio('');
      setFormHorarioFim('');
      setFormAlertaSonoro(true);
      setTela('inicio');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/medicamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoMed)
      });
      if (res.ok) {
        const salvo = await res.json();
        setMedicamentos(prev => [...prev, salvo]);
        setFormNome('');
        setFormDosagem('');
        setFormDias('');
        setFormIntervaloHoras('12');
        setFormHorarioInicio('');
        setFormHorarioFim('');
        setFormAlertaSonoro(true);
        setTela('inicio');
      } else {
        alert("Erro ao salvar medicamento.");
      }
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      alert("Erro de conexão. Tente novamente.");
    }
  };

  const excluirMedicamento = async () => {
    if (!dadosModalExclusao) return;
    const med = dadosModalExclusao;

    if (modoOffline) {
      setMedicamentos(prev => prev.filter(m => m.id !== med.id));
      setDadosModalExclusao(null);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/medicamentos/${med.id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedicamentos(prev => prev.filter(m => m.id !== med.id));
      } else {
        alert("Erro ao excluir medicamento.");
      }
    } catch (erro) {
      console.error("Erro ao excluir:", erro);
      alert("Erro de conexão.");
    }
    setDadosModalExclusao(null);
  };

  const aoClicarDia = (dia, med) => {
    const hoje = new Date();
    const chaveData = `${med.id}_${hoje.getFullYear()}-${hoje.getMonth()}-${dia}`;
    if (registros[chaveData] === 'tomado') return;
    
    const dataAtualLoop = new Date(hoje.getFullYear(), hoje.getMonth(), dia);
    const dataInicio = new Date(med.dataInicio);
    dataInicio.setHours(0,0,0,0);
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataInicio.getDate() + med.dias);
    
    if (dataAtualLoop < dataInicio || dataAtualLoop >= dataFim) return;
    
    setDadosModal({ dia, med });
  };

  const confirmarTomarRemedio = async () => {
    if (dadosModal) {
      const { dia, med } = dadosModal;
      const agora = new Date();
      const horarioAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
      const dataAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      
      const chaveData = `${med.id}_${agora.getFullYear()}-${agora.getMonth()}-${dia}`;
      setRegistros(prev => ({ ...prev, [chaveData]: 'tomado' }));
      
      if (!modoOffline) {
        try {
          await fetch('http://localhost:5000/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_med: med.id,
              data: dataAtual,
              horario: horarioAtual,
              status: 'tomado'
            })
          });
        } catch (erro) { 
          console.error("Erro ao registrar:", erro); 
        }
      }
      setDadosModal(null);
    }
  };

  if (tela === 'inicio') {
    return (
      <TelaInicio 
        modoOffline={modoOffline}
        medicamentos={medicamentos}
        setTela={setTela}
        dadosModalExclusao={dadosModalExclusao}
        setDadosModalExclusao={setDadosModalExclusao}
        excluirMedicamento={excluirMedicamento}
      />
    );
  }

  if (tela === 'historico') {
    return (
      <TelaHistorico 
        modoOffline={modoOffline}
        setTela={setTela}
        medicamentos={medicamentos}
      />
    );
  }

  if (tela === 'cadastro') {
    return (
      <TelaCadastroRemedio 
        modoOffline={modoOffline}
        setTela={setTela}
        formNome={formNome}
        setFormNome={setFormNome}
        formDosagem={formDosagem}
        setFormDosagem={setFormDosagem}
        formDias={formDias}
        setFormDias={setFormDias}
        formIntervaloHoras={formIntervaloHoras}
        setFormIntervaloHoras={setFormIntervaloHoras}
        formAlertaSonoro={formAlertaSonoro}
        setFormAlertaSonoro={setFormAlertaSonoro}
        formHorarioInicio={formHorarioInicio}
        setFormHorarioInicio={setFormHorarioInicio}
        formHorarioFim={formHorarioFim}
        setFormHorarioFim={setFormHorarioFim}
        salvarMedicamento={salvarMedicamento}
      />
    );
  }

  if (tela === 'calendario') {
    return (
      <TelaCalendario 
        modoOffline={modoOffline}
        setTela={setTela}
        medicamentos={medicamentos}
        dadosModal={dadosModal}
        setDadosModal={setDadosModal}
        confirmarTomarRemedio={confirmarTomarRemedio}
        registros={registros}
        aoClicarDia={aoClicarDia}
      />
    );
  }
}
