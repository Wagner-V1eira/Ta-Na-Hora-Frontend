import React from 'react';
import { Trash2, X } from 'lucide-react';

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

export default ModalExclusao;
