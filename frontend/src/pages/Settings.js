import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    notifications: true,
    theme: 'light',
    language: 'en',
    emailUpdates: false,
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
          <p className="mt-2 text-slate-600">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <p className="text-slate-900 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">{user?.email || 'user@example.com'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                placeholder="Enter your name"
                defaultValue={user?.name || ''}
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-slate-700">Notifications</label>
                <p className="text-sm text-slate-500">Receive notifications for task updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-slate-700">Email Updates</label>
                <p className="text-sm text-slate-500">Receive weekly progress reports via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.emailUpdates}
                  onChange={(e) => handleSettingChange('emailUpdates', e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
              <select
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
              <select
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Account</h2>
          <div className="space-y-4">
            <button
              onClick={() => alert('Password change functionality would be implemented here')}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Change Password
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('Account deletion would be implemented here');
                }
              }}
              className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSaveSettings}
            className="rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm"
          >
            Save Settings
          </button>
          <button
            onClick={logout}
            className="rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;