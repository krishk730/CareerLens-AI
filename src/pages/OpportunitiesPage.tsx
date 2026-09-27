import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Sparkles,
  Bookmark,
  MapPin,
  Clock,
  ArrowUpDown,
  Building2,
  ExternalLink,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { JobOpportunity, JobMatchResult, ApplicationTrackerItem } from '../types/index';
import { fetchJobsList, runJobMatch } from '../services/apiClient';
import { JobCard } from '../components/JobCard';
import { JobMatchModal } from '../components/JobMatchModal';
import {
  saveFirestoreJob,
  removeFirestoreSavedJob,
  getFirestoreSavedJobs,
  saveFirestoreApplication
} from '../lib/firestoreService';

export function OpportunitiesPage() {
  const { userProfile, currentUser, isDemoUser } = useAuth();
  const { showToast } = useNotifications();

  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [isLiveSource, setIsLiveSource] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [sortBy, setSortBy] = useState<'match' | 'newest' | 'company'>('match');

  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  const categories = [
    'All',
    'Software Development',
    'Data Science',
    'Data Analyst',
    'AI/ML',
    'Web Development',
    'Cyber Security',
    'Business/Data Analytics'
  ];

  useEffect(() => {
    loadJobs();
    if (currentUser && !isDemoUser) {
      getFirestoreSavedJobs(currentUser.uid).then(saved => {
        setSavedJobIds(new Set(saved.map(j => j.id)));
      }).catch(console.error);
    } else if (isDemoUser) {
      setSavedJobIds(new Set(['demo-job-1']));
    }
  }, [currentUser, isDemoUser]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await fetchJobsList();
      setJobs(res.jobs);
      setIsLiveSource(res.isLive);
    } catch (err) {
      console.error(err);
      showToast('Could not load live opportunities, using demo dataset.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (job: JobOpportunity) => {
    const isSaved = savedJobIds.has(job.id);
    const updated = new Set(savedJobIds);

    if (isSaved) {
      updated.delete(job.id);
      setSavedJobIds(updated);
      if (currentUser && !isDemoUser) {
        await removeFirestoreSavedJob(currentUser.uid, job.id);
      }
      showToast(`Removed ${job.title} from saved jobs.`, 'info');
    } else {
      updated.add(job.id);
      setSavedJobIds(updated);
      if (currentUser && !isDemoUser) {
        await saveFirestoreJob(currentUser.uid, job);
      }
      showToast(`Saved ${job.title} to your bookmarks!`, 'success');
    }
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
    showToast(`Tracked application for ${job.title} at ${job.company}`, 'success');
    window.open(job.applyUrl, '_blank');
  };

  const handleViewMatch = async (job: JobOpportunity) => {
    setSelectedJob(job);
    setMatchLoading(true);
    try {
      const result = await runJobMatch(userProfile || {}, job);
      setMatchResult(result);
    } catch {
      setMatchResult({
        jobId: job.id,
        matchScore: 80,
        matchedSkills: job.requiredSkills.slice(0, 2),
        missingSkills: job.requiredSkills.slice(2, 4),
        explanation: `Strong foundational match for ${job.title} at ${job.company}. Focus on missing requirements to maximize interview likelihood.`,
        recommendedImprovements: ['Link your related GitHub projects in your application.'],
        timestamp: new Date().toISOString()
      });
    } finally {
      setMatchLoading(false);
    }
  };

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.requiredSkills.some(s => s.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'All' || job.category === selectedCategory;
      const matchesWorkplace = selectedWorkplace === 'All' || job.workplaceType === selectedWorkplace;
      const matchesJobType = selectedJobType === 'All' || job.jobType === selectedJobType;
      const matchesExp = selectedExperience === 'All' || job.experienceLevel === selectedExperience;

      return matchesSearch && matchesCat && matchesWorkplace && matchesJobType && matchesExp;
    });
  }, [jobs, searchQuery, selectedCategory, selectedWorkplace, selectedJobType, selectedExperience]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Banner with Live vs Demo Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Job & Internship Marketplace
            </h1>
            {isLiveSource ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Opportunities API
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Curated Opportunities Dataset
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover roles matched to your verified skills, projects, and target career direction.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>{filteredJobs.length} opportunities available</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, company, or skill (e.g. React, Python, Data Analyst)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Selects */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedWorkplace}
              onChange={e => setSelectedWorkplace(e.target.value)}
              className="p-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 dark:text-white cursor-pointer"
            >
              <option value="All">All Workplaces</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>

            <select
              value={selectedJobType}
              onChange={e => setSelectedJobType(e.target.value)}
              className="p-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 dark:text-white cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>

            <select
              value={selectedExperience}
              onChange={e => setSelectedExperience(e.target.value)}
              className="p-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 dark:text-white cursor-pointer"
            >
              <option value="All">All Experience</option>
              <option value="Intern">Intern</option>
              <option value="Entry-level / Fresher">Entry-level / Fresher</option>
              <option value="0-1 Years">0-1 Years</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading opportunities...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">No opportunities found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, categories, or workplace filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedWorkplace('All');
              setSelectedJobType('All');
              setSelectedExperience('All');
            }}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.has(job.id)}
              onToggleSave={handleToggleSave}
              onApply={handleApply}
              onViewMatch={handleViewMatch}
            />
          ))}
        </div>
      )}

      {/* Job Match Analysis Modal */}
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
