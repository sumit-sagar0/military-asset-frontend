
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShoppingCart } from 'lucide-react';

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
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="text-green-500" size={28}/>
        <h1 className="text-2xl font-bold text-slate-800">Record Purchase</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-700 mb-6">New Purchase Entry</h2>
          {success && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Asset Type</label>
              <select value={form.assetId} onChange={e => setForm({...form, assetId: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-red-500 text-sm" required>
                <option value="">Select Asset...</option>
                {assets.map((a: any) => <option key={a.id} value={a.id}>{a.name} ({a.category?.name})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Receiving Base</label>
              <select value={form.baseId} onChange={e => setForm({...form, baseId: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-red-500 text-sm" required>
                <option value="">Select Base...</option>
                {bases.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Quantity</label>
              <input type="number" min={1} value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-red-500 text-sm" placeholder="e.g. 50" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Details / Notes</label>
              <input type="text" value={form.details} onChange={e => setForm({...form, details: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-red-500 text-sm" placeholder="Purchase order reference..." />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2.5 font-semibold transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin"/> Processing...</> : 'Confirm Purchase'}
            </button>
          </form>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100"><h2 className="font-semibold text-slate-700">Purchase History</h2></div>
          <div className="overflow-y-auto max-h-96">
            {history.length === 0 ? <div className="p-8 text-center text-slate-400 text-sm">No purchases recorded yet.</div> : history.map((t: any) => (
              <div key={t.id} className="px-6 py-4 border-b border-slate-50 hover:bg-slate-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-700">{t.asset?.name}</p>
                    <p className="text-xs text-slate-400">{t.toBase?.name} • {t.details || 'No notes'}</p>
                  </div>
                  <span className="text-green-600 font-bold text-sm">+{t.quantity}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{new Date(t.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
