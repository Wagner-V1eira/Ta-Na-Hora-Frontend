import React from 'react';
import { WifiOff } from 'lucide-react';

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

export default LayoutBase;
