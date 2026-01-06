import React from 'react';
import { EventInfo } from '../types';

interface Props {
  events: EventInfo[];
}

export const EventList: React.FC<Props> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="p-8 bg-slate-900 rounded-sm border border-slate-800 flex flex-col items-center text-center">
        <span className="text-4xl mb-2">🤷‍♂️</span>
        <p className="text-slate-500 italic font-mono">
          Shockingly, the streets aren't bleeding today. No major events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest border-b-2 border-slate-800 pb-4">
        THE CULPRITS
      </h3>
      {events.map((evt, idx) => (
        <div key={idx} className="bg-slate-900 p-6 rounded-sm border-l-4 border-amber-600 hover:bg-slate-800 transition-colors group">
          <div className="flex flex-col md:flex-row justify-between items-start mb-2 gap-2">
            <h4 className="font-bold text-xl text-slate-200 group-hover:text-amber-500 transition-colors">{evt.name}</h4>
            <span className="bg-amber-950 text-amber-500 text-xs px-2 py-1 font-mono font-bold uppercase tracking-wider">{evt.time}</span>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{evt.location}</p>
          <p className="text-sm text-slate-300 border-t border-slate-800 pt-3 italic">{evt.impactDescription}</p>
        </div>
      ))}
    </div>
  );
};