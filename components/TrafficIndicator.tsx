import React from 'react';
import { TrafficLevel } from '../types';

interface Props {
  level: TrafficLevel;
  headline: string;
}

export const TrafficIndicator: React.FC<Props> = ({ level, headline }) => {
  const getColorClasses = () => {
    switch (level) {
      case TrafficLevel.RED:
        return 'bg-gradient-to-b from-red-950 to-black border-red-600 shadow-[0_0_100px_rgba(220,38,38,0.3)]';
      case TrafficLevel.YELLOW:
        return 'bg-yellow-950 border-yellow-600 text-slate-200';
      case TrafficLevel.GREEN:
        return 'bg-emerald-950 border-emerald-600 text-emerald-100';
      default:
        return 'bg-slate-900 border-slate-700';
    }
  };

  const getIcon = () => {
    switch (level) {
      case TrafficLevel.RED:
        return (
          <div className="relative">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 mb-6 text-red-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
             <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20"></div>
          </div>
        );
      case TrafficLevel.YELLOW:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 mb-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case TrafficLevel.GREEN:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 mb-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getSubtext = () => {
     if (level === TrafficLevel.RED) return "TOTAL CLUSTERFUCK";
     if (level === TrafficLevel.YELLOW) return "PRETTY SHITTY";
     return "SUSPICIOUSLY CLEAR";
  }

  return (
    <div className={`w-full flex flex-col items-center justify-center py-16 rounded-sm border-2 ${getColorClasses()} transition-all duration-500 relative overflow-hidden`}>
      {/* Background Noise Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
      
      {getIcon()}
      <h1 className="text-4xl md:text-7xl font-black text-center uppercase tracking-tighter px-4 leading-none mb-4 font-sans">
        {headline}
      </h1>
      <div className={`px-4 py-1 rounded-full text-xs font-black tracking-[0.3em] uppercase border ${level === TrafficLevel.RED ? 'border-red-600 text-red-500' : 'border-slate-600 text-slate-400'}`}>
        STATUS: {getSubtext()}
      </div>
    </div>
  );
};