import React, { useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const triggerNotification = useCallback((type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await registerUser(form);
      const { token, user } = response.data;
      
      triggerNotification('success', 'Registration successful! Redirecting...');
      setTimeout(() => {
        login(token, user);
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      triggerNotification('error', error.response?.data?.message || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10 relative">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 max-w-sm w-full p-4 rounded-2xl shadow-xl border transition-all duration-300 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-full ${notification.type === 'success' ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>
              {notification.type === 'success' ? '✓' : '✕'}
            </div>
            <div>
              <p className="font-semibold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
              <p className="text-sm opacity-90">{notification.text}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/40">
        <div className="mb-6 rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          Already have a demo account? Use <span className="font-semibold text-slate-900">lucky@gmail.com</span> / <span className="font-semibold text-slate-900">lucky123</span> to login.
        </div>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-slate-900">Create your account</h2>
          <p className="mt-3 text-sm text-slate-500">Join TaskFlow and manage your tasks with ease.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Login now</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
