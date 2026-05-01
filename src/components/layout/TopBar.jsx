import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, MonitorPlay, BarChart3, Settings } from 'lucide-react';

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/pos', icon: <UtensilsCrossed size={20} />, label: 'POS' },
    { path: '/tables', icon: <LayoutDashboard size={20} />, label: 'Tables' },
    { path: '/kitchen', icon: <MonitorPlay size={20} />, label: 'Kitchen' },
    { path: '/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="bg-pos-card border-b border-pos-surface h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-pos-accent rounded flex items-center justify-center text-pos-bg font-display font-bold">BL</div>
        <span className="font-display font-semibold text-lg tracking-wide hidden md:block">BLIM POS</span>
      </div>
      
      <div className="flex bg-pos-surface rounded-full p-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-pos-card text-pos-accent shadow-sm' 
                  : 'text-pos-text-muted hover:text-pos-text'
              }`}
            >
              {item.icon}
              <span className="hidden lg:block">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium">Bima</div>
          <div className="text-xs text-pos-text-muted">Manager</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-pos-surface flex items-center justify-center border border-pos-accent-muted">
          👤
        </div>
      </div>
    </div>
  );
}
