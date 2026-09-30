
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('admin@military.gov');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      login(data);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const credentials = [
    { label: 'Admin', email: 'admin@military.gov', password: 'admin123' },
    { label: 'Commander', email: 'alpha@military.gov', password: 'commander123' },
    { label: 'Logistics', email: 'bravologistics@military.gov', password: 'logistics123' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md px-4">
        <form onSubmit={handleLogin} className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
          <div className="flex justify-center mb-6 text-red-500"><ShieldAlert size={52}/></div>
          <h1 className="text-2xl font-bold text-white text-center tracking-widest uppercase mb-1">Military Asset DB</h1>
          <p className="text-slate-400 text-center text-sm mb-8">Restricted Access. Authorized Personnel Only.</p>

          {error && <div className="bg-red-900/30 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Auth Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors" required />
          </div>
          <div className="mb-8">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Passcode</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white rounded-lg py-3 font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={18} className="animate-spin"/> Verifying...</> : 'Secure Login'}
          </button>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-400 font-semibold mb-2 text-center">Quick Fill Credentials</p>
            <div className="grid grid-cols-3 gap-2">
              {credentials.map(c => (
                <button key={c.label} type="button" onClick={() => { setEmail(c.email); setPassword(c.password); }}
                  className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded px-2 py-1.5 transition-colors">{c.label}</button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
