import React, { useState, useEffect, useCallback } from 'react';
import { TrafficLevel, TrafficAnalysis } from './types';
import { checkTrafficConditions } from './services/geminiService';
import { TrafficIndicator } from './components/TrafficIndicator';
import { EventList } from './components/EventList';

const App: React.FC = () => {
  const [status, setStatus] = useState<TrafficAnalysis | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'LIVE' | 'FORECAST'>('LIVE');

  const fetchTraffic = useCallback(async (mode: 'LIVE' | 'FORECAST') => {
    setLoading(true);
    setError(null);
    try {
      const { data, sources: resultSources } = await checkTrafficConditions(mode);
      setStatus(data);
      setSources(resultSources);
    } catch (err: any) {
      if (err.message?.includes("API_KEY")) {
        setHasApiKey(false);
      } else {
        setError("AI is drunk. Gemini failed to respond.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTraffic('LIVE');
  }, [fetchTraffic]);

  const handleModeChange = (mode: 'LIVE' | 'FORECAST') => {
    if (mode === viewMode) return;
    setViewMode(mode);
    fetchTraffic(mode);
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-slate-800 p-8 rounded-xl border border-red-500 max-w-md text-center">
          <h2 className="text-2xl font-black text-red-600 mb-4 tracking-tighter">SYSTEM FUCKED</h2>
          <p className="text-slate-300 font-mono">
            Missing <code>process.env.API_KEY</code>. Can't see shit without it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-red-900 selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-black border-b border-red-900/30 py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-2xl shadow-red-900/10">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-red-600 italic">
            GENESIS <span className="text-slate-100 not-italic">HELLSCAPE</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">20 Marietta St NW // DOOMSDAY CLOCK</p>
        </div>
        <button 
          onClick={() => fetchTraffic(viewMode)}
          disabled={loading}
          className="bg-red-900/20 hover:bg-red-900/40 text-red-500 hover:text-red-400 px-4 py-2 rounded font-black text-xs md:text-sm border border-red-900/50 transition-all disabled:opacity-50 flex items-center gap-2 uppercase tracking-wider"
        >
          {loading ? (
             <span className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></span>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
          )}
          <span className="hidden md:inline">REROLL FATE</span>
        </button>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        
        {/* Mode Toggles */}
        <div className="grid grid-cols-2 gap-2 mb-8 bg-slate-900 p-1 rounded border border-slate-800">
          <button
            onClick={() => handleModeChange('LIVE')}
            className={`py-3 px-4 font-black uppercase text-xs md:text-sm tracking-widest transition-all ${
              viewMode === 'LIVE' 
                ? 'bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            LIVE HELL
          </button>
          <button
            onClick={() => handleModeChange('FORECAST')}
            className={`py-3 px-4 font-black uppercase text-xs md:text-sm tracking-widest transition-all ${
              viewMode === 'FORECAST' 
                ? 'bg-amber-700 text-white shadow-[0_0_20px_rgba(180,83,9,0.4)]' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            3-DAY DEATH WATCH
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-950 border border-red-600 rounded text-red-500 font-mono text-sm font-bold uppercase tracking-widest">
            FATAL ERROR: {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !status && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className={`h-24 w-24 border-4 border-slate-800 rounded-full animate-spin ${viewMode === 'LIVE' ? 'border-t-red-600' : 'border-t-amber-600'}`}></div>
            <p className={`font-mono animate-pulse font-bold tracking-widest uppercase ${viewMode === 'LIVE' ? 'text-red-600' : 'text-amber-600'}`}>
              {viewMode === 'LIVE' ? 'Scanning Local Misery...' : 'Consulting Dark Prophecies...'}
            </p>
          </div>
        )}

        {/* Content Display */}
        {status && (
          <div className="space-y-8 animate-fade-in">
            
            {viewMode === 'LIVE' ? (
              // LIVE VIEW
              <>
                <TrafficIndicator level={status.level} headline={status.headline} />

                {status.avoidTimes && status.avoidTimes.length > 0 && (
                  <div className="bg-black border border-red-600 p-6 rounded-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-red-600 font-black tracking-[0.2em] uppercase mb-4 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                      SUICIDE HOURS
                    </h3>
                    <div className="flex flex-wrap gap-3 relative z-10">
                      {status.avoidTimes.map((time, idx) => (
                        <span key={idx} className="bg-red-700 text-white font-black px-6 py-3 rounded-sm text-xl shadow-[4px_4px_0px_0px_rgba(50,0,0,1)] transform hover:-translate-y-1 transition-transform cursor-crosshair">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {status.patternNote && (
                  <div className="bg-amber-950/30 border border-amber-600/30 p-4 rounded-sm flex items-start gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-amber-600 font-black uppercase text-xs tracking-widest mb-1">
                        DEJA VU NIGHTMARE
                      </h4>
                      <p className="text-amber-100/80 text-sm font-medium italic">"{status.patternNote}"</p>
                    </div>
                  </div>
                )}

                <div className="bg-slate-900 p-8 rounded-sm border-t-4 border-slate-700 shadow-xl">
                  <h2 className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mb-4">THE DAMAGE REPORT</h2>
                  <p className="text-lg md:text-2xl font-bold leading-relaxed text-slate-200">{status.summary}</p>
                </div>

                <EventList events={status.events} />
              </>
            ) : (
              // FORECAST VIEW
              <div className="space-y-8">
                 <div className="bg-amber-950/20 border-l-4 border-amber-600 p-6 rounded-r-lg">
                    <h2 className="text-amber-600 text-xs font-black uppercase tracking-[0.3em] mb-2">FUTURE OUTLOOK</h2>
                    <p className="text-xl font-bold text-amber-100">{status.summary}</p>
                 </div>

                 <div className="grid gap-6">
                    {status.forecast?.map((day, idx) => (
                       <div key={idx} className={`p-6 border-2 rounded-sm relative overflow-hidden transition-all hover:scale-[1.01] ${
                          day.level === TrafficLevel.RED 
                            ? 'bg-red-950/30 border-red-800' 
                            : day.level === TrafficLevel.YELLOW 
                              ? 'bg-yellow-950/30 border-yellow-800'
                              : 'bg-emerald-950/30 border-emerald-800'
                       }`}>
                          <div className="flex justify-between items-start mb-4 relative z-10">
                             <div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-100">{day.dayName}</h3>
                                <span className="text-xs font-mono text-slate-500">{day.date}</span>
                             </div>
                             <div className={`px-3 py-1 text-xs font-black uppercase tracking-widest border ${
                                day.level === TrafficLevel.RED ? 'bg-red-600 text-white border-red-400' :
                                day.level === TrafficLevel.YELLOW ? 'bg-yellow-600 text-black border-yellow-400' :
                                'bg-emerald-600 text-white border-emerald-400'
                             }`}>
                                {day.level}
                             </div>
                          </div>
                          
                          <h4 className={`text-xl font-bold mb-2 relative z-10 ${
                             day.level === TrafficLevel.RED ? 'text-red-400' : 
                             day.level === TrafficLevel.YELLOW ? 'text-yellow-400' : 'text-emerald-400'
                          }`}>
                             "{day.headline}"
                          </h4>
                          
                          <p className="text-slate-300 text-sm mb-4 italic relative z-10">{day.summary}</p>
                          
                          {day.events.length > 0 && (
                             <div className="bg-black/30 p-3 rounded text-xs relative z-10">
                                <p className="font-bold text-slate-500 uppercase tracking-wider mb-2">Incoming Threats:</p>
                                <ul className="space-y-1">
                                   {day.events.map((e, i) => (
                                      <li key={i} className="flex justify-between text-slate-400">
                                         <span>• {e.name}</span>
                                         <span className="text-slate-600">{e.time}</span>
                                      </li>
                                   ))}
                                </ul>
                             </div>
                          )}

                          {/* Watermark Icon */}
                          <div className="absolute -bottom-4 -right-4 opacity-10 pointer-events-none">
                             {day.level === TrafficLevel.RED ? (
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 13a1 1 0 112 0v2a1 1 0 11-2 0v-2zm0-8a1 1 0 00-1 1v6a1 1 0 102 0V6a1 1 0 00-1-1z" /></svg>
                             ) : (
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" /></svg>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {/* Sources / Grounding */}
            {sources.length > 0 && (
              <div className="mt-12 border-t border-slate-800 pt-8 opacity-50 hover:opacity-100 transition-opacity">
                <h4 className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-widest">Sources of Misery</h4>
                <ul className="space-y-2">
                  {sources.map((chunk, i) => {
                     const uri = chunk.web?.uri;
                     const title = chunk.web?.title || uri;
                     if (!uri) return null;
                     
                     return (
                      <li key={i}>
                        <a 
                          href={uri} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs text-slate-500 hover:text-red-500 truncate block font-mono hover:underline"
                        >
                          > {title}
                        </a>
                      </li>
                     );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;