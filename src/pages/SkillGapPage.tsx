import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  FolderGit2,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { SkillGapAnalysisResult } from '../types/index';
import { runSkillGapAnalysis } from '../services/apiClient';
import { saveFirestoreSkillAnalysis, getLatestFirestoreSkillAnalysis } from '../lib/firestoreService';
import { CircularProgress } from '../components/CircularProgress';
import { DEMO_SKILL_ANALYSIS } from '../data/demoData';

const TARGET_ROLES = [
  'Full Stack Software Engineer',
  'Data Scientist',
  'Data Analyst',
  'Machine Learning Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Cyber Security Analyst',
  'Cloud / DevOps Engineer'
];

export function SkillGapPage() {
  const { userProfile, currentUser, isDemoUser } = useAuth();
  const { showToast } = useNotifications();

  const [selectedRole, setSelectedRole] = useState(
    userProfile?.careerGoal || 'Full Stack Software Engineer'
  );
  const [analysis, setAnalysis] = useState<SkillGapAnalysisResult | null>(
    isDemoUser ? DEMO_SKILL_ANALYSIS : null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && !isDemoUser) {
      getLatestFirestoreSkillAnalysis(currentUser.uid).then(res => {
        if (res) {
          setAnalysis(res);
          setSelectedRole(res.targetRole);
        }
      }).catch(console.error);
    }
  }, [currentUser, isDemoUser]);

  const handleRunAnalysis = async (roleToAnalyze: string) => {
    setSelectedRole(roleToAnalyze);
    setLoading(true);

    try {
      const res = await runSkillGapAnalysis(roleToAnalyze, userProfile || {});
      setAnalysis(res);

      if (currentUser && !isDemoUser) {
        await saveFirestoreSkillAnalysis(res);
      }
      showToast(`Skill Gap & Roadmap generated for ${roleToAnalyze}!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'AI analysis is temporarily unavailable. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const readinessScore = analysis?.readinessScore || 70;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Skill Gap & Career Readiness Architect
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-600 text-white">
                Personalized
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Compare your current student skillset against market requirements for target tech positions and receive a tailored 4-week execution roadmap.
            </p>
          </div>

          <button
            onClick={() => handleRunAnalysis(selectedRole)}
            disabled={loading}
            className="py-3 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-500/25 flex items-center gap-2 cursor-pointer self-start sm:self-auto transition disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {analysis ? 'Re-calculate Skill Gap' : 'Generate Analysis'}
          </button>
        </div>

        {/* Target Role Selector Chips */}
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Select Your Target Profession:
          </span>
          <div className="flex flex-wrap gap-2">
            {TARGET_ROLES.map(role => (
              <button
                key={role}
                onClick={() => handleRunAnalysis(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedRole === role
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-800 dark:text-white">
            Personalizing your 4-week roadmap with Gemini AI...
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Analyzing student inventory against industry requirements for {selectedRole}.
          </p>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          
          {/* Readiness Score & Skill Inventory Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Readiness Gauge */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Career Readiness
              </span>
              <CircularProgress
                value={readinessScore}
                size={130}
                strokeWidth={9}
                sublabel="Readiness"
              />
              <p className="text-xs font-bold text-slate-800 dark:text-white mt-3">
                {readinessScore >= 80 ? 'Near Entry-Level Ready' : readinessScore >= 60 ? 'Core Foundations Established' : 'Needs Structured Upskilling'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                For role: {analysis.targetRole}
              </p>
            </div>

            {/* Skills You Have */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Skills You Have ({analysis.skillsYouHave.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Verified proficiencies that map directly to {selectedRole}:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.skillsYouHave.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* High Priority Skills You Need */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Skills to Acquire ({analysis.skillsYouNeed.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Categorized by recruitment impact and urgency:
              </p>
              <div className="space-y-2">
                {analysis.skillsYouNeed.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.skill}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        item.priority === 'High'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : item.priority === 'Medium'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Detailed Missing Skills Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Missing Skills Rationale & Industry Priority
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {analysis.skillsYouNeed.map((item, idx) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{item.skill}</span>
                    <p className="text-slate-500 text-xs">{item.importance}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      item.priority === 'High'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                        : item.priority === 'Medium'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Week Personalized Learning Roadmap */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Personalized 4-Week Learning Roadmap
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Curated specifically to transform your missing proficiencies into concrete portfolio assets.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-3 py-1 rounded-full">
                ~10-12 hrs / week
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {analysis.personalizedRoadmap.map(week => (
                <div
                  key={week.week}
                  className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-purple-600 text-white">
                        WEEK {week.week}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {week.estimatedHours} hrs
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {week.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {week.objective}
                    </p>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Core Concepts Covered:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {week.keyTopics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[11px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-start gap-1.5 text-xs text-indigo-700 dark:text-indigo-300">
                      <FolderGit2 className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="font-medium leading-snug">
                        <strong className="font-bold">Project Goal:</strong> {week.recommendedProject}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
}
