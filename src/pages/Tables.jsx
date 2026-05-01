import React, { useEffect, useState } from 'react';
import { useTableStore } from '../store/useTableStore';
import { useNavigate } from 'react-router-dom';

export default function Tables() {
  const { tables, fetchTables, isLoading } = useTableStore();
  const [activeZone, setActiveZone] = useState('Indoor');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  if (isLoading) return <div className="flex h-full items-center justify-center">Loading...</div>;

  const zones = [...new Set(tables.map(t => t.zone))];
  if (!zones.includes('Indoor')) zones.unshift('Indoor');

  const displayedTables = tables.filter(t => t.zone === activeZone);

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-pos-surface border-pos-surface text-pos-text hover:border-pos-accent';
      case 'occupied': return 'bg-pos-accent bg-opacity-20 border-pos-accent text-pos-accent';
      case 'dirty': return 'bg-pos-text-muted bg-opacity-20 border-pos-text-muted text-pos-text-muted';
      default: return 'bg-pos-surface border-pos-surface';
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Floor Plan</h1>
          <div className="text-pos-text-muted">
             {tables.filter(t => t.status === 'occupied').length} / {tables.length} Occupied
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-pos-surface rounded-card font-medium text-pos-text hover:bg-opacity-80 transition-all">+ Takeaway</button>
          <button className="px-4 py-2 bg-pos-accent rounded-card font-medium text-pos-bg hover:bg-opacity-90 transition-all">+ Bar Tab</button>
        </div>
      </header>

      {/* Zones */}
      <div className="flex gap-4 mb-8 border-b border-pos-surface pb-2">
        {zones.map(zone => (
          <button
            key={zone}
            onClick={() => setActiveZone(zone)}
            className={`pb-2 px-2 border-b-2 font-medium transition-all ${activeZone === zone ? 'border-pos-accent text-pos-accent' : 'border-transparent text-pos-text-muted hover:text-pos-text'}`}
          >
            {zone}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 xl:gap-6 overflow-y-auto pb-10 content-start flex-1">
        {displayedTables.map(table => (
          <div 
            key={table.id}
            onClick={() => navigate('/pos')}
            className={`aspect-square rounded-card border-2 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 shadow-pos ${getStatusColor(table.status)}`}
          >
            <div className="font-display text-2xl font-bold mb-1">{table.name}</div>
            <div className="text-xs uppercase tracking-wide opacity-80">{table.status}</div>
            <div className="text-xs mt-2 opacity-60 flex items-center gap-1">
               <span className="w-2 h-2 rounded-full border border-current opacity-50"></span> {table.capacity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
