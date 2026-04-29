import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const { login, setError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await registerUser(form);
      const { token, user } = response.data;
      login(token, user);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
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
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white font-semibold transition hover:bg-blue-700"
          >
            Register
          </button>
          {message && <p className="text-sm text-red-600 text-center">{message}</p>}
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Login now</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
