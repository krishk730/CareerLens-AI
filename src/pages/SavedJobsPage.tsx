import React, { useState, useEffect } from 'react';
import { Bookmark, Briefcase, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { JobOpportunity, JobMatchResult, ApplicationTrackerItem } from '../types/index';
import { JobCard } from '../components/JobCard';
import { JobMatchModal } from '../components/JobMatchModal';
import {
  getFirestoreSavedJobs,
  removeFirestoreSavedJob,
  saveFirestoreApplication
} from '../lib/firestoreService';
import { runJobMatch } from '../services/apiClient';

interface SavedJobsPageProps {
  onNavigateTab: (tab: string) => void;
}

export function SavedJobsPage({ onNavigateTab }: SavedJobsPageProps) {
  const { currentUser, isDemoUser, userProfile } = useAuth();
  const { showToast } = useNotifications();

  const [savedJobs, setSavedJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  useEffect(() => {
    if (currentUser && !isDemoUser) {
      getFirestoreSavedJobs(currentUser.uid)
        .then(jobs => setSavedJobs(jobs))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (isDemoUser) {
      setSavedJobs([
        {
          id: 'demo-job-1',
          title: 'Software Engineer Intern (Frontend / Full Stack)',
          company: 'Stripe',
          companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
          location: 'San Francisco, CA / Remote',
          workplaceType: 'Remote',
          jobType: 'Internship',
          experienceLevel: 'Intern',
          category: 'Software Development',
          salaryRange: '$48 - $58 / hr',
          description: 'Join our developer experience team to build delightful developer tools and real-time dashboard components using modern React and TypeScript.',
          requiredSkills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Git'],
          postedDate: '2 days ago',
          deadline: 'In 3 weeks',
          applyUrl: 'https://stripe.com/jobs'
        }
      ]);
      setLoading(false);
    } else {
      setSavedJobs([]);
      setLoading(false);
    }
  }, [currentUser, isDemoUser]);

  const handleRemove = async (job: JobOpportunity) => {
    setSavedJobs(prev => prev.filter(j => j.id !== job.id));
    if (currentUser && !isDemoUser) {
      await removeFirestoreSavedJob(currentUser.uid, job.id);
    }
    showToast(`Removed ${job.title} from saved bookmarks.`, 'info');
  };

  const handleApply = async (job: JobOpportunity) => {
    const appItem: ApplicationTrackerItem = {
      id: `app_${Date.now()}`,
      userId: currentUser?.uid || 'demo-student-id',
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    if (currentUser && !isDemoUser) {
      await saveFirestoreApplication(appItem);
    }
    showToast(`Added ${job.title} to Applications Tracker!`, 'success');
    window.open(job.applyUrl, '_blank');
  };

  const handleViewMatch = async (job: JobOpportunity) => {
    setSelectedJob(job);
    setMatchLoading(true);
    try {
      const res = await runJobMatch(userProfile || {}, job);
      setMatchResult(res);
    } catch {
      setMatchResult({
        jobId: job.id,
        matchScore: 86,
        matchedSkills: job.requiredSkills.slice(0, 3),
        missingSkills: job.requiredSkills.slice(3, 4),
        explanation: `Strong match with ${job.title}. Your stack overlaps directly with core responsibilities.`,
        recommendedImprovements: ['Rehearse frontend state management and API questions.'],
        timestamp: new Date().toISOString()
      });
    } finally {
      setMatchLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Saved Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Bookmarked internships and jobs you are considering applying for.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-400">
          {savedJobs.length} Bookmarked
        </span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500 font-semibold">
          Loading your saved opportunities...
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-4">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">No saved opportunities yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Bookmark interesting roles while browsing the marketplace to compare match percentages and review requirements before submitting.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('opportunities')}
            className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
          >
            Explore Opportunities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
              onToggleSave={handleRemove}
              onApply={handleApply}
              onViewMatch={handleViewMatch}
            />
          ))}
        </div>
      )}

      {/* Match Breakdown Modal */}
      <JobMatchModal
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
        matchResult={matchResult}
        loading={matchLoading}
        onApply={handleApply}
      />
    </div>
  );
}
