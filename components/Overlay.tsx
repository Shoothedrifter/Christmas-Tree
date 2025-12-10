import React, { useState } from 'react';
import { generateLuxuryGreeting } from '../services/geminiService';
import { Wand2, X, Sparkles } from 'lucide-react';

export const Overlay: React.FC = () => {
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('Classic Royal');
  const [greeting, setGreeting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!process.env.API_KEY) {
        alert("API Key missing. Please set the API_KEY env variable.");
        return;
    }
    setLoading(true);
    const result = await generateLuxuryGreeting(name || 'Dear Guest', theme);
    setGreeting(result);
    setLoading(false);
    setShowForm(false);
  };

  const closeGreeting = () => {
    setGreeting(null);
    setShowForm(false);
  }

  const openForm = () => {
    setGreeting(null);
    setShowForm(true);
  }

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6 z-10">
      
      {/* Header */}
      <header className={`text-center mt-4 transition-opacity duration-500 ${!showForm && !greeting ? 'opacity-80 hover:opacity-100' : 'opacity-100'}`}>
        <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-gold-700 drop-shadow-lg tracking-wider animate-fade-in cursor-default select-none">
          NOEL LUXE
        </h1>
        <p className="text-emerald-300 font-sans tracking-[0.2em] text-xs md:text-sm mt-2 uppercase opacity-80 shadow-black drop-shadow-md">
          Interactive Holiday Experience
        </p>
      </header>

      {/* Main Interaction Area */}
      <div className="pointer-events-auto w-full max-w-md flex flex-col items-center justify-center min-h-[300px]">
        
        {/* Form Card */}
        {showForm && !greeting && (
          <div className="bg-emerald-950/80 backdrop-blur-md border border-gold-500/30 p-8 rounded-lg shadow-2xl transform transition-all hover:border-gold-500/60 animate-fade-in w-full">
            <h2 className="text-gold-100 font-serif text-2xl mb-6 text-center italic">Create Your Royal Greeting</h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-gold-300 text-xs uppercase tracking-widest mb-1">Recipient Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lady Whistledown"
                  className="w-full bg-emerald-900/50 border-b border-gold-700/50 text-gold-100 p-2 focus:outline-none focus:border-gold-400 font-serif placeholder-emerald-700/50 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-gold-300 text-xs uppercase tracking-widest mb-1">Vibe</label>
                <select 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-emerald-900/50 border-b border-gold-700/50 text-gold-100 p-2 focus:outline-none focus:border-gold-400 font-serif"
                >
                  <option>Classic Royal</option>
                  <option>1920s Gatsby</option>
                  <option>Warm & Cozy</option>
                  <option>Magical Winter</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-gold-700 to-gold-500 text-emerald-950 font-bold py-3 px-4 rounded-sm hover:from-gold-400 hover:to-gold-200 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-pulse">Consulting the Scribes...</span>
                ) : (
                  <>
                    <Wand2 size={18} /> Inscribe Greeting
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Result Card */}
        {greeting && (
          <div className="relative animate-fade-in w-full">
             {/* Decorative Background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-700 via-gold-300 to-gold-700 rounded-lg opacity-75 blur"></div>
            
            <div className="relative bg-emerald-900 border-2 border-gold-500 p-8 rounded-lg shadow-[0_0_50px_rgba(255,215,0,0.2)] text-center">
              <button 
                onClick={closeGreeting}
                className="absolute top-2 right-2 text-gold-500 hover:text-white transition-colors"
                title="Close and view tree"
              >
                <X size={20} />
              </button>

              <div className="mb-4">
                 <div className="h-px w-16 bg-gold-500 mx-auto mb-1"></div>
                 <div className="h-px w-8 bg-gold-500 mx-auto"></div>
              </div>

              <p className="text-gold-100 font-serif text-xl md:text-2xl leading-relaxed italic drop-shadow-md">
                "{greeting}"
              </p>

              <div className="mt-6 flex justify-center items-center gap-2">
                 <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500"></div>
                 <span className="text-gold-400 text-xs uppercase tracking-widest">Season's Greetings</span>
                 <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Reopen Form Button (Visible when nothing else is) */}
        {!showForm && !greeting && (
            <button
                onClick={openForm}
                className="group flex items-center gap-2 bg-emerald-950/40 hover:bg-emerald-900/80 backdrop-blur-sm border border-gold-500/20 hover:border-gold-500/50 text-gold-300 px-6 py-3 rounded-full transition-all duration-300 animate-fade-in hover:scale-105 hover:text-gold-100 pointer-events-auto"
            >
                <Sparkles size={16} className="group-hover:animate-spin" />
                <span className="font-serif tracking-widest text-sm uppercase">Create New Greeting</span>
            </button>
        )}

      </div>

      {/* Footer */}
      <footer className="text-gold-500/40 text-xs font-sans tracking-wider mb-2 drop-shadow-md">
        Powered by Gemini 2.5 Flash • Built with React Three Fiber
      </footer>
    </div>
  );
};