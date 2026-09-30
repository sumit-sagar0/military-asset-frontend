import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, ShoppingCart, ArrowLeftRight, Users, LogOut, FileText, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/purchases', icon: ShoppingCart, label: 'Purchases' },
    { to: '/transfers', icon: ArrowLeftRight, label: 'Transfers' },
    { to: '/assignments', icon: Users, label: 'Assignments' },
  ];

  return (
    <nav className="bg-[#1E293B]/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-12">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Shield className="text-cyan-400" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-widest">KRYSTALBALL</h1>
              <span className="text-[10px] font-bold bg-cyan-900/50 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-700/50">MIL-SPEC v2.4</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Military Asset Management & Logistics Tracking System</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-2 bg-[#0F172A]/50 p-1 rounded-lg border border-slate-700/50">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 shadow-[inset_0_-2px_0_rgba(6,182,212,0.8)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Right User Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-[#0F172A]/50 px-4 py-2 rounded-full border border-slate-700/50">
          <UserCircle2 className="text-slate-400" size={20} />
          <div className="text-right">
            <div className="text-xs font-bold text-white uppercase">{auth.name}</div>
            <div className="text-[10px] text-cyan-400 font-medium uppercase tracking-wider">{auth.role.replace('_', ' ')}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2.5 rounded-lg border border-red-500/30 transition-all hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
