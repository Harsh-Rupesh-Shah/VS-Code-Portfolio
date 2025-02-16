import React, { useEffect } from 'react';
import { useGitHubStore } from '../store/useGitHubStore';
import { useThemeStore } from '../store/useThemeStore';
import { GitBranch, GitCommit, Star, GitFork } from 'lucide-react';
import { cn } from '../utils/cn';

const GITHUB_USERNAME = 'johndoe'; // Replace with your GitHub username

export const GitHubActivity = () => {
  const { activities, loading, error, fetchActivities } = useGitHubStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    fetchActivities(GITHUB_USERNAME);
    const interval = setInterval(() => {
      fetchActivities(GITHUB_USERNAME);
    }, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [fetchActivities]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        Loading GitHub activities...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error}
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return <GitCommit className="w-4 h-4" />;
      case 'CreateEvent':
        return <GitBranch className="w-4 h-4" />;
      case 'repo':
        return <GitFork className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getEventDescription = (activity: any) => {
    if (activity.type === 'repo') {
      return (
        <div>
          <a 
            href={activity.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            {activity.name}
          </a>
          <p className="text-sm opacity-75">{activity.description}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {activity.stargazers_count}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              {activity.forks_count}
            </span>
          </div>
        </div>
      );
    }

    switch (activity.type) {
      case 'PushEvent':
        return (
          <div>
            Pushed to{' '}
            <a 
              href={`https://github.com/${activity.repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              {activity.repo.name}
            </a>
          </div>
        );
      case 'CreateEvent':
        return (
          <div>
            Created {activity.payload.ref_type} in{' '}
            <a 
              href={`https://github.com/${activity.repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              {activity.repo.name}
            </a>
          </div>
        );
      default:
        return (
          <div>
            Activity in{' '}
            <a 
              href={`https://github.com/${activity.repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              {activity.repo.name}
            </a>
          </div>
        );
    }
  };

  return (
    <div 
      className="h-full overflow-hidden flex flex-col"
      style={{ backgroundColor: theme.editor }}
    >
      <div 
        className="p-4 border-b font-medium"
        style={{ borderColor: theme.border }}
      >
        Recent GitHub Activity
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg",
                "border border-opacity-10 hover:border-opacity-20",
                "transition-colors duration-200"
              )}
              style={{ borderColor: theme.border }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getEventIcon(activity.type)}</div>
                <div className="flex-1">
                  {getEventDescription(activity)}
                  <div className="text-sm opacity-50 mt-2">
                    {new Date(
                      activity.type === 'event' ? activity.created_at : activity.updated_at
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};