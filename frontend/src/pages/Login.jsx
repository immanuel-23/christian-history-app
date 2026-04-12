import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    try {
      const res = await axios.post(`${apiBase}/auth/login`, { username, password });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', res.data.username);
      navigate('/admin');
    } catch (err) {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Admin Access</h2>
        <p className="text-slate-400 mb-8 text-center text-sm">Secure authorization portal</p>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={username} onChange={e => setUsername(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors duration-300">
            Authenticate
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors">← Back to Public Site</a>
        </div>
      </div>
    </div>
  );
}
