import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

export default function Layout() {
  return (
    <div className="h-screen w-full flex flex-col bg-pos-bg overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
}
