
import React, { useState, useEffect } from 'react';
import { TrafficDashboard } from './components/TrafficDashboard';
import { WeatherDashboard } from './components/WeatherDashboard';
import { IntelDashboard } from './components/IntelDashboard';
import { TechDashboard } from './components/TechDashboard';
import { InspectionDashboard } from './components/InspectionDashboard';

type AppMode = 'LAUNCHER' | 'TRAFFIC' | 'WEATHER' | 'INTEL' | 'TECH' | 'INSPECTOR';

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<AppMode>('LAUNCHER');
  const hasApiKey = !!process.env.API_KEY;

  // HANDLE URL ROUTING (DEEP LINKING)
  useEffect(() => {
    // 1. Check URL on initial load
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view')?.toUpperCase();
    const validModes = ['TRAFFIC', 'WEATHER', 'INTEL', 'TECH', 'INSPECTOR'];
    
    if (view && validModes.includes(view)) {
      setCurrentApp(view as AppMode);
    }

    // 2. Handle Browser "Back" Button
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const v = p.get('view')?.toUpperCase();
      if (v && validModes.includes(v)) {
        setCurrentApp(v as AppMode);
      } else {
        setCurrentApp('LAUNCHER');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // NAVIGATION HANDLER
  const navigate = (mode: AppMode) => {
    setCurrentApp(mode);
    const url = new URL(window.location.href);
    
    if (mode === 'LAUNCHER') {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', mode);
    }
    
    // Update URL without reloading page
    window.history.pushState({}, '', url);
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

  // ACTIVE APPS
  if (currentApp === 'TRAFFIC') {
    return <TrafficDashboard onBack={() => navigate('LAUNCHER')} />;
  }

  if (currentApp === 'WEATHER') {
    return <WeatherDashboard onBack={() => navigate('LAUNCHER')} />;
  }

  if (currentApp === 'INTEL') {
    return <IntelDashboard onBack={() => navigate('LAUNCHER')} />;
  }

  if (currentApp === 'TECH') {
    return <TechDashboard onBack={() => navigate('LAUNCHER')} />;
  }

  if (currentApp === 'INSPECTOR') {
    return <InspectionDashboard onBack={() => navigate('LAUNCHER')} />;
  }

  // APP LAUNCHER INTERFACE
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono">
      {/* Launcher Header */}
      <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-black">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-100">
            GENESIS <span className="text-red-600">EXECUTIVE</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">Operational Command • Marietta St NW</p>
        </div>
        <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
      </div>

      {/* Apps Grid */}
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <h2 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-6">Available Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Traffic App Card */}
          <button 
            onClick={() => navigate('TRAFFIC')}
            className="bg-slate-900 border border-slate-800 p-6 rounded-lg text-left hover:border-red-600 hover:bg-slate-800 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div className="w-12 h-12 bg-red-950 border border-red-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-red-500 transition-colors">TRAFFIC COMMAND</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Real-time congestion analysis and misery forecasting.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-red-700">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
              System Active
            </div>
          </button>

          {/* Weather App Card */}
          <button 
            onClick={() => navigate('WEATHER')}
            className="bg-slate-900 border border-slate-800 p-6 rounded-lg text-left hover:border-cyan-500 hover:bg-slate-800 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
            </div>
            <div className="w-12 h-12 bg-cyan-950 border border-cyan-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-cyan-500 transition-colors">WEATHER RECON</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Tactical forecast for field ops. Rain/Wind risk assessment.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-cyan-700">
              <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full animate-ping"></span>
              System Active
            </div>
          </button>

          {/* Intel App Card */}
          <button 
            onClick={() => navigate('INTEL')}
            className="bg-slate-900 border border-slate-800 p-6 rounded-lg text-left hover:border-yellow-600 hover:bg-slate-800 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
            </div>
            <div className="w-12 h-12 bg-yellow-950 border border-yellow-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-yellow-600 transition-colors">MARKET INTEL</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Strategic briefing. Real estate news and luxury trends.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-yellow-700">
              <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full animate-ping"></span>
              System Active
            </div>
          </button>

          {/* Tech Radar App Card */}
          <button 
            onClick={() => navigate('TECH')}
            className="bg-slate-900 border border-slate-800 p-6 rounded-lg text-left hover:border-violet-500 hover:bg-slate-800 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            </div>
            <div className="w-12 h-12 bg-violet-950 border border-violet-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-violet-500 transition-colors">TECH RADAR</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Emerging residential tech. Smart home, energy, materials.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-violet-700">
              <span className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-ping"></span>
              System Active
            </div>
          </button>

          {/* INSPECTION App Card */}
          <button 
            onClick={() => navigate('INSPECTOR')}
            className="bg-slate-900 border border-slate-800 p-6 rounded-lg text-left hover:border-emerald-500 hover:bg-slate-800 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            </div>
            <div className="w-12 h-12 bg-emerald-950 border border-emerald-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-emerald-500 transition-colors">SITE INSPECTOR</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Field checklists, photo capture, and AI report generation.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-emerald-700">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping"></span>
              System Active
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default App;
