import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed.');

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-20 font-sans">
      <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-stone-950 border border-stone-800 rounded-full text-amber-500 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif text-white">Admin Authentication</h1>
          <p className="text-xs font-mono text-stone-400">Remission Protocol Governance Portal</p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@remissionprotocol.com"
                className="w-full bg-stone-950 border border-stone-800 text-stone-100 pl-10 pr-3 py-2 text-sm rounded-sm focus:border-amber-600 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-stone-950 border border-stone-800 text-stone-100 px-3 py-2 text-sm rounded-sm focus:border-amber-600 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-amber-700 hover:bg-amber-600 text-white text-xs font-mono uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
