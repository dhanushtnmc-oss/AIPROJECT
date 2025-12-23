import { useState, useEffect } from 'react';
import { Sparkles, Briefcase } from 'lucide-react';
import UserProfileForm from './components/UserProfileForm';
import JobCard from './components/JobCard';
import { supabase, UserProfile, Job } from './lib/supabase';
import { sortJobsByMatch, JobMatch } from './lib/matching';

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
    } else if (data) {
      setJobs(data);
    }
  };

  const handleProfileCreate = async (profileData: Omit<UserProfile, 'id' | 'created_at'>) => {
    setLoading(true);

    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', profileData.email)
      .maybeSingle();

    let profile: UserProfile;

    if (existingProfile) {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          name: profileData.name,
          skills: profileData.skills,
          interests: profileData.interests
        })
        .eq('id', existingProfile.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        setLoading(false);
        return;
      }
      profile = data;
    } else {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        setLoading(false);
        return;
      }
      profile = data;
    }

    setUserProfile(profile);
    const sorted = sortJobsByMatch(jobs, profile);
    setMatchedJobs(sorted);
    setLoading(false);
  };

  const handleReset = () => {
    setUserProfile(null);
    setMatchedJobs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Job Matcher</h1>
                <p className="text-sm text-gray-600">Find your perfect career match powered by AI</p>
              </div>
            </div>
            {userProfile && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                New Search
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!userProfile ? (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Discover Your Dream Job
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tell us about your skills and interests, and we'll match you with the perfect opportunities
              </p>
            </div>
            <UserProfileForm onProfileCreate={handleProfileCreate} />
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
          </div>
        ) : (
          <div>
            <div className="mb-8 bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome, {userProfile.name}!
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-sm text-gray-600">Your Skills:</span>
                    {userProfile.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {userProfile.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-gray-600">Your Interests:</span>
                      {userProfile.interests.map(interest => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Briefcase className="w-6 h-6" />
                    <span className="text-3xl font-bold">{matchedJobs.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Jobs Found</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Recommended Jobs for You
              </h3>
              <p className="text-gray-600">Sorted by match percentage</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {matchedJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {matchedJobs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600">
                  Try updating your skills or interests to find matching opportunities
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Powered by AI matching algorithms to help you find the perfect career opportunity
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
