import { Job, UserProfile } from './supabase';

export interface JobMatch extends Job {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export function calculateJobMatch(job: Job, userProfile: UserProfile): JobMatch {
  const userSkills = userProfile.skills.map(s => s.toLowerCase());
  const userInterests = userProfile.interests.map(i => i.toLowerCase());
  const requiredSkills = job.required_skills.map(s => s.toLowerCase());
  const jobCategory = job.category.toLowerCase();

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  requiredSkills.forEach(skill => {
    if (userSkills.includes(skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  let matchPercentage = 0;

  if (requiredSkills.length > 0) {
    const skillMatch = (matchedSkills.length / requiredSkills.length) * 80;
    matchPercentage += skillMatch;
  }

  const interestMatch = userInterests.some(interest =>
    jobCategory.includes(interest) || interest.includes(jobCategory.split(' ')[0])
  );

  if (interestMatch) {
    matchPercentage += 20;
  }

  return {
    ...job,
    matchPercentage: Math.round(matchPercentage),
    matchedSkills,
    missingSkills
  };
}

export function sortJobsByMatch(jobs: Job[], userProfile: UserProfile): JobMatch[] {
  return jobs
    .map(job => calculateJobMatch(job, userProfile))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}
