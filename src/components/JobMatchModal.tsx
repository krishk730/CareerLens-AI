import React from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb, ExternalLink } from 'lucide-react';
import { JobOpportunity, JobMatchResult } from '../types/index';
import { CircularProgress } from './CircularProgress';

interface JobMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobOpportunity | null;
  matchResult: JobMatchResult | null;
  loading: boolean;
  onApply: (job: JobOpportunity) => void;
}

export function JobMatchModal({
  isOpen,
  onClose,
  job,
  matchResult,
  loading,
  onApply
}: JobMatchModalProps) {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Opportunity Match Analysis</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluating candidate alignment with role requirements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Target Role & Company Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Target Role
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">{job.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {job.company} • {job.location} ({job.workplaceType})
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {job.jobType}
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Analyzing skill overlap with Gemini AI...
              </p>
              <p className="text-xs text-slate-400">Comparing your profile, projects, and target role criteria</p>
            </div>
          ) : matchResult ? (
            <>
              {/* Match Score Display */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-100 dark:border-slate-700">
                <div className="shrink-0">
                  <CircularProgress
                    value={matchResult.matchScore}
                    size={110}
                    strokeWidth={8}
                    sublabel="AI Match"
                  />
                </div>
                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                    <Sparkles className="w-3 h-3" />
                    CareerLens Fit Rating
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                    {matchResult.matchScore >= 80 ? 'Exceptional Match' : matchResult.matchScore >= 60 ? 'Strong Contender' : 'Moderate Alignment'}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {matchResult.explanation}
                  </p>
                </div>
              </div>

              {/* Matched Skills */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Matching Skills ({matchResult.matchedSkills.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchResult.matchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              {matchResult.missingSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Recommended Skills to Add ({matchResult.missingSkills.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {matchResult.recommendedImprovements?.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>How to Strengthen Your Candidacy:</span>
                  </div>
                  <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-600 dark:text-slate-300">
                    {matchResult.recommendedImprovements.map((tip, idx) => (
                      <li key={idx} className="leading-snug">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center">
                Note: AI Match Score is an advisory estimate based on available profile and role criteria, not a guarantee of selection.
              </p>
            </>
          ) : null}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onApply(job);
                onClose();
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition"
            >
              Apply to Opportunity <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
