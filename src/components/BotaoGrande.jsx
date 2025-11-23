import React from 'react';

const BotaoGrande = ({ aoClicar, icone: Icone, rotulo, classeCor }) => (
  <button
    onClick={aoClicar}
    className={`
      w-full p-5 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 sm:gap-4
      transition-transform transform active:scale-95 touch-manipulation border-4 border-transparent
      ${classeCor}
    `}
  >
    {Icone && <Icone size={40} strokeWidth={2} className="sm:w-14 sm:h-14" />} 
    <span className="text-xl sm:text-3xl font-black text-center leading-tight">{rotulo}</span>
  </button>
);

export default BotaoGrande;
