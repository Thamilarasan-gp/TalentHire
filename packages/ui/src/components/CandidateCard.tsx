import React from 'react';
import { Candidate } from '@thamilarasan/types';
import { StatusBadge } from './StatusBadge';
import { ScoreBar } from './ScoreBar';
import { Button } from './Button';
import { cn } from '../utils';
import { ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';

export interface CandidateCardProps {
  candidate: Candidate;
  matchScore?: number;
  evaluationScore?: number;
  onViewProfile?: (candidate: Candidate) => void;
  onAction?: (candidate: Candidate) => void;
  actionLabel?: string;
  className?: string;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  matchScore = 92,
  evaluationScore = 88,
  onViewProfile,
  onAction,
  actionLabel = 'View Evaluation',
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between',
        className
      )}
    >
      {/* TOP: Identity, Role, Verified Badge, State */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-lg shadow-inner">
              {candidate.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 text-base tracking-tight hover:text-blue-600 transition-colors">
                  {candidate.fullName}
                </h4>
                {candidate.verifiedBadge && (
                  <span title="Verified by Evaluator Network">
                    <ShieldCheck className="w-4 h-4 text-blue-600 inline" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{candidate.headline}</p>
            </div>
          </div>
          <StatusBadge status={candidate.state} size="sm" />
        </div>

        {/* METADATA PILLS: Location, Experience, Notice Period */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-5 py-2 border-y border-slate-100">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {candidate.location}
          </span>
          <span>•</span>
          <span>{candidate.totalYearsOfExperience} yrs exp</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {candidate.noticePeriodDays}d notice
          </span>
        </div>

        {/* MIDDLE: Match Score + Evaluation Score */}
        <div className="grid grid-cols-2 gap-4 mb-5 p-3.5 bg-slate-50/70 border border-slate-100 rounded-lg">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Match Score
            </span>
            <ScoreBar score={matchScore} size="sm" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Evaluation
            </span>
            <ScoreBar score={evaluationScore} size="sm" />
          </div>
        </div>

        {/* SKILL TAGS */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {candidate.skills.slice(0, 4).map((skill) => (
            <span
              key={skill.name}
              className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200/50"
            >
              {skill.name}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="text-xs font-medium px-2 py-1 bg-slate-50 text-slate-500 rounded-md border border-dashed border-slate-200">
              +{candidate.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* BOTTOM: Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile?.(candidate)}
          className="flex-1"
        >
          View Profile
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onAction?.(candidate)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5 ml-1" />}
          className="flex-1"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};
