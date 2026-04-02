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

          console.log("[JobStore][Realtime] subscription received payload", {
            eventType: payload.eventType,
            schema: payload.schema,
            table: payload.table,
            newRowStatus: changedJob?.status,
            newRowId: changedJob?.id,
            newRowCustomerId: changedJob?.customer_id,
          });

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
    console.log("[JobStore] updateJob called", {
      updates,
      currentJobId: jobRef.current.id,
      currentJobStatus: jobRef.current.status,
    });
    // Optimistic fallback for frontend sync
    setJob((prev) => ({ ...prev, ...updates }));

    const currentId = jobRef.current.id;
    console.log("[JobStore] create-branch condition check", {
      currentId,
      updatesStatus: updates?.status,
      willEnterCreateBranch: !currentId && updates?.status === "searching",
    });
    if (!currentId && updates.status === 'searching') {
      console.log("[JobStore] create branch ENTERED", { currentId, updates });

      const {
        data: { user: existingUser },
        error: userErr,
      } = await supabase.auth.getUser();

      console.log("[JobStore] auth.getUser result", {
        hasUser: Boolean(existingUser?.id),
        userId: existingUser?.id ?? null,
        userErr,
      });

      let user = existingUser;

      if (!user?.id) {
        const err = new Error("No authenticated user found; cannot create job row in public.jobs.");
        console.error("[GetHelp Insert] insert error", err);
        throw err;
      }

      const insertPayloadDb = mapJobStateToDb({
        ...jobRef.current,
        ...updates,
        customerId: user.id,
        helperId: null,
        status: 'searching',
      });

      if (insertPayloadDb.customer_id === undefined) {
        console.error('[GetHelp Insert] Missing customer_id in payload', insertPayloadDb);
      }
      if (insertPayloadDb.helper_id !== null) {
        console.error('[GetHelp Insert] helper_id not null as required', insertPayloadDb);
      }
      if (insertPayloadDb.status !== 'searching') {
        console.error("[GetHelp Insert] status not 'searching' as required", insertPayloadDb);
      }

      console.log("[JobStore] insert payload built", {
        payload: insertPayloadDb,
        required: {
          customer_id: insertPayloadDb.customer_id,
          helper_id: insertPayloadDb.helper_id,
          status: insertPayloadDb.status,
        },
      });

      const { data, error } = await supabase
        .from("jobs")
        .insert(insertPayloadDb)
        .select()
        .maybeSingle();

      console.log("[JobStore] insert result/error", {
        data,
        error: error ? {
          name: error.name,
          message: error.message,
          code: (error as any).code,
          details: (error as any).details,
          hint: (error as any).hint,
        } : null,
        insertPayloadDb,
      });

      if (error) throw error;

      if (data) setJob(mapDbToJobState(data));
    } else if (currentId) {
      // Update existing job
      if (updates.status === 'pending_confirmation') {
        // Race Condition Prevention: Ensure job is STILL searching before claiming
        const { data: { user } } = await supabase.auth.getUser();
        const updatePayload = mapJobStateToDb({
          ...updates,
          helperId: user?.id
        });

        const { data, error } = await supabase.from('jobs')
          .update(updatePayload)
          .eq('id', currentId)
          .eq('status', 'pending_confirmation')
          .select()
          .maybeSingle();

        if (!data || error) {
          alert("This job was already accepted by someone else or canceled.");
          // Re-fetch a different open job
          setJob(defaultState);
        } else {
          setJob(mapDbToJobState(data));
        }
      } else {
        // Standard status update
        const { data } = await supabase.from('jobs')
          .update(mapJobStateToDb(updates))
          .eq('id', currentId)
          .select()
          .maybeSingle();
        if (data) setJob(mapDbToJobState(data));
      }
    }
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
