import React, { useEffect, useState } from 'react';
import { db } from '../db/db';

export default function Reports() {
  const [stats, setStats] = useState({ totalSales: 0, transactions: 0 });

  useEffect(() => {
    db.transactions.toArray().then(txs => {
      const totalSales = txs.reduce((sum, t) => sum + t.total, 0);
      setStats({ totalSales, transactions: txs.length });
    });
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h1 className="text-3xl font-display font-semibold mb-6">Daily Reports</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-pos-card p-6 rounded-card border border-pos-surface">
          <div className="text-pos-text-muted mb-2">Total Sales</div>
          <div className="text-4xl font-display font-bold text-pos-accent">{formatCurrency(stats.totalSales)}</div>
        </div>
        <div className="bg-pos-card p-6 rounded-card border border-pos-surface">
          <div className="text-pos-text-muted mb-2">Transactions</div>
          <div className="text-4xl font-display font-bold">{stats.transactions}</div>
        </div>
      </div>
    </div>
  );
}
