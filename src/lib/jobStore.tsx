import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type JobStatus = 'idle' | 'searching' | 'pending_confirmation' | 'confirmed' | 'arrived' | 'in-progress' | 'completed' | 'canceled_by_customer' | 'canceled_by_helper';

export interface JobState {
  status: JobStatus;
  issueType: string;
  location: string;
  eta: number;
  price: number;
  helperLocation?: string;
  customerVehicle?: string;
  customerName?: string;
  helperName?: string;
  helperVehicle?: string;
}

const defaultState: JobState = {
  status: 'idle',
  issueType: '',
  location: '',
  eta: 0,
  price: 0
};

interface JobContextType {
  job: JobState;
  updateJob: (updates: Partial<JobState>) => void;
  resetJob: () => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [job, setJob] = useState<JobState>(defaultState);
  const mounted = useRef(true);

  // Poll backend for state updates
  useEffect(() => {
    mounted.current = true;

    const fetchJob = async () => {
      try {
        const res = await fetch('/api/job');
        if (res.ok && mounted.current) {
          const data = await res.json();
          // Only update if state actually changed to prevent unnecessary re-renders
          setJob(prev => JSON.stringify(prev) !== JSON.stringify(data) ? data : prev);
        }
      } catch (err) {
        // Silently catch network errors if backend is down
      }
    };

    // Initial fetch
    fetchJob();

    // Poll every 2 seconds
    const interval = setInterval(fetchJob, 2000);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, []);

  const updateJob = async (updates: Partial<JobState>) => {
    // Optimistic update
    setJob((prev) => ({ ...prev, ...updates }));

    // Push to backend
    try {
      await fetch('/api/job', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.error('Failed to update job on backend', err);
    }
  };

  const resetJob = async () => {
    setJob(defaultState);
    try {
      await fetch('/api/job/reset', { method: 'POST' });
    } catch (err) {
      console.error('Failed to reset job on backend', err);
    }
  };

  return (
    <JobContext.Provider value={{ job, updateJob, resetJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobStore = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobStore must be used within a JobProvider');
  }
  return context;
};
