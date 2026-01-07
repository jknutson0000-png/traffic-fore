import React, { useState, useEffect } from 'react';
import { WeatherAnalysis, WeatherRisk } from '../types';
import { checkWeatherConditions } from '../services/geminiService';

interface Props {
  onBack: () => void;
}

export const WeatherDashboard: React.FC<Props> = ({ onBack }) => {
  const [data, setData] = useState<WeatherAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { data: weatherData } = await checkWeatherConditions();
        setData(weatherData);
      } catch (err) {
        setError("Weather Satellites Offline");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const getRiskColor = (risk: WeatherRisk) => {
    switch (risk) {
      case WeatherRisk.HIGH: return 'text-red-500 border-red-500 bg-red-950/30';
      case WeatherRisk.MEDIUM: return 'text-yellow-500 border-yellow-500 bg-yellow-950/30';
      case WeatherRisk.LOW: return 'text-emerald-500 border-emerald-500 bg-emerald-950/30';
      default: return 'text-slate-500 border-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 animate-fade-in font-mono">
      
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-cyan-900/30 py-4 px-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-cyan-500 hover:text-cyan-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold tracking-widest text-cyan-500 uppercase">
            WEATHER <span className="text-white">RECON</span>
          </h1>
        </div>
        {data && <div className="text-[10px] text-cyan-600 font-mono">UPDATED: {data.lastUpdated}</div>}
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <div className="h-16 w-16 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="font-mono text-cyan-500 animate-pulse tracking-widest">ESTABLISHING UPLINK...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-950 border border-red-800 text-red-500 font-bold text-center">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-6">
            
            {/* Current Conditions Card */}
            <div className="bg-slate-900 border border-cyan-800 p-6 rounded relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                 </svg>
               </div>
               
               <div className="relative z-10">
                 <h2 className="text-4xl md:text-6xl font-black text-white mb-2">{data.currentTemp}</h2>
                 <p className="text-xl text-cyan-400 font-bold uppercase tracking-widest mb-6">{data.currentCondition}</p>
                 
                 <div className="bg-cyan-950/40 p-4 rounded border-l-4 border-cyan-500">
                   <h3 className="text-xs text-cyan-600 font-bold uppercase mb-1">OPERATIONAL SUMMARY</h3>
                   <p className="text-lg text-slate-200 leading-snug">{data.summary}</p>
                 </div>
               </div>
            </div>

            {/* Forecast Grid */}
            <div className="grid gap-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-4">3-DAY FIELD FORECAST</h3>
              
              {data.forecast.map((day, idx) => (
                <div key={idx} className={`p-5 bg-slate-900 border rounded flex flex-col md:flex-row gap-4 justify-between items-start md:items-center ${getRiskColor(day.riskLevel)} border-opacity-30`}>
                  
                  {/* Date & Icon */}
                  <div className="min-w-[100px]">
                    <div className="font-bold text-lg text-slate-200">{day.date}</div>
                    <div className="text-sm opacity-70">{day.condition}</div>
                  </div>

                  {/* Temps & Wind */}
                  <div className="flex gap-6 text-sm font-mono">
                    <div>
                       <span className="block text-[10px] opacity-50 uppercase">Temp</span>
                       <span className="text-slate-200 font-bold">{day.tempHigh} / {day.tempLow}</span>
                    </div>
                    <div>
                       <span className="block text-[10px] opacity-50 uppercase">Precip</span>
                       <span className="text-cyan-400 font-bold">{day.precipChance}</span>
                    </div>
                     <div>
                       <span className="block text-[10px] opacity-50 uppercase">Wind</span>
                       <span className="text-slate-300">{day.windSpeed}</span>
                    </div>
                  </div>

                  {/* Feasibility */}
                  <div className="w-full md:w-auto md:text-right mt-2 md:mt-0">
                    <div className={`inline-block px-3 py-1 rounded text-xs font-black uppercase tracking-wider border ${getRiskColor(day.riskLevel)}`}>
                      RISK: {day.riskLevel}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 italic max-w-[200px] ml-auto">
                      {day.workFeasibility}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
