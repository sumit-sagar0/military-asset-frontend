
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ArrowRightLeft, Target, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { auth, logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER'] },
    { name: 'Purchases', path: '/purchases', icon: ShoppingCart, roles: ['ADMIN', 'LOGISTICS_OFFICER'] },
    { name: 'Transfers', path: '/transfers', icon: ArrowRightLeft, roles: ['ADMIN', 'LOGISTICS_OFFICER'] },
    { name: 'Assignments', path: '/assignments', icon: Target, roles: ['ADMIN', 'BASE_COMMANDER'] },
  ].filter(l => l.roles.includes(auth.role || ''));

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 border-r border-slate-700 shrink-0">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2 text-red-400 mb-1">
          <ShieldCheck size={24}/>
          <h1 className="text-lg font-bold tracking-widest">M.A.M.S</h1>
        </div>
        <p className="text-xs text-slate-400">Military Asset Management</p>
      </div>
      <div className="px-3 py-4 border-b border-slate-700">
        <p className="text-xs text-slate-400 uppercase tracking-wider px-3 mb-1">Logged in as</p>
        <p className="text-sm font-semibold text-white px-3">{auth.name}</p>
        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded ml-3 mt-1 inline-block">{auth.role?.replace('_', ' ')}</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(l => (
          <Link key={l.name} to={l.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${location.pathname === l.path ? 'bg-red-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <l.icon size={18}/> {l.name}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-700">
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all text-sm">
          <LogOut size={18}/> Sign Out
        </button>
      </div>
    </div>
  );
}
