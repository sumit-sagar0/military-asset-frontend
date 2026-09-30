
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { Package, TrendingUp, TrendingDown, Layers, RefreshCcw } from 'lucide-react';

export default function Dashboard() {
  const { auth } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseId = auth.role !== 'ADMIN' && auth.baseId ? `?baseId=${auth.baseId}` : '';
      const [statsData, txData] = await Promise.all([
        api.get(`/dashboard${baseId}`),
        api.get(`/transactions${baseId}`),
      ]);
      setStats(statsData);
      setTransactions(txData.slice(0, 10));
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const typeColor: Record<string, string> = {
    PURCHASE: 'bg-green-100 text-green-700',
    TRANSFER: 'bg-blue-100 text-blue-700',
    ASSIGNMENT: 'bg-yellow-100 text-yellow-700',
    EXPENDITURE: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Commander's Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {auth.name}</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm transition-colors">
          <RefreshCcw size={14}/> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-400">Loading data...</div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Opening Balance" value={1000} subtitle="Baseline quantity" />
            <StatCard label="Net Movement" value={`+${stats.netMovement}`} color="text-blue-600" subtitle="Purchases + Transfer In - Out" />
            <StatCard label="Assigned / Expended" value={stats.totalAssigned + stats.totalExpended} color="text-orange-600" subtitle="Removed from active stock" />
            <StatCard label="Closing Balance" value={stats.closingBalance} color="text-green-600" subtitle="Current available stock" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Purchases" value={stats.totalPurchases} color="text-green-600" />
            <StatCard label="Transfer In" value={stats.totalTransferIn} color="text-blue-600" />
            <StatCard label="Transfer Out" value={stats.totalTransferOut} color="text-red-600" />
            <StatCard label="Asset Types" value={stats.totalAssets} color="text-slate-800" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Recent Transactions (Audit Log)</h2>
            </div>
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">No transactions yet. Record a purchase to get started.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-100 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Type</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Asset</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Qty</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Details</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Timestamp</th>
                  </tr></thead>
                  <tbody>
                    {transactions.map((t: any) => (
                      <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${typeColor[t.type] || 'bg-slate-100 text-slate-600'}`}>{t.type}</span></td>
                        <td className="px-6 py-4 text-slate-700">{t.asset?.name || '-'}</td>
                        <td className="px-6 py-4 font-semibold">{t.quantity}</td>
                        <td className="px-6 py-4 text-slate-500">{t.details || '-'}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{new Date(t.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : <p className="text-red-500">Failed to load dashboard. Is the Java backend running?</p>}
    </div>
  );
}
