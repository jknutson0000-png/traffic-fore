import React, { useState, useEffect } from 'react';
import { MarketAnalysis } from '../types';
import { checkMarketIntel } from '../services/geminiService';

interface Props {
  onBack: () => void;
}

export const IntelDashboard: React.FC<Props> = ({ onBack }) => {
  const [data, setData] = useState<MarketAnalysis | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const { data: intelData, sources: intelSources } = await checkMarketIntel();
        setData(intelData);
        setSources(intelSources);
      } catch (err) {
        setError("Market Data Unavailable. Comm lines severed.");
      } finally {
        setLoading(false);
      }
    };
    fetchIntel();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 animate-fade-in font-mono">
      
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gold-600/30 py-4 px-4 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-yellow-600 hover:text-yellow-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-yellow-600 uppercase font-serif">
              GENESIS <span className="text-slate-100">INTEL</span>
            </h1>
          </div>
        </div>
        {data && <div className="text-[10px] text-yellow-700 font-mono tracking-wider">SECURE LINK ESTABLISHED</div>}
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="h-16 w-16 border-4 border-slate-800 border-t-yellow-600 rounded-full animate-spin"></div>
            <p className="font-mono text-yellow-600 animate-pulse tracking-widest">GATHERING MARKET INTELLIGENCE...</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-950/20 border border-red-900 text-red-500 font-bold text-center rounded">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-8">
            
            {/* Executive Briefing */}
            <div className="bg-slate-900 p-8 rounded border-l-4 border-yellow-600 shadow-lg">
              <h2 className="text-yellow-600 text-xs font-black uppercase tracking-[0.3em] mb-4">EXECUTIVE BRIEFING</h2>
              <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-serif italic">
                "{data.briefing}"
              </p>
            </div>

            {/* Talking Points */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded">
                    <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Talking Points
                    </h3>
                    <ul className="space-y-4">
                        {data.talkingPoints.map((point, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-300">
                                <span className="text-yellow-600 font-bold">0{i+1}.</span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded">
                     <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Market Indicators
                    </h3>
                    <div className="space-y-4">
                         {data.localDevelopments.slice(0, 2).map((dev, i) => (
                             <div key={i} className="border-b border-slate-800 last:border-0 pb-2 last:pb-0">
                                 <h4 className="text-slate-200 font-bold text-sm truncate">{dev.headline}</h4>
                                 <p className="text-[10px] text-slate-500 uppercase">{dev.source}</p>
                             </div>
                         ))}
                    </div>
                </div>
            </div>

            {/* Deep Dive Grid */}
            <div className="grid gap-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-4">LOCAL & LUXURY INTELLIGENCE</h3>
                
                {[...data.localDevelopments, ...data.luxuryTrends].map((item, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 p-6 rounded hover:bg-slate-900 hover:border-yellow-900 transition-colors group">
                        <div className="flex flex-col md:flex-row justify-between mb-2">
                            <h4 className="text-lg font-bold text-slate-200 group-hover:text-yellow-500 transition-colors">{item.headline}</h4>
                            <span className="text-xs text-slate-600 font-mono mt-1 md:mt-0">{item.source}</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{item.summary}</p>
                        <div className="bg-yellow-900/10 border border-yellow-900/20 p-3 rounded">
                            <span className="text-[10px] font-black text-yellow-700 uppercase tracking-wider block mb-1">RELEVANCE TO GENESIS:</span>
                            <p className="text-xs text-yellow-500/80 italic">{item.relevance}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sources */}
            {sources.length > 0 && (
              <div className="mt-8 border-t border-slate-800 pt-6 opacity-40 hover:opacity-100 transition-opacity">
                 <h4 className="text-[10px] font-black text-slate-600 uppercase mb-2">Verified Sources</h4>
                 <div className="flex flex-wrap gap-2">
                    {sources.map((s, i) => (
                        <a key={i} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:text-yellow-500 border border-slate-800 px-2 py-1 rounded hover:border-yellow-600 truncate max-w-[200px]">
                            {s.web?.title}
                        </a>
                    ))}
                 </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
};
