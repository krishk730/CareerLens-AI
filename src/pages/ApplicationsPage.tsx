import React, { useState, useEffect } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Calendar,
  Building2,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Clock,
  Award,
  XCircle,
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ApplicationTrackerItem } from '../types/index';
import {
  getFirestoreApplications,
  saveFirestoreApplication,
  deleteFirestoreApplication
} from '../lib/firestoreService';

const STAGES: ApplicationTrackerItem['status'][] = [
  'Saved',
  'Applied',
  'Interview',
  'Selected',
  'Rejected'
];

export function ApplicationsPage() {
  const { currentUser, isDemoUser } = useAuth();
  const { showToast } = useNotifications();

  const [applications, setApplications] = useState<ApplicationTrackerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Application form state
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('Remote');
  const [newStatus, setNewStatus] = useState<ApplicationTrackerItem['status']>('Applied');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    if (currentUser && !isDemoUser) {
      getFirestoreApplications(currentUser.uid)
        .then(apps => setApplications(apps))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (isDemoUser) {
      setApplications([
        {
          id: 'demo-app-1',
          userId: 'demo-student-id',
          jobId: 'job-1',
          jobTitle: 'Software Engineer Intern (Frontend / Full Stack)',
          company: 'Stripe',
          location: 'San Francisco, CA / Remote',
          status: 'Interview',
          appliedDate: '2026-09-18',
          notes: 'Completed technical screen. Next round is system design discussion.',
          updatedAt: '2026-09-24'
        },
        {
          id: 'demo-app-2',
          userId: 'demo-student-id',
          jobId: 'job-2',
          jobTitle: 'Machine Learning Engineering Intern',
          company: 'Google AI',
          location: 'Mountain View, CA',
          status: 'Applied',
          appliedDate: '2026-09-20',
          notes: 'Submitted via university campus recruitment portal.',
          updatedAt: '2026-09-20'
        },
        {
          id: 'demo-app-3',
          userId: 'demo-student-id',
          jobId: 'job-3',
          jobTitle: 'Junior Web Developer (React / Next.js)',
          company: 'Vercel',
          location: 'Remote',
          status: 'Selected',
          appliedDate: '2026-09-10',
          notes: 'Offer letter received! Reviewing compensation package.',
          updatedAt: '2026-09-25'
        },
        {
          id: 'demo-app-4',
          userId: 'demo-student-id',
          jobId: 'job-4',
          jobTitle: 'Associate Data Analyst',
          company: 'Spotify',
          location: 'New York, NY',
          status: 'Saved',
          appliedDate: '2026-09-26',
          notes: 'Working on SQL window function coursework first.',
          updatedAt: '2026-09-26'
        }
      ]);
      setLoading(false);
    } else {
      setApplications([]);
      setLoading(false);
    }
  }, [currentUser, isDemoUser]);

  const handleStatusChange = async (appId: string, nextStatus: ApplicationTrackerItem['status']) => {
    const updated = applications.map(a =>
      a.id === appId ? { ...a, status: nextStatus, updatedAt: new Date().toISOString() } : a
    );
    setApplications(updated);

    const changedApp = updated.find(a => a.id === appId);
    if (changedApp && currentUser && !isDemoUser) {
      await saveFirestoreApplication(changedApp);
    }
    showToast(`Updated status to "${nextStatus}"`, 'success');
  };

  const handleDelete = async (appId: string) => {
    setApplications(prev => prev.filter(a => a.id !== appId));
    if (currentUser && !isDemoUser) {
      await deleteFirestoreApplication(appId);
    }
    showToast('Application deleted.', 'info');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const newApp: ApplicationTrackerItem = {
      id: `app_${Date.now()}`,
      userId: currentUser?.uid || 'demo-student-id',
      jobId: `custom_${Date.now()}`,
      jobTitle: newTitle.trim(),
      company: newCompany.trim(),
      location: newLocation.trim(),
      status: newStatus,
      appliedDate: new Date().toISOString().split('T')[0],
      notes: newNotes.trim() || undefined,
      updatedAt: new Date().toISOString()
    };

    setApplications(prev => [newApp, ...prev]);
    if (currentUser && !isDemoUser) {
      await saveFirestoreApplication(newApp);
    }

    showToast(`Added ${newTitle} at ${newCompany} to tracker!`, 'success');
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewCompany('');
    setNewNotes('');
  };

  const stageCounts = {
    Saved: applications.filter(a => a.status === 'Saved').length,
    Applied: applications.filter(a => a.status === 'Applied').length,
    Interview: applications.filter(a => a.status === 'Interview').length,
    Selected: applications.filter(a => a.status === 'Selected').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length
  };

  const filteredApps = filterStage === 'All'
    ? applications
    : applications.filter(a => a.status === filterStage);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Applications Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor and advance your recruitment pipeline across stages.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer self-start sm:self-auto transition"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {/* Stage Distribution Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STAGES.map(stage => {
          const count = stageCounts[stage];
          const isSelected = stage === 'Selected';
          const isInterview = stage === 'Interview';
          const isRejected = stage === 'Rejected';

          return (
            <div
              key={stage}
              onClick={() => setFilterStage(filterStage === stage ? 'All' : stage)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                filterStage === stage
                  ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                <span>{stage}</span>
                {isSelected && <Award className="w-3.5 h-3.5 text-emerald-500" />}
                {isInterview && <Clock className="w-3.5 h-3.5 text-purple-500" />}
                {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
              </div>
              <p className={`text-2xl font-black ${
                isSelected ? 'text-emerald-600 dark:text-emerald-400' :
                isInterview ? 'text-purple-600 dark:text-purple-400' :
                isRejected ? 'text-rose-600 dark:text-rose-400' :
                'text-slate-900 dark:text-white'
              }`}>
                {count}
              </p>
            </div>
          );
        })}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500 font-semibold">
          Loading your applications...
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <Send className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            {filterStage === 'All' ? 'No applications tracked yet' : `No applications in ${filterStage}`}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Start applying to opportunities in the marketplace or click "Add Application" to track external applications.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
          >
            Add Your First Application
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredApps.map(app => (
            <div
              key={app.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {app.jobTitle}
                  </h4>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {app.company}
                  </span>
                  <span>•</span>
                  <span>{app.location}</span>
                  {app.appliedDate && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Applied: {app.appliedDate}
                      </span>
                    </>
                  )}
                </div>
                {app.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                    "{app.notes}"
                  </p>
                )}
              </div>

              {/* Status Selector & Actions */}
              <div className="flex items-center gap-3 self-end md:self-auto">
                <select
                  value={app.status}
                  onChange={e => handleStatusChange(app.id, e.target.value as any)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                    app.status === 'Selected'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : app.status === 'Interview'
                      ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                      : app.status === 'Rejected'
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                      : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                  }`}
                >
                  {STAGES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <button
                  onClick={() => handleDelete(app.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Track New Opportunity</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Associate Software Engineer"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  placeholder="e.g. Microsoft"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="Remote / City"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Stage</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                  >
                    {STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes / Next Steps</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="e.g. Recruiter phone screen scheduled for Tuesday..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Add to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
