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
    <div 
      className="min-h-screen flex items-center justify-center bg-zinc-950 relative"
      style={{
        backgroundImage: 'linear-gradient(rgba(9, 9, 11, 0.5), rgba(9, 9, 11, 0.8)), url("/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-amber-900/10 pointer-events-none mix-blend-overlay"></div>
      <div className="w-full max-w-md px-4 relative z-10">
        <form onSubmit={handleLogin} className="bg-zinc-950/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800 p-8 ring-1 ring-white/5">
          <div className="flex justify-center mb-6 text-amber-500"><ShieldAlert size={52}/></div>
          <h1 className="text-2xl font-black text-white text-center tracking-widest uppercase mb-1">Garuda AEGIS</h1>
          <p className="text-zinc-400 text-center text-xs tracking-widest font-bold uppercase mb-8">Restricted Access. Authorized Personnel Only.</p>

          {error && <div className="bg-rose-900/30 border border-rose-500 text-rose-400 p-3 rounded-lg mb-4 text-sm text-center font-bold">{error}</div>}

          <div className="mb-4">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Auth Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors" required />
          </div>
          <div className="mb-8">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Passcode</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-70 text-zinc-950 rounded-lg py-3 font-black tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            {loading ? <><Loader2 size={18} className="animate-spin"/> Authenticating...</> : 'Secure Login'}
          </button>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-3 text-center">Quick Fill Credentials</p>
            <div className="grid grid-cols-3 gap-2">
              {credentials.map(c => (
                <button key={c.label} type="button" onClick={() => { setEmail(c.email); setPassword(c.password); }}
                  className="text-[10px] font-bold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded px-2 py-2 transition-colors border border-zinc-700">{c.label}</button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
