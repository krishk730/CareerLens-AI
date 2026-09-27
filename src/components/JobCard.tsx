import React from 'react';
import { Bookmark, BookmarkCheck, ExternalLink, Sparkles, MapPin, Briefcase, Clock, Building2 } from 'lucide-react';
import { JobOpportunity } from '../types/index';

interface JobCardProps {
  job: JobOpportunity;
  isSaved: boolean;
  onToggleSave: (job: JobOpportunity) => void;
  onApply: (job: JobOpportunity) => void;
  onViewMatch: (job: JobOpportunity) => void;
  matchScore?: number;
}

export function JobCard({
  job,
  isSaved,
  onToggleSave,
  onApply,
  onViewMatch,
  matchScore
}: JobCardProps) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-blue-400/60 dark:hover:border-blue-600/60 transition-all duration-200 flex flex-col justify-between">
      
      {/* Top row: Company, Title, Save */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden flex items-center justify-center shrink-0">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to building icon on broken image
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {job.company}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {job.title}
              </h4>
            </div>
          </div>

          <button
            onClick={() => onToggleSave(job)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isSaved
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Opportunity'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Badges / Meta row */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <MapPin className="w-3 h-3 text-slate-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
            {job.workplaceType}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900">
            <Briefcase className="w-3 h-3 text-purple-400" />
            {job.jobType}
          </span>
          {job.salaryRange && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-auto text-xs">
              {job.salaryRange}
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {job.requiredSkills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span className="px-1.5 py-0.5 rounded-md text-[11px] text-slate-400 font-medium">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{job.postedDate}</span>
          {job.deadline && <span className="hidden sm:inline">• {job.deadline}</span>}
        </div>

        <div className="flex items-center gap-2">
          {/* AI Match Button */}
          <button
            onClick={() => onViewMatch(job)}
            className="px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 hover:bg-indigo-100/70 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            {matchScore ? `${matchScore}% Match` : 'AI Match'}
          </button>

          {/* Apply Button */}
          <button
            onClick={() => onApply(job)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            Apply <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
