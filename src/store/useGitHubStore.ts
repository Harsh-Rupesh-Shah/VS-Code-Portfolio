import { create } from 'zustand';
import { Octokit } from 'octokit';

interface GitHubState {
  activities: any[];
  loading: boolean;
  error: string | null;
  fetchActivities: (username: string) => Promise<void>;
}

const octokit = new Octokit();

export const useGitHubStore = create<GitHubState>((set) => ({
  activities: [],
  loading: false,
  error: null,
  fetchActivities: async (username: string) => {
    set({ loading: true, error: null });
    try {
      const [eventsResponse, reposResponse] = await Promise.all([
        octokit.request('GET /users/{username}/events/public', { username }),
        octokit.request('GET /users/{username}/repos', { 
          username,
          sort: 'updated',
          per_page: 5
        })
      ]);

      const activities = [
        ...eventsResponse.data.map((event: any) => ({
          type: 'event',
          ...event
        })),
        ...reposResponse.data.map((repo: any) => ({
          type: 'repo',
          ...repo
        }))
      ].sort((a, b) => {
        const dateA = a.type === 'event' ? new Date(a.created_at) : new Date(a.updated_at);
        const dateB = b.type === 'event' ? new Date(b.created_at) : new Date(b.updated_at);
        return dateB.getTime() - dateA.getTime();
      });

      set({ activities, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch GitHub activities', loading: false });
    }
  }
}));