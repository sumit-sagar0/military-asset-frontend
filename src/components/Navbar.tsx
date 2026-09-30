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
    { to: '/', icon: LayoutDashboard, label: 'Command Center' },
    { to: '/purchases', icon: ShoppingCart, label: 'Procurement' },
    { to: '/transfers', icon: ArrowLeftRight, label: 'Deployments' },
    { to: '/assignments', icon: Users, label: 'Field Issues' },
  ];

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-16">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/30">
            <Shield className="text-amber-500" size={28} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-widest uppercase">VANGUARD</h1>
              <span className="text-[10px] font-bold bg-rose-900/40 text-rose-400 px-2 py-0.5 rounded-sm border border-rose-800">OP-CENTER</span>
            </div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-0.5 font-semibold">Strategic Asset & Logistics Matrix</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`
              }
            >
              <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Right User Profile */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-xs font-black text-white uppercase tracking-wider">{auth.name}</div>
            <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">{auth.role.replace('_', ' ')}</div>
          </div>
          <UserCircle2 className="text-zinc-400" size={32} />
        </div>
        <div className="h-8 w-px bg-zinc-800"></div>
        <button
          onClick={handleLogout}
          className="text-zinc-400 hover:text-rose-500 transition-colors"
          title="Secure Logout"
        >
          <LogOut size={24} />
        </button>
      </div>
    </nav>
  );
}
