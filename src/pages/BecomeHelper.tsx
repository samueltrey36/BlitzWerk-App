import React, { useState, useEffect } from "react";
import { MapPin, Navigation, DollarSign, CheckCircle, Loader2, Signal, Clock } from "lucide-react";
import { useJobStore } from "../lib/jobStore";
import { useAuth } from "../lib/authStore";

type HelperState =
  | 'OFFLINE'
  | 'SEARCHING'
  | 'INCOMING_REQUEST'
  | 'WAITING_CONFIRMATION'
  | 'JOB_ACCEPTED'
  | 'JOB_IN_PROGRESS'
  | 'JOB_COMPLETE';

export default function BecomeHelper() {
  const [state, setState] = useState<HelperState>('OFFLINE');
  const { job, updateJob, resetJob } = useJobStore();
  const { user } = useAuth();

  const getIssueLabel = (val: string) => {
    switch (val) {
      case "flat_tire": return "Flat Tire";
      case "jump_start": return "Jump Start";
      case "fuel_delivery": return "Fuel Delivery";
      case "towing": return "Towing";
      default: return "Emergency Service";
    }
  };

  // Sync state machine with incoming requests
  useEffect(() => {
    if (state === 'SEARCHING' && job.status === 'searching') {
      setState('INCOMING_REQUEST');
    }
    // Listen for customer confirming the job
    if (state === 'WAITING_CONFIRMATION' && job.status === 'confirmed') {
      setState('JOB_ACCEPTED');
    }
    if (job.status === 'canceled_by_customer') {
      if (state !== 'OFFLINE' && state !== 'SEARCHING') {
        alert('The customer canceled the job.');
      }
      resetJob();
      if (state !== 'OFFLINE') setState('SEARCHING');
    }
  }, [state, job.status, resetJob]);

  // Handle live helper location tracking
  useEffect(() => {
    let watchId: number;
    if (state !== 'OFFLINE' && state !== 'JOB_COMPLETE') {
      if ("geolocation" in navigator) {
        if (!job.helperLocation) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          updateJob({ helperLocation: "Fetching location..." });
        }
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const loc = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
            updateJob({ helperLocation: loc });
          },
          (error) => {
            console.error("Location tracking error:", error);
            updateJob({ helperLocation: "Location unavailable" });
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      } else {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        updateJob({ helperLocation: "Geolocation not supported" });
      }
    } else {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      updateJob({ helperLocation: "" });
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const calculateDistance = () => {
    if (!job.location || !job.helperLocation) return null;
    const [lat1, lon1] = job.location.split(',').map(Number);
    const [lat2, lon2] = job.helperLocation.split(',').map(Number);
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return null;

    const R = 3958.8; // miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return dist < 0.1 ? "0.1" : dist.toFixed(1);
  };

  const handleGoOnline = () => {
    if (job.status === 'searching') setState('INCOMING_REQUEST');
    else setState('SEARCHING');
  };

  const handleAccept = () => {
    const distStr = calculateDistance();
    const estEta = distStr ? Math.max(1, Math.ceil(parseFloat(distStr) * 3)) : 8;
    updateJob({
      status: 'pending_confirmation',
      eta: estEta,
      price: 45,
      helperName: user?.fullName || ''
    });
    setState('WAITING_CONFIRMATION');
  };

  const handleDecline = () => setState('SEARCHING');

  const handleArrived = () => {
    updateJob({ status: 'arrived' });
    setState('JOB_IN_PROGRESS');
  };

  const handleComplete = () => {
    updateJob({ status: 'completed' });
    setState('JOB_COMPLETE');
  };

  const handleBackOnline = () => {
    resetJob();
    setState('SEARCHING');
  };

  const handleCancelJob = () => {
    updateJob({ status: 'canceled_by_helper' });
    setState('SEARCHING');
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)] overflow-hidden bg-gray-100 flex flex-col pt-0 mt-0">
      {/* Map Placeholder Layer */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] bg-gray-100 opacity-80"></div>
        {/* Simple map street lines simulation */}
        <div className="absolute inset-0 opacity-20 transition-opacity duration-1000 ease-in-out">
          <div className="absolute top-[30%] left-0 right-0 h-4 bg-gray-400 rotate-12 origin-left"></div>
          <div className="absolute top-0 bottom-0 left-[40%] w-6 bg-gray-400 -rotate-12 origin-top"></div>
          <div className="absolute top-[60%] left-0 right-0 h-3 bg-gray-300 -rotate-3 origin-right"></div>
        </div>

        {/* Map Elements based on state */}
        {state === 'SEARCHING' && (
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-20 h-20 bg-brand/30 rounded-full animate-ping absolute -top-10 -left-10"></div>
              <div className="w-4 h-4 bg-brand rounded-full absolute -top-2 -left-2 shadow-lg border-2 border-white"></div>
            </div>
          </div>
        )}

        {/* Approximate area during incoming request */}
        {(state === 'INCOMING_REQUEST' || state === 'WAITING_CONFIRMATION') && (
          <div className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 animate-in fade-in duration-500">
            <div className="w-48 h-48 bg-brand/15 rounded-full animate-pulse border-2 border-brand/20 backdrop-blur-sm"></div>
          </div>
        )}

        {/* Exact map pin after accepting */}
        {(state === 'JOB_ACCEPTED' || state === 'JOB_IN_PROGRESS') && (
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 animate-in zoom-in fade-in duration-500">
            <div className="relative">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full shadow-2xl border-2 border-white absolute -top-5 -left-5">
                <MapPin className="w-5 h-5 text-white fill-current" />
              </div>
              <div className="w-20 h-20 bg-gray-900/10 rounded-full absolute -top-10 -left-10 animate-ping"></div>
            </div>
          </div>
        )}
      </div>

      {/* Online Status Bar */}
      {state !== 'OFFLINE' && state !== 'JOB_COMPLETE' && (
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-gray-900 text-white px-5 py-2.5 rounded-full shadow-lg border border-gray-800 flex items-center space-x-2.5 text-sm font-semibold tracking-wide backdrop-blur-md bg-gray-900/90">
            <Signal className="w-4 h-4 text-green-400" />
            <span>ONLINE</span>
          </div>
        </div>
      )}

      {/* Bottom Sheet Interface */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-4 pb-8 sm:p-6 sm:pb-10 max-w-md mx-auto w-full">
        {/* Container for the cards with staggered animations */}
        <div className="bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 w-full transform transition-all duration-300 ease-in-out translate-y-0 ring-1 ring-gray-900/5">

          {/* OFFLINE STATE */}
          {state === 'OFFLINE' && (
            <div className="text-center space-y-8 py-2 animate-in fade-in duration-300">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 border-8 border-white shadow-sm ring-1 ring-gray-100">
                <Signal className="w-10 h-10 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">You are offline</h2>
                <p className="text-gray-500 text-base">Go online to start receiving assistance requests.</p>
              </div>
              <button
                onClick={handleGoOnline}
                className="w-full py-4.5 px-4 bg-brand text-white rounded-2xl font-bold text-lg hover:bg-brand/90 transition-all shadow-xl shadow-brand/25 active:scale-[0.98] h-14"
              >
                GO ONLINE
              </button>
            </div>
          )}

          {/* SEARCHING STATE */}
          {state === 'SEARCHING' && (
            <div className="text-center space-y-8 py-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-brand/10 rounded-full animate-ping [animation-duration:2s]"></div>
                <div className="relative w-16 h-16 bg-brand rounded-full flex items-center justify-center shadow-xl shadow-brand/30">
                  <Loader2 className="w-8 h-8 text-white animate-spin [animation-duration:1.5s]" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Looking for jobs</h2>
                <p className="text-gray-500 text-base font-medium">Finding nearby requests...</p>
              </div>
            </div>
          )}

          {/* INCOMING REQUEST STATE */}
          {state === 'INCOMING_REQUEST' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 font-bold rounded-lg text-xs tracking-wider border border-red-200 shadow-sm">
                    URGENT REQUEST
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-none pt-1">
                    {job.issueType ? getIssueLabel(job.issueType) : 'Flat Tire Repair'}
                  </h2>
                  <div className="flex items-center text-gray-600 space-x-1.5 font-medium pt-1">
                    <MapPin className="w-4 h-4 text-brand opacity-50" />
                    <span className="truncate max-w-[200px]">Customer nearby {calculateDistance() ? `(~${calculateDistance()} miles)` : ''}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-start justify-end text-brand">
                    <span className="text-xl font-bold mt-1 text-gray-400">$</span>
                    <span className="text-4xl font-black tracking-tighter">45</span>
                  </div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mt-1">Est. Payout</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Customer</span>
                  <span className="font-bold text-gray-900">{job.customerName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Vehicle</span>
                  <span className="font-bold text-gray-900">{job.customerVehicle || 'Vehicle details unavailable'}</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleDecline}
                  className="flex-[0.4] h-14 bg-gray-100 text-gray-700 rounded-2xl font-bold text-base hover:bg-gray-200 transition-all active:scale-[0.98] border border-gray-200"
                >
                  DECLINE
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-[0.6] h-14 bg-brand text-white rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 hover:bg-brand/90 transition-all shadow-xl shadow-brand/25 active:scale-[0.98]"
                >
                  ACCEPT
                </button>
              </div>
            </div>
          )}

          {/* WAITING CONFIRMATION STATE */}
          {state === 'WAITING_CONFIRMATION' && (
            <div className="text-center space-y-8 py-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-ping [animation-duration:2s]"></div>
                <div className="relative w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/30">
                  <Clock className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Pending Confirmation</h2>
                <p className="text-gray-500 text-base font-medium">Waiting for customer to confirm helper...</p>
              </div>
              <button
                onClick={handleCancelJob}
                className="text-gray-500 rounded-2xl font-bold text-sm hover:text-gray-700 transition-all mt-4"
              >
                Cancel Job
              </button>
            </div>
          )}

          {/* JOB ACCEPTED STATE */}
          {state === 'JOB_ACCEPTED' && (
            <div className="text-center space-y-7 animate-in slide-in-from-right-8 fade-in duration-500">
              <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto text-brand ring-4 ring-brand/5">
                <Navigation className="w-10 h-10 fill-brand" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Navigate to customer</h2>
                <p className="text-gray-600 font-medium">{job.location || '123 Main St, Springfield'} {calculateDistance() ? `• ${calculateDistance()} mi away` : ''}</p>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 flex items-center justify-between border border-green-100 text-left">
                <div>
                  <p className="text-sm text-green-900 font-bold mb-0.5">Customer requested help!</p>
                  <p className="text-xs text-green-700 font-medium">{job.customerName ? job.customerName.split(' ')[0] : 'The customer'} has been notified you are on the way.</p>
                </div>
              </div>

              <button
                onClick={handleArrived}
                className="w-full h-14 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 active:scale-[0.98] mt-2"
              >
                ARRIVED
              </button>
              <button
                onClick={handleCancelJob}
                className="w-full py-3 text-gray-500 font-bold text-sm hover:text-gray-700 transition-all mt-2"
              >
                Cancel Job
              </button>
            </div>
          )}

          {/* JOB IN PROGRESS STATE */}
          {state === 'JOB_IN_PROGRESS' && (
            <div className="text-center space-y-7 animate-in scale-in-95 fade-in duration-500">
              <div className="relative w-24 h-24 mx-auto pt-2">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse [animation-duration:2s]"></div>
                <div className="relative w-full h-full flex items-center justify-center text-blue-600 ring-4 ring-white rounded-full bg-blue-50 shadow-sm">
                  <div className="space-y-1">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Service in progress</h2>
                <p className="text-gray-600 font-medium">{job.issueType ? getIssueLabel(job.issueType) : 'Service'} for {job.customerName ? job.customerName.split(' ')[0] : 'the customer'}.</p>
              </div>

              <div className="text-sm text-left bg-gray-50 p-4 rounded-2xl text-gray-600 border border-gray-100 font-medium leading-relaxed">
                <span className="font-bold text-gray-900">Safety reminder:</span> Ensure you and the customer are safely away from traffic while working.
              </div>

              <button
                onClick={handleComplete}
                className="w-full h-14 bg-brand text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-brand/90 transition-all shadow-xl shadow-brand/25 active:scale-[0.98] mt-2"
              >
                <CheckCircle className="w-6 h-6" />
                <span>COMPLETE JOB</span>
              </button>
              <button
                onClick={handleCancelJob}
                className="w-full py-3 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded-xl transition-all mt-2"
              >
                Abandon Job
              </button>
            </div>
          )}

          {/* JOB COMPLETE STATE */}
          {state === 'JOB_COMPLETE' && (
            <div className="text-center space-y-7 animate-in zoom-in-95 fade-in duration-500">
              <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto border-8 border-white shadow-lg relative">
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                <CheckCircle className="w-14 h-14 text-green-600 relative z-10" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Great work!</h2>
                <p className="text-gray-500 font-medium">Job completed successfully.</p>
              </div>

              <div className="py-6 bg-gray-50 rounded-[2rem] mx-2 border border-gray-100 shadow-inner">
                <p className="text-sm text-gray-400 uppercase tracking-widest font-black mb-1">Total Earnings</p>
                <div className="flex items-start justify-center text-green-600">
                  <span className="text-3xl font-bold mt-1.5 opacity-80">$</span>
                  <span className="text-6xl font-black tracking-tighter">45</span>
                  <span className="text-3xl font-bold mt-1.5 opacity-80">.00</span>
                </div>
              </div>

              <button
                onClick={handleBackOnline}
                className="w-full h-14 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 active:scale-[0.98] mt-2"
              >
                BACK ONLINE
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
