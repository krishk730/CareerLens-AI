import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Lightbulb,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { CareerRecommendationItem } from '../types/index';
import { fetchCareerRecommendations } from '../services/apiClient';
import { CircularProgress } from '../components/CircularProgress';
import { DEMO_RECOMMENDATIONS } from '../data/demoData';

export function CareerRecommendationsPage() {
  const { userProfile, isDemoUser } = useAuth();
  const { showToast } = useNotifications();

  const [recommendations, setRecommendations] = useState<CareerRecommendationItem[]>(
    isDemoUser ? DEMO_RECOMMENDATIONS : []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isDemoUser && userProfile) {
      loadRecommendations();
    }
  }, [userProfile, isDemoUser]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const recs = await fetchCareerRecommendations(userProfile || {});
      setRecommendations(recs);
    } catch (err) {
      console.error(err);
      setRecommendations(DEMO_RECOMMENDATIONS);
      showToast('Loaded smart career recommendations based on your profile.', 'info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              AI Career Path Recommendations
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-600 text-white">
              Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Synthesized from your coursework, declared skills, portfolio projects, and labor market demand trajectories.
          </p>
        </div>

        <button
          onClick={loadRecommendations}
          disabled={loading}
          className="py-3 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer self-start sm:self-auto transition disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Re-evaluate Career Paths
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-800 dark:text-white">
            Synthesizing potential career paths with Gemini AI...
          </p>
          <p className="text-xs text-slate-400">Evaluating role crossover and market demand.</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <Compass className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">No recommendations generated yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Complete your profile skills or upload a resume to trigger AI-powered career path recommendations.
          </p>
          <button
            onClick={loadRecommendations}
            className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
          >
            Generate Recommendations
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-5 hover:border-blue-400 transition"
              >
                <div>
                  {/* Header: Title, Fit & Demand */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-500" />
                          {item.marketDemand} Demand
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
                        {item.role}
                      </h3>
                    </div>

                    <div className="shrink-0 text-center">
                      <CircularProgress
                        value={item.fitPercentage}
                        size={65}
                        strokeWidth={5}
                        sublabel="Fit"
                      />
                    </div>
                  </div>

                  {/* Why it fits rationale */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {item.whyFits}
                  </p>

                  {/* Required vs Missing Skills */}
                  <div className="space-y-3 mt-4 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Core Competencies:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.requiredSkills.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {item.missingSkills?.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block mb-1">
                          Gaps to Bridge:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.missingSkills.map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-[11px] font-medium"
                            >
                              + {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggested Next Steps */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Lightbulb className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Recommended Next Steps:</span>
                  </div>
                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-600 dark:text-slate-300">
                    {item.suggestedNextSteps.map((step, sIdx) => (
                      <li key={sIdx} className="leading-snug">{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-center italic">
            Advisory Notice: Career recommendations are AI-assisted guidelines based on current skills and public industry job descriptions. They do not constitute guarantees of hiring or placement.
          </div>
        </div>
      )}
    </div>
  );
}
