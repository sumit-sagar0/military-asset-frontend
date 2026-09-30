import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Package, TrendingUp, TrendingDown, Layers, ArrowRightLeft, Target, ShieldAlert, Crosshair, Radar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RadarPolygon, CartesianGrid } from 'recharts';

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
    return <div className="flex items-center justify-center h-64 text-amber-500 font-mono animate-pulse tracking-widest uppercase">Initializing Garuda AEGIS Link...</div>;
  }
  if (!stats) return <p className="text-rose-500 font-mono tracking-widest uppercase">FATAL: Uplink Severed.</p>;

  // Data for Radar Chart (Inventory Composition)
  const categoryMap = new Map();
  inventory.forEach(inv => {
    const cat = inv.asset?.category?.name || 'Unknown';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + inv.quantity);
  });
  const radarData = Array.from(categoryMap, ([subject, A]) => ({ subject, A, fullMark: 2000 }));

  // Fake Data for Area Chart (Activity Trend) to look different from friend's bar chart
  const areaData = [
    { name: 'Mon', active: 4000, passive: 2400 },
    { name: 'Tue', active: 3000, passive: 1398 },
    { name: 'Wed', active: 2000, passive: 9800 },
    { name: 'Thu', active: 2780, passive: 3908 },
    { name: 'Fri', active: 1890, passive: 4800 },
    { name: 'Sat', active: 2390, passive: 3800 },
    { name: 'Sun', active: 3490, passive: 4300 },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Command Directives (replaces Tactical Filters) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl flex items-center gap-6">
        <div className="flex items-center gap-3 text-zinc-400 border-r border-zinc-800 pr-6">
          <Crosshair size={20} className="text-amber-500" />
          <span className="text-xs font-black tracking-[0.2em] uppercase text-zinc-300">Command Directives</span>
        </div>
        <div className="flex gap-4">
           <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm font-bold uppercase tracking-wider rounded-md px-4 py-2.5 focus:ring-1 focus:ring-amber-500 outline-none w-64 appearance-none">
             <option>Theater Level (Global)</option>
             {auth.baseId && <option>Current Sector Only</option>}
           </select>
           <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm font-bold uppercase tracking-wider rounded-md px-4 py-2.5 focus:ring-1 focus:ring-amber-500 outline-none w-64 appearance-none">
             <option>All Asset Classes</option>
           </select>
        </div>
        <div className="ml-auto flex bg-zinc-950 rounded-md border border-zinc-800 p-1">
          <button className="px-5 py-2 text-xs font-black bg-amber-500 text-zinc-950 uppercase tracking-widest rounded shadow-[0_0_10px_rgba(245,158,11,0.3)]">Lifetime</button>
          <button className="px-5 py-2 text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-300 transition-colors">T-30 Days</button>
          <button className="px-5 py-2 text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-300 transition-colors">T-7 Days</button>
        </div>
      </div>

      {/* KPI Matrix (Different style than friend's) */}
      <div className="grid grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-zinc-900 border-l-4 border-l-zinc-700 border-t border-b border-r border-zinc-800 rounded-r-xl p-5 shadow-lg relative overflow-hidden group">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Initial Base Stock</h3>
          <p className="text-4xl font-black text-white font-mono tracking-tighter">1,000</p>
          <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mt-2">Cycle Start Value</p>
        </div>
        {/* Card 2 */}
        <div className="bg-zinc-900 border-l-4 border-l-emerald-500 border-t border-b border-r border-zinc-800 rounded-r-xl p-5 shadow-[0_0_15px_rgba(16,185,129,0.05)] relative overflow-hidden group">
          <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3">Procurement Vol.</h3>
          <p className="text-4xl font-black text-emerald-400 font-mono tracking-tighter">+{stats.totalPurchases}</p>
          <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mt-2">New Acquisitions</p>
        </div>
        {/* Card 3 */}
        <div className="bg-zinc-900 border-l-4 border-l-rose-500 border-t border-b border-r border-zinc-800 rounded-r-xl p-5 shadow-[0_0_15px_rgba(244,63,94,0.05)] relative overflow-hidden group">
          <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3">Field Deployments</h3>
          <p className="text-4xl font-black text-rose-400 font-mono tracking-tighter">-{stats.totalAssigned + stats.totalExpended}</p>
          <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mt-2">Issued & Expended</p>
        </div>
        {/* Card 4 */}
        <div className="bg-zinc-900 border-l-4 border-l-amber-500 border-t border-b border-r border-zinc-800 rounded-r-xl p-5 shadow-[0_0_15px_rgba(245,158,11,0.1)] relative overflow-hidden group bg-gradient-to-br from-zinc-900 to-amber-950/20">
          <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-3">Net Available Asset Pool</h3>
          <p className="text-4xl font-black text-white font-mono tracking-tighter">{stats.closingBalance}</p>
          <p className="text-[10px] text-amber-600 uppercase font-bold tracking-widest mt-2">Current Combat Readiness</p>
        </div>
      </div>

      {/* Analytics Matrix */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Radar size={16} className="text-amber-500"/> Composition Analysis Matrix
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                <RadarPolygon name="Assets" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '4px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold'}} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500"/> Logistics Velocity Index (7-Day)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPassive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '4px', textTransform: 'uppercase', fontSize: '12px'}} />
                <Area type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
                <Area type="monotone" dataKey="passive" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorPassive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
