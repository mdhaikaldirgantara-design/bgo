import React from 'react';

export default function Settings() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <h1 className="text-3xl font-display font-semibold mb-6">Settings</h1>
      <div className="grid gap-4 max-w-2xl">
        <div className="bg-pos-card p-6 rounded-card border border-pos-surface">
          <h2 className="text-xl font-medium mb-4">Database</h2>
          <button 
            className="px-6 py-3 bg-pos-surface hover:bg-opacity-80 rounded-std font-medium transition-all mr-4"
          >
            Export Backup (JSON)
          </button>
          <button 
            className="px-6 py-3 bg-pos-error text-white hover:bg-opacity-90 rounded-std font-medium transition-all"
            onClick={() => {
               if(window.confirm("Are you sure? This will delete all data!")) {
                 indexedDB.deleteDatabase('BarRestoPOS');
                 window.location.reload();
               }
            }}
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
