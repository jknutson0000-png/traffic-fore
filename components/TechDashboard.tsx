import React, { useState, useEffect } from 'react';
import { TechAnalysis } from '../types';
import { checkTechTrends } from '../services/geminiService';

interface Props {
  onBack: () => void;
}

export const TechDashboard: React.FC<Props> = ({ onBack }) => {
  const [data, setData] = useState<TechAnalysis | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const { data: techData, sources: techSources } = await checkTechTrends();
        setData(techData);
        setSources(techSources);
      } catch (err) {
        setError("Tech Radar Systems Malfunction.");
      } finally {
        setLoading(false);
      }
    };
    fetchTech();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 animate-fade-in font-mono selection:bg-violet-500 selection:text-white">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-violet-900/50 py-4 px-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md shadow-[0_0_20px_rgba(139,92,246,0.1)]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-violet-500 hover:text-violet-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold tracking-widest text-violet-500 uppercase">
            TECH <span className="text-white">RADAR</span>
          </h1>
        </div>
        {data && <div className="text-[10px] text-violet-400 font-mono tracking-wider animate-pulse">SCAN COMPLETE: {data.lastUpdated}</div>}
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="relative">
                <div className="h-20 w-20 border-4 border-slate-800 border-t-violet-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 bg-violet-500 rounded-full animate-ping"></div>
                </div>
            </div>
            <p className="font-mono text-violet-500 animate-pulse tracking-widest uppercase">Scanning Emerging Sectors...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-950 border border-red-800 text-red-500 font-bold text-center">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-10">
            
            {/* SPOTLIGHT */}
            <div className="bg-slate-900 rounded border border-violet-800/50 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                     </svg>
                </div>

                <div className="bg-violet-950/20 p-2 border-b border-violet-900/30 flex justify-between items-center">
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] px-2">INNOVATION SPOTLIGHT</span>
                    <span className="text-[10px] bg-violet-600 text-white px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                        {data.spotlight.maturity}
                    </span>
                </div>

                <div className="p-8 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">{data.spotlight.name}</h2>
                    <p className="text-violet-400 font-mono text-sm uppercase tracking-widest mb-6">{data.spotlight.category} • {data.spotlight.pricePoint}</p>
                    
                    <p className="text-lg text-slate-300 leading-relaxed mb-6 border-l-2 border-violet-500 pl-4">
                        {data.spotlight.description}
                    </p>

                    <div className="bg-violet-900/20 p-4 rounded border border-violet-500/30">
                        <span className="text-[10px] font-bold text-violet-300 uppercase mb-1 block">GENESIS VALUE ADD:</span>
                        <p className="text-slate-200 font-medium italic">"{data.spotlight.benefit}"</p>
                    </div>
                </div>
            </div>

            {/* SECTOR SCAN */}
            <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                    Sector Scan
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                    {data.emerging.map((item, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded hover:border-violet-500/50 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-200 group-hover:text-violet-400 transition-colors text-lg">{item.name}</h4>
                                <span className="text-[10px] border border-slate-700 text-slate-500 px-1.5 py-0.5 rounded uppercase">{item.category}</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-3 line-clamp-2">{item.description}</p>
                            <div className="flex justify-between items-end mt-auto">
                                <span className="text-xs text-violet-500/80 font-medium">{item.benefit}</span>
                                <span className="text-[10px] font-mono text-slate-600">{item.pricePoint}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TALKING POINTS */}
            <div className="bg-slate-900 p-6 rounded border-l-4 border-slate-700">
                <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4">CLIENT BRIEFING NOTES</h3>
                <ul className="space-y-3">
                    {data.talkingPoints.map((point, i) => (
                        <li key={i} className="flex gap-3 text-slate-300 text-sm">
                            <span className="text-violet-500 font-bold">>></span>
                            {point}
                        </li>
                    ))}
                </ul>
            </div>

             {/* Sources */}
             {sources.length > 0 && (
              <div className="border-t border-slate-800 pt-6 opacity-40 hover:opacity-100 transition-opacity">
                 <h4 className="text-[10px] font-black text-slate-600 uppercase mb-2">Intel Sources</h4>
                 <div className="flex flex-wrap gap-2">
                    {sources.map((s, i) => (
                        <a key={i} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:text-violet-500 border border-slate-800 px-2 py-1 rounded hover:border-violet-600 truncate max-w-[200px]">
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
