import { Briefcase, MapPin, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { JobMatch } from '../lib/matching';

interface JobCardProps {
  job: JobMatch;
}

export default function JobCard({ job }: JobCardProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Partial Match';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
        <div className={`flex flex-col items-center px-4 py-2 rounded-lg ${getMatchColor(job.matchPercentage)}`}>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-5 h-5" />
            <span className="text-2xl font-bold">{job.matchPercentage}%</span>
          </div>
          <span className="text-xs font-medium">{getMatchLabel(job.matchPercentage)}</span>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{job.job_type}</span>
        </div>
        {job.salary_range && (
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary_range}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Briefcase className="w-4 h-4" />
          <span>{job.category}</span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm font-semibold text-gray-700 mb-2">Your Matching Skills:</p>
        <div className="flex flex-wrap gap-2">
          {job.matchedSkills.length > 0 ? (
            job.matchedSkills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No matching skills</span>
          )}
        </div>
      </div>

      {job.missingSkills.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Skills to Learn:</p>
          <div className="flex flex-wrap gap-2">
            {job.missingSkills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
