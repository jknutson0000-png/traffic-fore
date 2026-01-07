
import React, { useState } from 'react';
import { InspectionItem, InspectionStatus } from '../types';
import { generateInspectionSummary } from '../services/geminiService';

interface Props {
  onBack: () => void;
}

const CATEGORIES = {
  "EXTERIOR / GROUNDS": [
    "Grading: Does ground slope away from foundation?",
    "Drainage: No standing water or erosion?",
    "Siding: Is there 6-inch clearance from soil?",
    "Gutters: Are they clean and directing water away?",
    "Decks/Porches: Are railings secure (no rot)?",
    "Driveways: Pitched away from house?"
  ],
  "STRUCTURE / FOUNDATION": [
    "Foundation: Any major vertical or stair-step cracks?",
    "Walls: Are sides bowed or leaning?",
    "Framing: Any visible sagging or insect damage?",
    "Windows/Doors: Are frames square (not sticking)?"
  ],
  "ROOF / ATTIC": [
    "Shingles: Are they flat and intact (no curling)?",
    "Flashings: Sealed around chimneys/vents?",
    "Insulation: Is depth adequate/consistent?",
    "Ventilation: Are soffit/ridge vents clear?",
    "Leaks: Any visible daylight or water stains?"
  ],
  "ELECTRICAL": [
    "Service: Is the system properly grounded?",
    "Panel: Are all breakers labeled? No open slots?",
    "Safety: Do GFCI/AFCI outlets trip correctly?",
    "Wiring: No exposed 'handyman' splices?",
    "Detectors: Are Smoke/CO alarms present & active?"
  ],
  "PLUMBING": [
    "Supply: Functional flow/pressure at all fixtures?",
    "Heater: Is TPR valve present & venting properly?",
    "Drainage: Do sinks/tubs drain quickly (no gurgle)?",
    "Leaks: Any active drips or rust stains under sinks?"
  ],
  "HVAC": [
    "Operation: Heating/Cooling responds to thermostat?",
    "Filter: Is it clean and sized correctly?",
    "Ducts: Any visible rust or crushed lines?",
    "Safety: No combustion odors or backdrafting?"
  ],
  "INTERIOR": [
    "Walls/Ceilings: Any active water stains/cracks?",
    "Floors: Stable, level, no soft spots?",
    "Windows: Do they latch and seal (egress compliant)?",
    "Stairs: Handrails secure? Baluster spacing safe?"
  ],
  "CRAWLSPACE / BASEMENT": [
    "Moisture: Any standing water or moldy smells?",
    "Foundation: No efflorescence (white powder)?",
    "Pests: Any evidence of termites or rodents?",
    "Vapor Barrier: Is ground covered properly?"
  ]
};

// Helper to create initial state
const createInitialState = (): InspectionItem[] => {
  const items: InspectionItem[] = [];
  Object.entries(CATEGORIES).forEach(([category, labels]) => {
    labels.forEach(label => {
      items.push({
        id: `${category}-${label}`,
        category,
        label,
        status: 'N/A',
        notes: '',
      });
    });
  });
  return items;
};

