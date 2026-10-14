import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, ShieldAlert, FolderLock, PlusCircle, LayoutDashboard } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();

  const tabs = [
    { name: 'Workspace', path: '/omnimind', icon: Compass },
    { name: 'Dossier', path: '/cases/deb3579d-db10-4382-b21c-b550ea6552ec', icon: ShieldAlert },
    { name: 'Cases', path: '/cases', icon: FolderLock },
    { name: 'New Case', path: '/cases/new', icon: PlusCircle },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(`${path}/`));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-xl border-t border-navy-800 px-2 py-1 shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl transition-all ${
                active ? 'text-teal-400 scale-105 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight mt-1">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
