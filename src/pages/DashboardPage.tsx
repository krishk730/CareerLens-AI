import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Plus,
  Send,
  UploadCloud,
  Layers,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { CircularProgress } from '../components/CircularProgress';
import { JobCard } from '../components/JobCard';
import { JobMatchModal } from '../components/JobMatchModal';
import { ResumeUploadModal } from '../components/ResumeUploadModal';
import {
  JobOpportunity,
  ResumeAnalysisResult,
  SkillGapAnalysisResult,
  JobMatchResult,
  ApplicationTrackerItem
} from '../types/index';
import { fetchJobsList, runJobMatch } from '../services/apiClient';
import {
  getFirestoreResumeAnalyses,
  getLatestFirestoreSkillAnalysis,
  getFirestoreApplications,
  saveFirestoreJob,
  removeFirestoreSavedJob,
  getFirestoreSavedJobs,
  saveFirestoreApplication
} from '../lib/firestoreService';
import { DEMO_RESUME_ANALYSIS, DEMO_SKILL_ANALYSIS } from '../data/demoData';

interface DashboardPageProps {
  onNavigateTab: (tab: string) => void;
}

export function DashboardPage({ onNavigateTab }: DashboardPageProps) {
  const { userProfile, currentUser, isDemoUser } = useAuth();
  const { showToast } = useNotifications();

  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult | null>(
    isDemoUser ? DEMO_RESUME_ANALYSIS : null
  );
  const [skillAnalysis, setSkillAnalysis] = useState<SkillGapAnalysisResult | null>(
    isDemoUser ? DEMO_SKILL_ANALYSIS : null
  );
  const [recommendedJobs, setRecommendedJobs] = useState<JobOpportunity[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>([]);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Job matching modal state
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  useEffect(() => {
    // Load jobs
    fetchJobsList().then(res => {
      setRecommendedJobs(res.jobs.slice(0, 3));
    }).catch(console.error);

    // If authenticated, load from Firestore
    if (currentUser && !isDemoUser) {
      getFirestoreResumeAnalyses(currentUser.uid).then(analyses => {
        if (analyses.length > 0) setResumeAnalysis(analyses[0]);
      }).catch(console.error);

      getLatestFirestoreSkillAnalysis(currentUser.uid).then(res => {
        if (res) setSkillAnalysis(res);
      }).catch(console.error);

      getFirestoreSavedJobs(currentUser.uid).then(saved => {
        setSavedJobIds(new Set(saved.map(j => j.id)));
      }).catch(console.error);

      getFirestoreApplications(currentUser.uid).then(apps => {
        setApplications(apps);
      }).catch(console.error);
    } else if (isDemoUser) {
      setResumeAnalysis(DEMO_RESUME_ANALYSIS);
      setSkillAnalysis(DEMO_SKILL_ANALYSIS);
      setSavedJobIds(new Set(['demo-job-1']));
      setApplications([
        {
          id: 'app-1',
          userId: 'demo-student-id',
          jobId: 'demo-job-1',
          jobTitle: 'Software Engineer Intern (Frontend / Full Stack)',
          company: 'Stripe',
          location: 'San Francisco, CA / Remote',
          status: 'Interview',
          appliedDate: '2026-09-18',
          updatedAt: '2026-09-24'
        },
        {
          id: 'app-2',
          userId: 'demo-student-id',
          jobId: 'demo-job-3',
          jobTitle: 'Machine Learning Engineering Intern',
          company: 'Google AI',
          location: 'Mountain View, CA',
          status: 'Applied',
          appliedDate: '2026-09-20',
          updatedAt: '2026-09-20'
        },
        {
          id: 'app-3',
          userId: 'demo-student-id',
          jobId: 'demo-job-7',
          jobTitle: 'Junior Web Developer (React / Next.js)',
          company: 'Vercel',
          location: 'Remote',
          status: 'Selected',
          appliedDate: '2026-09-10',
          updatedAt: '2026-09-25'
        }
      ]);
    }
  }, [currentUser, isDemoUser]);

  const handleToggleSave = async (job: JobOpportunity) => {
    const isCurrentlySaved = savedJobIds.has(job.id);
    const newSet = new Set(savedJobIds);

    if (isCurrentlySaved) {
      newSet.delete(job.id);
      setSavedJobIds(newSet);
      if (currentUser && !isDemoUser) {
        await removeFirestoreSavedJob(currentUser.uid, job.id);
      }
      showToast('Opportunity removed from saved items.', 'info');
    } else {
      newSet.add(job.id);
      setSavedJobIds(newSet);
      if (currentUser && !isDemoUser) {
        await saveFirestoreJob(currentUser.uid, job);
      }
      showToast('Saved opportunity to your bookmarks!', 'success');
    }
  };

  const handleApply = async (job: JobOpportunity) => {
    const newApp: ApplicationTrackerItem = {
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

    setApplications(prev => [newApp, ...prev.filter(a => a.jobId !== job.id)]);
    if (currentUser && !isDemoUser) {
      await saveFirestoreApplication(newApp);
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
        matchScore: 82,
        matchedSkills: job.requiredSkills.slice(0, 2),
        missingSkills: job.requiredSkills.slice(2, 4),
        explanation: `Good alignment with ${job.title} at ${job.company}. Complete missing skills to maximize competitiveness.`,
        recommendedImprovements: ['Highlight personal projects with similar requirements.'],
        timestamp: new Date().toISOString()
      });
    } finally {
      setMatchLoading(false);
    }
  };

  const displayName = userProfile?.fullName?.split(' ')[0] || 'Student';
  const profileScore = userProfile?.profileScore || 70;
  const resumeScore = resumeAnalysis?.score || 0;
  const readinessScore = skillAnalysis?.readinessScore || 72;
  const targetRole = userProfile?.careerGoal || skillAnalysis?.targetRole || 'Software Engineer';

  // Application counts by stage
  const appStats = {
    applied: applications.filter(a => a.status === 'Applied').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    selected: applications.filter(a => a.status === 'Selected').length,
    saved: savedJobIds.size
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Welcome back, {displayName} 👋
            </h1>
            {isDemoUser && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                Demo Student Mode
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Targeting <span className="font-bold underline decoration-blue-300">{targetRole}</span>. Review your ATS resume score, explore recommended matches, and tackle your week's roadmap.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsResumeModalOpen(true)}
            className="px-4 py-2.5 bg-white hover:bg-blue-50 text-slate-900 text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-blue-600" />
            Upload Resume
          </button>
          <button
            onClick={() => onNavigateTab('assistant')}
            className="px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl backdrop-blur-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            Ask AI
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Profile Score */}
        <div
          onClick={() => onNavigateTab('profile')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-blue-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Profile Completeness</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {profileScore}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">+15% this week</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${profileScore}%` }} />
          </div>
        </div>

        {/* Card 2: Resume Score */}
        <div
          onClick={() => onNavigateTab('resume')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>ATS Resume Health</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {resumeScore > 0 ? `${resumeScore}/100` : 'Pending'}
            </span>
            {resumeScore > 0 && <span className="text-xs text-indigo-600 font-medium">ATS Verified</span>}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 truncate">
            {resumeScore > 0 ? resumeAnalysis?.fileName || 'Resume.pdf' : 'Upload to analyze with AI'}
          </p>
        </div>

        {/* Card 3: Career Readiness */}
        <div
          onClick={() => onNavigateTab('skill-gap')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-purple-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Career Readiness</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {readinessScore}%
            </span>
            <span className="text-xs text-purple-600 font-medium">{targetRole}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${readinessScore}%` }} />
          </div>
        </div>

        {/* Card 4: Recommended Matches */}
        <div
          onClick={() => onNavigateTab('opportunities')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Active Matches</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              14
            </span>
            <span className="text-xs text-emerald-600 font-medium">8 new posted</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 truncate">
            Based on your skills & preferences
          </p>
        </div>
      </div>

      {/* Main Grid: Recommended Jobs & Side Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recommended Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Top AI-Matched Opportunities
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('opportunities')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedJobs.slice(0, 2).map(job => (
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

          {/* Quick Learning Roadmap Action */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Next 3 Recommended Actions to Boost Your Hireability
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('skill-gap')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                Full Roadmap
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: 'Bridge High-Priority Gap', desc: 'Docker & Microservices containerization project', tag: 'High Impact' },
                { title: 'Quantify Metrics', desc: 'Add 2 numerical metrics to internship & project descriptions', tag: 'Resume' },
                { title: 'Deploy Live Demo', desc: 'Deploy CampusMarket on Cloud Run with public URL', tag: 'Portfolio' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between space-y-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {item.tag}
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</p>
                  <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Resume Health & Application Status */}
        <div className="space-y-6">
          
          {/* Resume Health Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center space-y-4">
            <div className="flex items-center justify-between text-left">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Resume ATS Health</h3>
                <p className="text-[11px] text-slate-400">Evaluated with Gemini AI</p>
              </div>
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Re-analyze
              </button>
            </div>

            <div className="py-2">
              <CircularProgress
                value={resumeScore > 0 ? resumeScore : 74}
                size={120}
                strokeWidth={9}
                sublabel="ATS Score"
              />
            </div>

            <div className="text-left text-xs space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>ATS Readability</span>
                <span className="font-bold text-emerald-600">85% High</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Action Verb Usage</span>
                <span className="font-bold text-blue-600">Strong</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Keyword Coverage</span>
                <span className="font-bold text-amber-500">Needs Polish</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('resume')}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              View Full Resume Breakdown
            </button>
          </div>

          {/* Applications Pipeline Overview */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Application Pipeline</h3>
              <button
                onClick={() => onNavigateTab('applications')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <p className="text-lg font-extrabold text-slate-700 dark:text-slate-300">{appStats.saved}</p>
                <p className="text-[10px] font-semibold text-slate-400">Saved</p>
              </div>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40">
                <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{appStats.applied}</p>
                <p className="text-[10px] font-semibold text-slate-400">Applied</p>
              </div>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40">
                <p className="text-lg font-extrabold text-purple-600 dark:text-purple-400">{appStats.interview}</p>
                <p className="text-[10px] font-semibold text-slate-400">Interview</p>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{appStats.selected}</p>
                <p className="text-[10px] font-semibold text-slate-400">Selected</p>
              </div>
            </div>

            {applications.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Latest Application Status
                </span>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white line-clamp-1">
                      {applications[0].jobTitle}
                    </p>
                    <p className="text-[11px] text-slate-500">{applications[0].company}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                    {applications[0].status}
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Resume Upload Modal */}
      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onAnalysisComplete={(res) => {
          setResumeAnalysis(res);
        }}
      />

      {/* Job Match Breakdown Modal */}
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
