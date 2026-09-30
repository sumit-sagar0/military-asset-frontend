import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Package, TrendingUp, TrendingDown, Layers, ArrowRightLeft, Target, ShieldAlert, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const { auth } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseId = auth.role !== 'ADMIN' && auth.baseId ? `?baseId=${auth.baseId}` : '';
      const [statsData, invData] = await Promise.all([
        api.get(`/dashboard${baseId}`),
        api.get(`/inventory${baseId}`),
      ]);
      setStats(statsData);
      setInventory(invData);
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-cyan-500 font-mono animate-pulse">Establishing Secure Uplink...</div>;
  }
  if (!stats) return <p className="text-red-500 font-mono">CONNECTION FAILED: Backend Offline.</p>;

  const pieData = [
    { name: 'Purchases', value: stats.totalPurchases || 1 },
    { name: 'Transfers In', value: stats.totalTransferIn || 1 },
    { name: 'Transfers Out', value: stats.totalTransferOut || 1 },
    { name: 'Expended', value: stats.totalExpended || 1 }
  ];
  const PIE_COLORS = ['#10B981', '#06B6D4', '#F59E0B', '#EF4444'];

  const categoryMap = new Map();
  inventory.forEach(inv => {
    const cat = inv.asset?.category?.name || 'Unknown';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + inv.quantity);
  });
  const barData = Array.from(categoryMap, ([name, value]) => ({ name, value }));

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Tactical Filters */}
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-4 shadow-lg flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400 border-r border-slate-700 pr-6">
          <Target size={18} className="text-cyan-400" />
          <span className="text-xs font-bold tracking-widest uppercase">Tactical Filters</span>
        </div>
        <div className="flex gap-4">
           <select className="bg-[#0F172A] border border-slate-700 text-slate-300 text-sm rounded-lg px-4 py-2 focus:ring-1 focus:ring-cyan-500 outline-none w-64 appearance-none">
             <option>All Bases (Global View)</option>
             {auth.baseId && <option>Current Assigned Base</option>}
           </select>
           <select className="bg-[#0F172A] border border-slate-700 text-slate-300 text-sm rounded-lg px-4 py-2 focus:ring-1 focus:ring-cyan-500 outline-none w-64 appearance-none">
             <option>All Equipment Categories</option>
           </select>
        </div>
        <div className="ml-auto flex bg-[#0F172A] rounded-lg border border-slate-700 p-1">
          <button className="px-4 py-1.5 text-xs font-bold bg-cyan-500/20 text-cyan-400 rounded-md">All Time</button>
          <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors">Last 30 Days</button>
          <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors">Last 7 Days</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Layers size={64}/></div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between mb-2">
            Opening Balance <div className="bg-blue-500/20 p-1.5 rounded"><Layers size={14} className="text-blue-400"/></div>
          </h3>
          <p className="text-4xl font-light text-white mb-1 font-mono">1,000</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Initial stock baseline</p>
        </div>
        {/* Card 2 */}
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ArrowDownToLine size={64}/></div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between mb-2">
            Purchases <div className="bg-green-500/20 p-1.5 rounded"><ArrowDownToLine size={14} className="text-green-400"/></div>
          </h3>
          <p className="text-4xl font-light text-green-400 mb-1 font-mono">+{stats.totalPurchases}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total acquisitions</p>
        </div>
        {/* Card 3 */}
        <div className="bg-[#1E293B] border border-cyan-500/30 rounded-xl p-5 shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ArrowRightLeft size={64}/></div>
          <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center justify-between mb-2">
            Net Movement <div className="bg-cyan-500/20 p-1.5 rounded"><ArrowRightLeft size={14} className="text-cyan-400"/></div>
          </h3>
          <p className="text-4xl font-light text-cyan-300 mb-1 font-mono">{stats.netMovement > 0 ? '+' : ''}{stats.netMovement}</p>
          <p className="text-[10px] text-cyan-700 uppercase tracking-wider">Purchases + Transfers In - Out</p>
        </div>
        {/* Card 4 */}
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><ShieldAlert size={64}/></div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between mb-2">
            Assigned / Expended <div className="bg-orange-500/20 p-1.5 rounded"><ShieldAlert size={14} className="text-orange-400"/></div>
          </h3>
          <p className="text-4xl font-light text-orange-400 mb-1 font-mono">{stats.totalAssigned + stats.totalExpended}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Active personnel assignments</p>
        </div>
        {/* Card 5 */}
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Package size={64}/></div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between mb-2">
            Closing Balance <div className="bg-emerald-500/20 p-1.5 rounded"><Package size={14} className="text-emerald-400"/></div>
          </h3>
          <p className="text-4xl font-bold text-white mb-1 font-mono">{stats.closingBalance}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Net available inventory</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-6 shadow-lg">
          <h3 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-cyan-500"/> Inventory Distribution by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#334155', opacity: 0.4}} contentStyle={{backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="text-sm font-bold text-slate-200 mb-6 flex items-center gap-2">
            <TrendingDown size={16} className="text-yellow-500"/> Logistics Net Flow Component Ratio
          </h3>
          <div className="flex-1 flex items-center">
            <div className="w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col gap-3">
               {pieData.map((item, index) => (
                 <div key={item.name} className="flex items-center justify-between bg-[#0F172A] p-3 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                      <span className="text-xs font-semibold text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-mono font-bold" style={{ color: PIE_COLORS[index % PIE_COLORS.length] }}>
                      {item.value}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
