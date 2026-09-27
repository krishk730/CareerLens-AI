import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Bell,
  Shield,
  Key,
  LogOut,
  UserCheck,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

export function SettingsPage() {
  const { userProfile, currentUser, logout, isDemoUser, loginAsDemoUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useNotifications();

  const [jobAlerts, setJobAlerts] = useState(true);
  const [resumeTips, setResumeTips] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSavePreferences = () => {
    showToast('Notification and privacy preferences saved.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Platform Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure appearance, privacy, notification channels, and active account settings.
          </p>
        </div>
      </div>

      {/* Theme / Appearance Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Appearance & Theme
        </h3>
        <p className="text-xs text-slate-500">
          Choose your interface preference across light, dark, or system defaults.
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-md pt-1">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition cursor-pointer ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition cursor-pointer ${
              theme === 'dark'
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition cursor-pointer ${
              theme === 'system'
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-5 h-5 text-slate-500" />
            <span>System</span>
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Notification Preferences
        </h3>

        <div className="space-y-3 max-w-lg text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <div>
              <p className="font-bold text-slate-800 dark:text-white">AI Job Match Alerts</p>
              <p className="text-slate-500">Notify me when a new role matches &gt;85% of my skill profile.</p>
            </div>
            <input
              type="checkbox"
              checked={jobAlerts}
              onChange={e => setJobAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <div>
              <p className="font-bold text-slate-800 dark:text-white">Resume Diagnostic Tips</p>
              <p className="text-slate-500">Receive proactive recommendations to optimize underperforming sections.</p>
            </div>
            <input
              type="checkbox"
              checked={resumeTips}
              onChange={e => setResumeTips(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <div>
              <p className="font-bold text-slate-800 dark:text-white">Weekly Career Digest</p>
              <p className="text-slate-500">A weekly recap of application milestones and roadmap tasks.</p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={e => setWeeklyDigest(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </label>
        </div>

        <button
          onClick={handleSavePreferences}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition cursor-pointer"
        >
          Save Preferences
        </button>
      </div>

      {/* Account & Security Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Account Status
        </h3>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Account Identity:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currentUser?.email || userProfile?.email || 'Demo Student'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Mode:</span>
            <span className={`font-bold ${isDemoUser ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'}`}>
              {isDemoUser ? 'Demo Student Mode' : 'Firebase Authenticated'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!isDemoUser && (
            <button
              onClick={() => loginAsDemoUser()}
              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl hover:bg-indigo-100 transition cursor-pointer"
            >
              Switch to Demo Student Mode
            </button>
          )}

          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl hover:bg-rose-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

    </div>
  );
}
