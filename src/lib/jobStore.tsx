import React, { createContext, useContext, useState, useEffect } from 'react';

export type JobStatus = 'idle' | 'searching' | 'pending_confirmation' | 'confirmed' | 'arrived' | 'in-progress' | 'completed' | 'canceled_by_customer' | 'canceled_by_helper';

export interface JobState {
  status: JobStatus;
  issueType: string;
  location: string;
  eta: number;
  price: number;
  helperLocation?: string;
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
  const [job, setJob] = useState<JobState>(() => {
    try {
      const saved = localStorage.getItem('blitzwerk_job');
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  const updateJob = (updates: Partial<JobState>) => {
    setJob((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('blitzwerk_job', JSON.stringify(next));
      return next;
    });
  };

  const resetJob = () => {
    setJob(defaultState);
    localStorage.removeItem('blitzwerk_job');
  };

  // Sync state across multiple browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'blitzwerk_job') {
        if (e.newValue) {
          try {
            setJob(JSON.parse(e.newValue));
          } catch (error) {
            console.error('Failed to parse blitzwerk_job from storage event', error);
          }
        } else {
          setJob(defaultState);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