export const InspectionDashboard: React.FC<Props> = ({ onBack }) => {
  const [items, setItems] = useState<InspectionItem[]>(createInitialState());
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('EXTERIOR / GROUNDS');
  const [mode, setMode] = useState<'EDIT' | 'REPORT'>('EDIT');
  const [summary, setSummary] = useState('');
  const [generating, setGenerating] = useState(false);

  // Handle status toggle
  const cycleStatus = (id: string, current: InspectionStatus) => {
    const order: InspectionStatus[] = ['N/A', 'PASS', 'FLAG', 'FAIL'];
    const next = order[(order.indexOf(current) + 1) % order.length];
    
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: next } : item
    ));
  };

  // Handle Note Change
  const updateNote = (id: string, note: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, notes: note } : item
    ));
  };

  // Handle Image Upload (Simple Base64)
  const handlePhotoUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItems(prev => prev.map(item => 
          item.id === id ? { ...item, photo: reader.result as string } : item
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateReport = async () => {
    setGenerating(true);
    setMode('REPORT');
    const genSummary = await generateInspectionSummary(items);
    setSummary(genSummary);
    setGenerating(false);
  };

  const categories = Object.keys(CATEGORIES);

  // --- REPORT VIEW (PRINTABLE) ---
  if (mode === 'REPORT') {
    return (
      <div className="min-h-screen bg-white text-black p-8 font-sans">
        {/* Print Controls - Hidden when printing */}
        <div className="fixed top-0 left-0 w-full bg-slate-900 p-4 flex justify-between items-center print:hidden shadow-lg z-50">
          <button onClick={() => setMode('EDIT')} className="text-white font-bold hover:text-slate-300">
             ← BACK TO EDIT
          </button>
          <div className="flex gap-4">
             <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold">
                PRINT / SAVE PDF
             </button>
          </div>
        </div>

        {/* The Actual Report */}
        <div className="max-w-4xl mx-auto mt-16 print:mt-0">
          
          {/* Header */}
          <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">GENESIS EXECUTIVE</h1>
              <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">Home Services Inspection Report</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl">{clientName || "Client Name"}</p>
              <p className="text-slate-600">{address || "Property Address"}</p>
              <p className="text-slate-400 text-sm mt-1">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-slate-50 p-6 rounded border border-slate-200 mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Executive Summary</h2>
            {generating ? (
                <p className="animate-pulse text-slate-500">Generating professional summary...</p>
            ) : (
                <p className="leading-relaxed text-slate-800 font-medium">{summary}</p>
            )}
          </div>

          {/* Findings Grid */}
          <div className="space-y-8">
            {categories.map(cat => {
              const catItems = items.filter(i => i.category === cat && i.status !== 'N/A');
              if (catItems.length === 0) return null;

              return (
                <div key={cat} className="break-inside-avoid">
                   <h3 className="bg-slate-900 text-white px-4 py-2 font-bold uppercase tracking-widest mb-4">{cat}</h3>
                   <div className="grid gap-6">
                      {catItems.map(item => (
                        <div key={item.id} className="border-b border-slate-200 pb-4 last:border-0">
                           <div className="flex justify-between items-start mb-2 gap-4">
                              <h4 className="font-bold text-lg leading-tight w-2/3">{item.label}</h4>
                              <span className={`px-3 py-1 text-xs font-black uppercase rounded whitespace-nowrap ${
                                item.status === 'PASS' ? 'bg-green-100 text-green-800 border border-green-200' :
                                item.status === 'FLAG' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {item.status}
                              </span>
                           </div>
                           
                           {item.notes && <p className="text-slate-700 italic mb-3">"{item.notes}"</p>}
                           
                           {item.photo && (
                              <img src={item.photo} alt={item.label} className="w-48 h-32 object-cover rounded border border-slate-300 shadow-sm" />
                           )}
                        </div>
                      ))}
                   </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs font-mono">
            Generated by GENESIS EXECUTIVE SYSTEM • {new Date().toLocaleTimeString()}
          </div>

        </div>
      </div>
    );
  }

  // --- EDIT VIEW (APP) ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 font-mono">
      
      {/* Header */}
      <header className="bg-black border-b border-emerald-900/30 py-4 px-4 sticky top-0 z-50 flex justify-between items-center">
         <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-emerald-500 hover:text-emerald-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold tracking-widest text-emerald-500 uppercase">
            SITE <span className="text-white">INSPECTOR</span>
          </h1>
        </div>
        <button 
           onClick={generateReport}
           className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded uppercase tracking-wider"
        >
           Generate
        </button>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        
        {/* Client Info */}
        <div className="bg-slate-900 p-4 rounded mb-6 border border-slate-800">
           <input 
              type="text" 
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 mb-2 text-white placeholder-slate-600 focus:border-emerald-500 outline-none"
           />
           <input 
              type="text" 
              placeholder="Property Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white placeholder-slate-600 focus:border-emerald-500 outline-none"
           />
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
           {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded font-bold uppercase text-xs whitespace-nowrap transition-colors ${
                   activeCategory === cat 
                   ? 'bg-emerald-600 text-white' 
                   : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                }`}
              >
                 {cat.split(' ')[0]} {/* Show short name in tab */}
              </button>
           ))}
        </div>

        {/* Category Header */}
        <h2 className="text-emerald-500 font-black uppercase tracking-widest text-sm mb-4 border-b border-emerald-900/50 pb-2">
            {activeCategory}
        </h2>

        {/* Items List */}
        <div className="space-y-4">
           {items.filter(i => i.category === activeCategory).map(item => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded p-4 shadow-lg">
                 
                 <div className="flex flex-col gap-4">
                    {/* Question Text */}
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-md text-slate-200 leading-snug w-3/4">{item.label}</h3>
                        <div className={`w-3 h-3 rounded-full mt-1 ${
                            item.status === 'PASS' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                            item.status === 'FLAG' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' :
                            item.status === 'FAIL' ? 'bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]' :
                            'bg-slate-700'
                        }`}></div>
                    </div>

                    {/* Status Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                         {['N/A', 'PASS', 'FLAG', 'FAIL'].map((statusOption) => (
                             <button
                                key={statusOption}
                                onClick={() => {
                                    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: statusOption as InspectionStatus } : i));
                                }}
                                className={`py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                                    item.status === statusOption
                                    ? statusOption === 'PASS' ? 'bg-emerald-600 text-white'
                                    : statusOption === 'FLAG' ? 'bg-yellow-600 text-black'
                                    : statusOption === 'FAIL' ? 'bg-red-600 text-white'
                                    : 'bg-slate-600 text-white'
                                    : 'bg-slate-950 text-slate-600 border border-slate-800 hover:border-slate-600'
                                }`}
                             >
                                 {statusOption}
                             </button>
                         ))}
                    </div>
                 </div>

                 {/* Expansion Area (Only if touched/Status set) */}
                 {item.status !== 'N/A' && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-fade-in">
                       <textarea 
                          placeholder="Dictate notes here..."
                          value={item.notes}
                          onChange={(e) => updateNote(item.id, e.target.value)}
                          className="w-full bg-black border border-slate-700 rounded p-3 text-sm text-slate-300 focus:border-emerald-500 outline-none min-h-[60px]"
                       />
                       
                       <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-xs text-emerald-500 cursor-pointer hover:text-emerald-400 uppercase font-bold tracking-wider bg-emerald-950/30 px-3 py-2 rounded border border-emerald-900/50">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                             </svg>
                             {item.photo ? 'Retake Photo' : 'Add Photo'}
                             <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(item.id, e)} />
                          </label>
                          
                          {item.photo && (
                             <div className="h-12 w-12 rounded overflow-hidden border border-slate-600">
                                <img src={item.photo} alt="Thumbnail" className="h-full w-full object-cover" />
                             </div>
                          )}
                       </div>
                    </div>
                 )}
              </div>
           ))}
        </div>

      </main>
    </div>
  );
};
