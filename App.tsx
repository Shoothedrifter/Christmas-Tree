import React, { Suspense } from 'react';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';

const App: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#011c16] via-[#022c22] to-[#00100d] relative overflow-hidden">
      
      {/* Background Gradient Mesh (Visual fallback or enhancement) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent opacity-50 pointer-events-none"></div>
      
      {/* UI Overlay */}
      <Overlay />

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full text-gold-500 font-serif animate-pulse text-xl">
            Loading Luxury...
          </div>
        }>
          <Scene />
        </Suspense>
      </div>
    </div>
  );
};

export default App;