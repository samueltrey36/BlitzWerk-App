import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';

export type JobStatus = 'idle' | 'searching' | 'pending_confirmation' | 'confirmed' | 'arrived' | 'in-progress' | 'completed' | 'canceled_by_customer' | 'canceled_by_helper';

export interface JobState {
  id?: string;
  customerId?: string;
  helperId?: string;
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

const mapDbToJobState = (db: any): JobState => ({
  id: db.id,
  customerId: db.customer_id,
  helperId: db.helper_id,
  status: db.status as JobStatus,
  issueType: db.issue_type || '',
  location: db.location || '',
  eta: Number(db.eta) || 0,
  price: Number(db.price) || 0,
  helperLocation: db.helper_location || '',
  customerVehicle: db.customer_vehicle || '',
  customerName: db.customer_name || '',
  helperName: db.helper_name || '',
  helperVehicle: db.helper_vehicle || '',
});

const mapJobStateToDb = (state: Partial<JobState>) => {
  const db: any = {};
  if (state.customerId !== undefined) db.customer_id = state.customerId;
  if (state.helperId !== undefined) db.helper_id = state.helperId;
  if (state.status !== undefined) db.status = state.status;
  if (state.issueType !== undefined) db.issue_type = state.issueType;
  if (state.location !== undefined) db.location = state.location;
  if (state.eta !== undefined) db.eta = state.eta;
  if (state.price !== undefined) db.price = state.price;
  if (state.helperLocation !== undefined) db.helper_location = state.helperLocation;
  if (state.customerVehicle !== undefined) db.customer_vehicle = state.customerVehicle;
  if (state.customerName !== undefined) db.customer_name = state.customerName;
  if (state.helperName !== undefined) db.helper_name = state.helperName;
  if (state.helperVehicle !== undefined) db.helper_vehicle = state.helperVehicle;
  return db;
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [job, setJob] = useState<JobState>(defaultState);
  const jobRef = useRef<JobState>(defaultState);

  // Keep a ref synced for use inside callbacks without triggering re-renders
  useEffect(() => {
    jobRef.current = job;
  }, [job]);

  useEffect(() => {
    // Attempt to grab an active or searching job initially
    const fetchLatestJob = async () => {
      const current = jobRef.current;
      if (current.id && !['idle', 'canceled_by_customer', 'canceled_by_helper', 'completed'].includes(current.status)) return;

      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'searching')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setJob(mapDbToJobState(data));
      }
    };

    fetchLatestJob();

    // Supabase Realtime Subscription
    const channel = supabase.channel("public:jobs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        (payload) => {
          const changedJob = payload.new as any;

          if (!changedJob) return; // handles deletions if any

          setJob((currentJob) => {
            if (currentJob.id) {
              if (currentJob.id === changedJob.id) {
                return mapDbToJobState(changedJob);
              }

              if (
                ["idle", "canceled_by_customer", "canceled_by_helper", "completed"].includes(currentJob.status) &&
                changedJob.status === "searching"
              ) {
                return mapDbToJobState(changedJob);
              }

              return currentJob;
            } else {
              if (changedJob.status === "searching") {
                return mapDbToJobState(changedJob);
              }
              return currentJob;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateJob = async (updates: Partial<JobState>) => {
    const currentId = jobRef.current.id;

    // --- 1. CREATE JOB (Customer) ---
    if (!currentId) {
      if (updates.status !== "searching") {
        setJob((prev) => {
          const nextState = { ...prev, ...updates };
          jobRef.current = nextState;
          return nextState;
        });
        return; // Optimistic local fallback
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("No authenticated user");

      // Safe creation payload (only customer fields + searching status)
      const insertPayloadDb = {
        customer_id: user.id,
        status: 'searching',
        issue_type: updates.issueType || jobRef.current.issueType,
        location: updates.location || jobRef.current.location,
        eta: updates.eta || jobRef.current.eta,
        price: updates.price || jobRef.current.price,
        customer_vehicle: updates.customerVehicle || jobRef.current.customerVehicle,
        customer_name: updates.customerName || jobRef.current.customerName,
      };

      setJob(prev => {
        const nextState = { ...prev, ...updates, status: 'searching' as JobStatus };
        jobRef.current = nextState;
        return nextState;
      });

      const { data, error } = await supabase
        .from("jobs")
        .insert(insertPayloadDb)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (data) setJob(mapDbToJobState(data));
      return;
    }

    // --- 2. ACCEPT JOB (Helper Claim) ---
    if (updates.status === 'pending_confirmation') {
      if (jobRef.current.status !== 'searching') return; // Already claimed/claiming

      // INSTANT SYNCHRONOUS LOCK: Prevents double-click execution bugs where the second click 
      // executes while `await auth.getUser()` is pausing the first execution's thread.
      jobRef.current.status = 'pending_confirmation';
      setJob(prev => {
        const nextState = { ...prev, status: 'pending_confirmation' as JobStatus };
        return nextState;
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        // Rollback if auth fails to keep store accurate
        jobRef.current.status = 'searching';
        setJob(prev => ({ ...prev, status: 'searching' }));
        return;
      }

      // Atomic update - safe whitelist for claim fields only
      const claimPayload = {
        status: 'pending_confirmation',
        helper_id: user.id,
        helper_name: updates.helperName || '',
        helper_vehicle: updates.helperVehicle || '',
        helper_location: updates.helperLocation || ''
      };

      const { data, error } = await supabase.from('jobs')
        .update(claimPayload)
        .eq('id', currentId)
        .eq('status', 'searching') // The ATOMIC check
        .select()
        .maybeSingle();

      if (!data || error) {
        alert("This job was already accepted by someone else or canceled.");
        setJob(defaultState); // Re-fetch or reset
      } else {
        setJob(mapDbToJobState(data));
      }
      return;
    }

    // --- 3. GENERIC ALLOWED UPDATE ---
    // Prevent pushing unnecessary location updates if unclaimed
    if (jobRef.current.status === 'searching' && Object.keys(updates).length === 1 && updates.helperLocation !== undefined) {
      setJob((prev) => {
        const nextState = { ...prev, helperLocation: updates.helperLocation };
        jobRef.current = nextState;
        return nextState;
      });
      return;
    }

    // Optimistic local update
    setJob((prev) => {
      const nextState = { ...prev, ...updates };
      jobRef.current = nextState;
      return nextState;
    });

    const updatePayload = mapJobStateToDb(updates);
    if (Object.keys(updatePayload).length === 0) return;

    // Only update specified fields based on the whitelist (mapJobStateToDb already handles filtering)
    const { data } = await supabase.from('jobs')
      .update(updatePayload)
      .eq('id', currentId)
      .select()
      .maybeSingle();

    if (data) setJob(mapDbToJobState(data));
  };

  const resetJob = async () => {
    const current = jobRef.current;
    if (current.id && !['idle', 'completed', 'canceled_by_customer', 'canceled_by_helper'].includes(current.status)) {
      try {
        // Generic cancel if abruptly cleared without proper status update
        // If called from BecomeHelper, it implies helper bailed. If from GetHelp, customer bailed.
        // We'll just leave it as canceled_by_customer since it's the safest generic terminal state if not handled explicitly.
        await supabase.from('jobs')
          .update(mapJobStateToDb({ status: 'canceled_by_customer' }))
          .eq('id', current.id);
      } catch (e) { }
    }
    setJob(defaultState);
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
