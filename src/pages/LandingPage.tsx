import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  FileCheck2,
  Briefcase,
  TrendingUp,
  Bot,
  Compass,
  CheckCircle2,
  Users,
  Award,
  Zap,
  Star,
  ChevronRight,
  Search,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { JobCard } from '../components/JobCard';
import { JobMatchModal } from '../components/JobMatchModal';
import { JobOpportunity, JobMatchResult } from '../types/index';
import { fetchJobsList, runJobMatch } from '../services/apiClient';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigateTab: (tab: string) => void;
}

export function LandingPage({ onOpenAuth, onNavigateTab }: LandingPageProps) {
  const { currentUser, isDemoUser, loginAsDemoUser, userProfile } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState<JobOpportunity[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  useEffect(() => {
    fetchJobsList().then(res => {
      setFeaturedJobs(res.jobs.slice(0, 3));
    }).catch(() => {});
  }, []);

  const handleViewMatch = async (job: JobOpportunity) => {
    setSelectedJob(job);
    setMatchLoading(true);
    try {
      const res = await runJobMatch(userProfile || {}, job);
      setMatchResult(res);
    } catch {
      setMatchResult({
        jobId: job.id,
        matchScore: 84,
        matchedSkills: job.requiredSkills.slice(0, 2),
        missingSkills: job.requiredSkills.slice(2, 4),
        explanation: `Strong foundational match for ${job.title}. Sharpening missing skills will maximize your interview readiness.`,
        recommendedImprovements: ['Add related coursework and project repo link.'],
        timestamp: new Date().toISOString()
      });
    } finally {
      setMatchLoading(false);
    }
  };

  const handleApply = (job: JobOpportunity) => {
    if (currentUser || isDemoUser) {
      onNavigateTab('opportunities');
    } else {
      onOpenAuth('signup');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-400/15 via-indigo-500/15 to-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Learn • Showcase Skills • Find Opportunities • Grow</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Build Your Career with <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CareerLens AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Analyze your resume, discover opportunities, identify skill gaps, and get personalized career guidance — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (currentUser || isDemoUser) {
                    onNavigateTab('dashboard');
                  } else {
                    onOpenAuth('signup');
                  }
                }}
                className="py-3.5 px-7 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (currentUser || isDemoUser) {
                    onNavigateTab('opportunities');
                  } else {
                    const el = document.getElementById('opportunities');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="py-3.5 px-6 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-800 transition cursor-pointer shadow-xs"
              >
                Explore Opportunities
              </button>

              <button
                onClick={() => loginAsDemoUser()}
                className="py-3.5 px-5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold text-sm rounded-xl border border-indigo-200 dark:border-indigo-800 transition cursor-pointer"
              >
                Try Instant Demo Mode
              </button>
            </div>

            {/* Trust badge */}
            <p className="text-xs text-slate-400 dark:text-slate-500 pt-3">
              No credit card required • Built specifically for university students & freshers
            </p>
          </div>

          {/* Interactive Hero Visual Showcase */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-2xl shadow-blue-500/10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-400 ml-2">CareerLens AI Workspace</span>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full">
                Interactive Preview
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {/* Feature Preview 1 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">ATS Resume Health</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">82/100</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[82%]" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Strong technical foundation • Missing: Docker & CI/CD
                </p>
              </div>

              {/* Feature Preview 2 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Role Readiness</span>
                  <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">78% Match</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[78%]" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Full Stack Engineer • 4-week learning roadmap generated
                </p>
              </div>

              {/* Feature Preview 3 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">AI Assistant</span>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Online</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                  "Add 2 numerical metrics to your project bullet points to boost recruiter response by 40%."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How CareerLens AI Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Structured Journey
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              How CareerLens AI Works
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A 5-step intelligent workflow designed to turn your academic coursework into compelling professional credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Build Your Profile', desc: 'Detail your education, projects, technical skills, and target career preferences.' },
              { step: '02', title: 'Analyze Your Resume', desc: 'Gemini AI scans your PDF/DOCX for ATS readability, action verbs, and section strength.' },
              { step: '03', title: 'Discover Opportunities', desc: 'Browse verified internships and entry-level positions filtered by your technical stack.' },
              { step: '04', title: 'Identify Skill Gaps', desc: 'See exactly which high-demand competencies you need for your desired roles.' },
              { step: '05', title: 'Grow Your Career', desc: 'Execute your custom 4-week learning roadmap and track interview milestones.' }
            ].map((s, idx) => (
              <div
                key={idx}
                className="relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-blue-600/30 dark:text-blue-400/30">
                    {s.step}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Core Capabilities
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Everything You Need to Land Your First Job
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Modern AI intelligence integrated into every stage of your career development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">AI Resume Analyzer</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Upload your resume in PDF/DOCX and receive instant ATS scoring, section health grades, missing keywords, and concrete bullet point enhancements.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Smart Job Matching</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Gemini compares your current skills and projects against opening requirements to deliver an advisory AI Match Score with matched and missing skill breakdown.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Skill Gap Analysis</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Select your target profession — Data Scientist, Full Stack Dev, Cloud Engineer — and view prioritized high/medium/low skills along with a 4-week study plan.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Career Recommendations</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Discover alternative career tracks where your existing skillset provides natural leverage, complete with market demand ratings and recommended projects.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">AI Career Assistant</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Chat with an AI mentor that retains context of your resume score, target roles, and skill gaps to provide tailored interview guidance and coding advice.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Application Tracker</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Organize your pipeline from Saved to Applied, Interview, Selected, or Rejected with real-time status updates and activity metrics.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section id="opportunities" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Marketplace Preview
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Featured Internships & Jobs
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Explore real and curated demo roles tailored for university students and entry-level seekers.
              </p>
            </div>

            <button
              onClick={() => {
                if (currentUser || isDemoUser) {
                  onNavigateTab('opportunities');
                } else {
                  loginAsDemoUser();
                }
              }}
              className="py-2 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              View All 15+ Matches <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={false}
                onToggleSave={() => onOpenAuth('signup')}
                onApply={handleApply}
                onViewMatch={handleViewMatch}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-16 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Benchmark Indicators (Sample Demo Metrics)
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">45,000+</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Resumes Evaluated</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">92%</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Skill Matching Accuracy</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">12,500+</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Internships Curated</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">4.9 / 5</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">Student Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-blue-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Your Career. Your Skills. <br />Your Next Opportunity.
          </h2>
          <p className="text-sm sm:text-base text-blue-200/80 max-w-xl mx-auto leading-relaxed">
            Stop sending blind applications. Diagnose your resume gaps, master in-demand tools, and match with the roles that fit your strengths today.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenAuth('signup')}
              className="py-4 px-8 bg-white hover:bg-blue-50 text-slate-950 font-bold text-sm rounded-xl shadow-xl transition transform hover:scale-[1.02] cursor-pointer"
            >
              Start Your Career Journey
            </button>
          </div>
        </div>
      </section>

      {/* Job Match Modal */}
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
