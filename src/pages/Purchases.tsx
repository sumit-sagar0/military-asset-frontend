import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShoppingCart, Target } from 'lucide-react';

export default function Purchases() {
  const { auth } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [bases, setBases] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [form, setForm] = useState({ assetId: '', baseId: auth.baseId?.toString() || '', quantity: '', details: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([api.get('/assets'), api.get('/bases'), api.get('/transactions')]).then(([a, b, t]) => {
      setAssets(a); setBases(b);
      setHistory(t.filter((tx: any) => tx.type === 'PURCHASE'));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess('');
    try {
      await api.post('/purchases', { assetId: Number(form.assetId), baseId: Number(form.baseId), quantity: Number(form.quantity), details: form.details });
      setSuccess('Purchase recorded successfully!');
      setForm({ ...form, quantity: '', details: '' });
      const t = await api.get('/transactions');
      setHistory(t.filter((tx: any) => tx.type === 'PURCHASE'));
    } catch(e: any) { alert(e.message); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
               <ShoppingCart className="text-emerald-400" size={24}/>
            </div>
            Asset Purchases & Procurement History
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Record acquisitions of new weaponry, armor, ammunition, and tactical gear.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1E293B] rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-slate-700/50 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><ShoppingCart size={120}/></div>
          <h2 className="font-semibold text-emerald-400 mb-6 uppercase tracking-widest flex items-center gap-2">
            <Target size={16}/> New Purchase Entry
          </h2>
          {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded mb-4 text-sm font-semibold">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Asset Type</label>
              <select value={form.assetId} onChange={e => setForm({...form, assetId: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm appearance-none" required>
                <option value="">Select Asset...</option>
                {assets.map((a: any) => <option key={a.id} value={a.id}>{a.name} ({a.category?.name})</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Receiving Base</label>
              <select value={form.baseId} onChange={e => setForm({...form, baseId: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm appearance-none" required>
                <option value="">Select Base...</option>
                {bases.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Quantity</label>
              <input type="number" min={1} value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm" placeholder="e.g. 50" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Details / Notes</label>
              <input type="text" value={form.details} onChange={e => setForm({...form, details: e.target.value})} className="w-full bg-[#0F172A] border border-slate-700 text-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm" placeholder="Purchase order reference..." />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-3 mt-2 font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              {loading ? <><Loader2 size={18} className="animate-spin"/> Processing...</> : '+ Record Purchase'}
            </button>
          </form>
        </div>
        <div className="bg-[#1E293B] rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-slate-700/50 flex flex-col">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="font-semibold text-slate-300 uppercase tracking-widest">Procurement Audit Records</h2>
          </div>
          <div className="overflow-y-auto max-h-[500px] flex-1">
            {history.length === 0 ? <div className="p-8 text-center text-slate-500 text-sm">No purchases recorded yet.</div> : history.map((t: any) => (
              <div key={t.id} className="px-6 py-4 border-b border-slate-800 hover:bg-[#0F172A]/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-200">{t.asset?.name}</p>
                    <p className="text-xs text-slate-400 mt-1">{t.toBase?.name} <span className="text-slate-600 px-1">•</span> {t.details || 'No notes'}</p>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold text-sm bg-emerald-900/30 px-2 py-1 rounded border border-emerald-500/20">+{t.quantity}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 tracking-wider font-mono">{new Date(t.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
