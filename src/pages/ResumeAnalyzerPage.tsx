import React, { useState, useEffect } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  History,
  FileCheck2,
  Award,
  Layers,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ResumeAnalysisResult } from '../types/index';
import { CircularProgress } from '../components/CircularProgress';
import { ResumeUploadModal } from '../components/ResumeUploadModal';
import { getFirestoreResumeAnalyses } from '../lib/firestoreService';
import { DEMO_RESUME_ANALYSIS } from '../data/demoData';

export function ResumeAnalyzerPage() {
  const { currentUser, isDemoUser } = useAuth();
  const { showToast } = useNotifications();

  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysisResult | null>(
    isDemoUser ? DEMO_RESUME_ANALYSIS : null
  );
  const [previousAnalyses, setPreviousAnalyses] = useState<ResumeAnalysisResult[]>(
    isDemoUser ? [DEMO_RESUME_ANALYSIS] : []
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (currentUser && !isDemoUser) {
      setLoadingHistory(true);
      getFirestoreResumeAnalyses(currentUser.uid)
        .then(analyses => {
          if (analyses.length > 0) {
            setCurrentAnalysis(analyses[0]);
            setPreviousAnalyses(analyses);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingHistory(false));
    }
  }, [currentUser, isDemoUser]);

  const handleAnalysisComplete = (newAnalysis: ResumeAnalysisResult) => {
    setCurrentAnalysis(newAnalysis);
    setPreviousAnalyses(prev => [newAnalysis, ...prev.filter(a => a.id !== newAnalysis.id)]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Top Bar / Upload CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              AI Resume Analyzer & ATS Diagnostic
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white">
              Gemini Powered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Real algorithmic evaluation of ATS parsing, action verbs, quantified metrics, and industry keyword alignment.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="py-3 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer self-start sm:self-auto transition"
        >
          <UploadCloud className="w-4 h-4" />
          {currentAnalysis ? 'Re-analyze Resume' : 'Upload Resume'}
        </button>
      </div>

      {!currentAnalysis ? (
        /* Empty State */
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              No resume analyzed yet
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your resume in PDF or DOCX format to receive structured ATS diagnostics, identified skill gaps, and custom keyword recommendations.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
          >
            Upload Resume Now
          </button>
        </div>
      ) : (
        /* Analysis Results Display */
        <div className="space-y-6">
          
          {/* Main Scores & Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Overall Score */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Overall Resume Score
              </span>
              <CircularProgress
                value={currentAnalysis.score}
                size={140}
                strokeWidth={10}
                sublabel="Score"
              />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-3">
                {currentAnalysis.score >= 80 ? 'Excellent ATS Alignment' : currentAnalysis.score >= 60 ? 'Competitive with Minor Gaps' : 'Needs Optimization'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Evaluated from: {currentAnalysis.fileName}
              </p>
            </div>

            {/* ATS Readability & Extracted Profile */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase">ATS Compatibility</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                  {currentAnalysis.atsReadabilityScore}% Pass Rate
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Detected Candidate:</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {currentAnalysis.extractedName || 'Candidate'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Contact & Links:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">
                    {currentAnalysis.extractedContact || 'Verified'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Top Extracted Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentAnalysis.extractedSkills.slice(0, 6).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px] font-medium text-slate-700 dark:text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Best Fitting Roles */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Recommended Target Roles
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Based on your current balance of languages, frameworks, and project experience:
              </p>
              <div className="space-y-1.5">
                {currentAnalysis.recommendedRoles.map((role, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center justify-between"
                  >
                    <span>{role}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Section 2: Section Health Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Resume Section Health Analysis
                </h3>
              </div>
              <span className="text-xs text-slate-400">Status & Recommendations</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentAnalysis.sectionAnalysis.map((item, idx) => {
                const isStrong = item.status === 'Strong';
                const isImprove = item.status === 'Needs Improvement';
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">{item.section}</h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isStrong
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : isImprove
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                      {item.notes}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Strengths vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Key Strengths Identified
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {currentAnalysis.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Skills */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  High-Demand Missing Skills
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Skills frequently required by recruiters for your profile that were not found in your text:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentAnalysis.missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Action Plan & Improvements */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Concrete Improvement Recommendations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Actionable Suggestions:</h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  {currentAnalysis.improvementSuggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Recommended ATS Keywords:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentAnalysis.recommendedKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900"
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                <div className="pt-3">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-1.5">3-Step Action Plan:</h4>
                  <div className="space-y-1.5">
                    {currentAnalysis.actionPlan.map(act => (
                      <div key={act.step} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {act.step}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{act.title}</p>
                          <p className="text-[11px] text-slate-500">{act.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 italic text-center">
              {currentAnalysis.disclaimer}
            </div>
          </div>

          {/* Section 5: Previous Analyses History */}
          {previousAnalyses.length > 1 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <History className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Previous Resume Evaluations ({previousAnalyses.length})
                </h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {previousAnalyses.map(item => (
                  <div
                    key={item.id || item.createdAt}
                    onClick={() => setCurrentAnalysis(item)}
                    className="py-2.5 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg transition"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.fileName}</span>
                      <span className="text-[11px] text-slate-400">• {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="font-bold text-emerald-600">{item.score}/100</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Upload Modal */}
      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </div>
  );
}
