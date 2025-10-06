import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';

// --- Admin Login Page Component ---
export default function AdminLoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // IMPORTANT: This is for demonstration.
    // In a real app, you would make an API call to your backend here
    // to securely verify the admin's credentials.
    if (email === 'admin@rajakaka.com' && password === 'rajakaka@admin') {
      console.log('Admin login successful');
      onLoginSuccess(); // Notify the parent component of success
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-wide text-orange-600">
              Rajakaka Admin
            </h1>
            <p className="text-gray-500 mt-2">Please log in to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400"><Mail size={20} /></span>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" 
                placeholder="Enter admin email"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400"><Lock size={20} /></span>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" 
                placeholder="Enter password" 
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <LogIn size={20} /><span>Login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

