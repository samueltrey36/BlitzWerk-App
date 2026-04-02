import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, MapPin, Wrench, Zap, Fuel, Truck, CheckCircle2, Navigation, Clock, CreditCard, ChevronRight, ShieldCheck, Lock, Smartphone } from "lucide-react";
import { useJobStore } from "../lib/jobStore";
import { useAuth } from "../lib/authStore";

export default function GetHelp() {
  const navigate = useNavigate();
  const { job, updateJob, resetJob } = useJobStore();
  const { user } = useAuth();

  // Steps: 1: Issue, 2: Location, 3: Vehicle, 4: Searching, 5: Match, 6: Payment, 7: Tracking, 8: Complete
  const [step, setStep] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState<string>("");
  const [locationStr, setLocationStr] = useState("Getting your location...");
  const [locationError, setLocationError] = useState("");

  const [vehicle, setVehicle] = useState(() => {
    try {
      const saved = localStorage.getItem('blitzwerk_vehicle');
      return saved ? JSON.parse(saved) : { make: '', model: '', year: '', color: '' };
    } catch {
      return { make: '', model: '', year: '', color: '' };
    }
  });

  const CAR_MODELS: Record<string, string[]> = {
    Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Tacoma', 'Other'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'Other'],
    Ford: ['F-150', 'Escape', 'Explorer', 'Focus', 'Mustang', 'Other'],
    Chevrolet: ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Cruze', 'Other'],
    Nissan: ['Altima', 'Sentra', 'Rogue', 'Maxima', 'Other'],
    Other: ['Other']
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvc, setCvc] = useState("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setExpDate(val);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvc(val);
  };

  const isPaymentValid = cardNumber.length >= 19 && expDate.length === 5 && cvc.length >= 3;

  const eta = job.eta || 0;
  const price = job.price || 0;

  // React to global status changes
  useEffect(() => {
    if (job.status === 'searching') setStep(4);
    else if (job.status === 'pending_confirmation') setStep(5);
    else if (job.status === 'confirmed' || job.status === 'arrived' || job.status === 'in-progress') setStep(7);
    else if (job.status === 'completed') setStep(8);
    else if (job.status === 'idle' || job.status === 'canceled_by_customer') setStep(1);
    else if (job.status === 'canceled_by_helper') {
      alert('The helper has canceled the job.');
      resetJob();
      setStep(1);
    }
  }, [job.status, resetJob]);

  // Handle cleanup on unmount or return home
  const goHome = () => {
    resetJob();
    navigate("/");
  };

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStr(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setLocationError("");
        },
        (error) => {
          console.error(error);
          setLocationError("Failed to get location.");
          setLocationStr("Location unavailable");
        }
      );
    } else {
      setLocationError("Geolocation not supported.");
      setLocationStr("Location unavailable");
    }
  };

  useEffect(() => {
    if (step === 2) {
      requestLocation();
    }
  }, [step]);

  const getIssueLabel = (val: string) => {
    switch (val) {
      case "flat_tire": return "Flat Tire";
      case "jump_start": return "Jump Start";
      case "fuel_delivery": return "Fuel Delivery";
      case "towing": return "Towing";
      default: return "";
    }
  };

  return (
    <div className="flex-1 w-full bg-slate-50 min-h-full">
      <div className="max-w-md mx-auto h-full flex flex-col p-4 pt-8 pb-12">
        {/* Header/Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-slate-900">Get Help</h1>
            <span className="text-sm font-medium text-slate-500">Step {step} of 8</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full w-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Issue Selection */}
        {step === 1 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">What's the issue?</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <IssueCard
                icon={<Wrench />} title="Flat Tire" value="flat_tire"
                selected={selectedIssue === "flat_tire"} onClick={() => setSelectedIssue("flat_tire")}
              />
              <IssueCard
                icon={<Zap />} title="Jump Start" value="jump_start"
                selected={selectedIssue === "jump_start"} onClick={() => setSelectedIssue("jump_start")}
              />
              <IssueCard
                icon={<Fuel />} title="Fuel Delivery" value="fuel_delivery"
                selected={selectedIssue === "fuel_delivery"} onClick={() => setSelectedIssue("fuel_delivery")}
              />
              <IssueCard
                icon={<Truck />} title="Towing" value="towing"
                selected={selectedIssue === "towing"} onClick={() => setSelectedIssue("towing")}
              />
            </div>
            <div className="mt-auto pt-6">
              <button
                disabled={!selectedIssue}
                onClick={() => setStep(2)}
                className="w-full py-4 px-6 bg-brand text-white rounded-2xl font-bold text-lg flex justify-between items-center shadow-lg shadow-brand/30 hover:shadow-brand/40 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Continue
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: GPS + Map */}
        {step === 2 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Confirm Location</h2>

            {/* Map Placeholder */}
            <div className="relative w-full h-64 bg-slate-200 rounded-2xl overflow-hidden mb-6 border-2 border-white shadow-md">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <MapPin className="w-10 h-10 text-brand absolute -top-10 -left-5 z-10" fill="currentColor" />
                  <div className="w-10 h-10 bg-brand/30 rounded-full animate-ping absolute -top-10 -left-5" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 mb-auto">
              <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center shrink-0">
                {locationStr === "Getting your location..." ? (
                  <Loader2 className="w-5 h-5 text-brand animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5 text-brand" />
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Detected Area</p>
                <p className={`font-medium ${locationError ? 'text-red-500' : 'text-slate-800'}`}>
                  {locationStr}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setStep(3)}
                className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold text-lg flex justify-center items-center shadow-lg hover:shadow-xl transition-all"
              >
                Confirm Location
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Vehicle Information */}
        {step === 3 && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold mb-6 text-slate-800">Your Vehicle</h2>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Make</label>
                <select
                  value={vehicle.make}
                  onChange={e => setVehicle({ ...vehicle, make: e.target.value, model: '' })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
                >
                  <option value="" disabled>Select Make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                <select
                  value={vehicle.model}
                  onChange={e => setVehicle({ ...vehicle, model: e.target.value })}
                  disabled={!vehicle.make}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none disabled:opacity-50"
                >
                  <option value="" disabled>Select Model</option>
                  {vehicle.make && CAR_MODELS[vehicle.make]?.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                  <select
                    value={vehicle.year}
                    onChange={e => setVehicle({ ...vehicle, year: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
                  >
                    <option value="" disabled>Year</option>
                    {Array.from({ length: 30 }, (_, i) => 2026 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                  <select
                    value={vehicle.color}
                    onChange={e => setVehicle({ ...vehicle, color: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
                  >
                    <option value="" disabled>Color</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Silver">Silver</option>
                    <option value="Gray">Gray</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <button
                disabled={!vehicle.make || !vehicle.model || !vehicle.year || !vehicle.color}
                onClick={() => {
                  console.log("[GetHelp] Request Help clicked - submitting", {
                    selectedIssue,
                    locationStr,
                    vehicle,
                    customerName: user?.fullName || "",
                  });

                  localStorage.setItem('blitzwerk_vehicle', JSON.stringify(vehicle));
                  const vehicleStr = `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.color})`;

                  updateJob({
                    status: 'searching',
                    issueType: selectedIssue,
                    location: locationStr,
                    customerVehicle: vehicleStr,
                    customerName: user?.fullName || ''
                  });
                }}
                className="w-full py-4 px-6 bg-brand text-white rounded-2xl font-bold text-lg flex justify-center items-center shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Request Help
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Searching */}
        {step === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500 text-center py-12">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-brand border-t-transparent border-r-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-8 h-8 text-brand animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Finding a Provider</h2>
            <p className="text-slate-500 mb-8">Scanning network for nearby {getIssueLabel(selectedIssue).toLowerCase()} specialists...</p>
            <button
              onClick={() => {
                updateJob({ status: 'canceled_by_customer' });
                setStep(1);
              }}
              className="py-3 px-6 mt-4 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
            >
              Cancel Request
            </button>
          </div>
        )}

        {/* Step 5: Match Found */}
        {step === 5 && (
          <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Provider Found!</h2>
              <p className="text-slate-500">A top-rated specialist is available.</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 z-10 relative">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex overflow-hidden border-2 border-white shadow-sm shrink-0">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f8fafc" alt="Driver" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{job.helperName}</h3>
                  <p className="text-sm text-slate-500">4.9 ★ • 1,240 jobs</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-bold text-brand">${price}</div>
                  <div className="text-xs text-slate-400">Fixed Rate</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium mb-0.5">ETA</div>
                    <div className="font-bold text-slate-900">{eta} mins</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium mb-0.5">Payment</div>
                    <div className="font-bold text-slate-900 text-sm whitespace-nowrap">Pay securely</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => setStep(6)}
                className="w-full py-4 px-6 bg-brand text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/30 hover:shadow-brand/40 transition-all flex justify-center items-center gap-2"
              >
                Proceed to Payment <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  updateJob({ status: 'canceled_by_customer' });
                  setStep(1);
                }}
                className="w-full py-4 px-6 text-slate-500 rounded-2xl font-bold text-sm mt-2 hover:bg-slate-100 transition-all"
              >
                Cancel Request
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Payment Screen */}
        {step === 6 && (
          <div className="flex-1 flex flex-col animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Complete Payment</h2>
              <p className="text-slate-500">Confirm your request and we'll dispatch your helper.</p>
            </div>

            {/* Service Summary Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Service</div>
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    {selectedIssue === "flat_tire" ? <Wrench className="w-4 h-4 text-slate-500" /> :
                      selectedIssue === "jump_start" ? <Zap className="w-4 h-4 text-slate-500" /> :
                        selectedIssue === "fuel_delivery" ? <Fuel className="w-4 h-4 text-slate-500" /> :
                          <Truck className="w-4 h-4 text-slate-500" />}
                    {getIssueLabel(selectedIssue)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">${price}</div>
                  <div className="text-xs font-medium text-slate-500">flat fee</div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3 flex gap-4 text-sm mb-2">
                <div className="flex-1">
                  <div className="text-slate-400 text-xs mb-0.5">Helper</div>
                  <div className="font-medium text-slate-700">{job.helperName}</div>
                </div>
                <div className="flex-1 border-l border-slate-200 pl-4">
                  <div className="text-slate-400 text-xs mb-0.5">ETA</div>
                  <div className="font-bold text-brand">{eta} mins</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-green-500" /> No hidden fees or taxes
              </div>
            </div>

            {/* Payment Method */}
            <h3 className="text-lg font-bold text-slate-800 mb-3">Payment Method</h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-2xl font-medium hover:bg-slate-800 transition-colors">
                <Smartphone className="w-4 h-4" /> Apple Pay
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-800 rounded-2xl font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Smartphone className="w-4 h-4" /> Google Pay
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">or</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-6">
              <div className="relative mb-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Card Number</label>
                <div className="flex items-center bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-all">
                  <CreditCard className="w-5 h-5 text-slate-400 mr-2" />
                  <input type="text" placeholder="0000 0000 0000 0000" className="bg-transparent w-full text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400" value={cardNumber} onChange={handleCardNumberChange} />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Exp</label>
                  <input type="text" placeholder="MM/YY" className="bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200 w-full text-sm font-medium text-slate-800 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder:text-slate-400" value={expDate} onChange={handleExpDateChange} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">CVC</label>
                  <input type="text" placeholder="123" className="bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200 w-full text-sm font-medium text-slate-800 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all placeholder:text-slate-400" value={cvc} onChange={handleCvcChange} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input type="checkbox" id="save-card" className="rounded text-brand focus:ring-brand w-4 h-4 accent-brand cursor-pointer" defaultChecked />
                <label htmlFor="save-card" className="text-sm font-medium text-slate-600 cursor-pointer">Save payment method for next time</label>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-center flex-wrap gap-4 mb-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Secure checkout</span>
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Fast dispatch</span>
              </div>
              <button
                onClick={() => {
                  setIsProcessingPayment(true);
                  setTimeout(() => {
                    setIsProcessingPayment(false);
                    updateJob({ status: 'confirmed' });
                  }, 1500);
                }}
                disabled={!isPaymentValid || isProcessingPayment}
                className="w-full py-4 px-6 bg-brand text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand/30 hover:shadow-brand/40 transition-all flex justify-center items-center disabled:opacity-75 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-2" /> Processing...
                  </>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-2"><Lock className="w-5 h-5" /> Pay ${price}</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </>
                )}
              </button>
              <div className="text-center mt-3 text-xs text-slate-500">
                Your helper will be dispatched immediately.
              </div>
              {/* Added safe margin so error handling cancel doesn't overlap text */}
              <button
                onClick={() => {
                  updateJob({ status: 'canceled_by_customer' });
                  setStep(1);
                }}
                className="w-full py-3 px-6 text-slate-500 rounded-2xl font-bold text-sm mt-3 hover:bg-slate-100 transition-all"
              >
                Cancel Request
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Waiting / Tracking */}
        {step === 7 && (
          <div className="flex-1 flex flex-col animate-in fade-in duration-500 relative">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {job.status === 'arrived' || job.status === 'in-progress' ? 'Your helper has arrived' : 'Help is on the way'}
            </h2>
            <p className="text-slate-500 mb-6">
              {job.status === 'arrived' || job.status === 'in-progress' ? `${job.helperName} is at your location.` : `${job.helperName} is heading to your location.`}
            </p>

            {/* Map Placeholder Tracking */}
            <div className="relative w-full flex-1 min-h-[300px] bg-slate-200 rounded-3xl overflow-hidden border-4 border-white shadow-lg mb-6">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zM20 0h20v20H20V0z' fill='%2394a3b8' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
              }} />

              {/* Route line simulation */}
              <div className="absolute top-1/2 left-1/4 right-1/4 h-1.5 bg-brand/30 rounded-full -translate-y-1/2" />

              {/* User location pin */}
              <div className="absolute top-1/2 right-1/4 -mt-5 -mr-4 z-10 w-8 h-8 flex items-center justify-center">
                <div className="w-4 h-4 bg-slate-900 rounded-full border-2 border-white shadow-md z-10" />
              </div>

              {/* Helper Moving Pin */}
              <div className="absolute top-1/2 left-1/4 -mt-8 -ml-4 z-20 transition-all duration-1000 ease-linear animate-[pulse_2s_ease-in-out_infinite]" style={{
                transform: `translateX(${Math.min(100, (8 - (8 - 5)) * 12)}%)` // Simulate movement CSS trick
              }}>
                <div className="bg-brand text-white p-2 rounded-xl shadow-lg flex items-center justify-center relative">
                  <Truck className="w-6 h-6" />
                  <div className="absolute -bottom-2 left-1/2 -ml-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-brand" />
                </div>
              </div>
            </div>

            {/* Helper Location Popup */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center shrink-0">
                {job.helperLocation === "Fetching location..." ? (
                  <Loader2 className="w-5 h-5 text-brand animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5 text-brand" />
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Helper Location</p>
                <p className={`font-medium ${job.helperLocation === 'Location unavailable' || job.helperLocation === 'Geolocation not supported' ? 'text-red-500' : 'text-slate-800'}`}>
                  {job.helperLocation || 'Waiting for helper...'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=f8fafc" alt="Driver" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-lg">
                  {job.status === 'arrived' || job.status === 'in-progress' ? 'Arrived' : `${eta} min away`}
                </div>
                {job.helperVehicle && <div className="text-sm text-slate-500">{job.helperVehicle}</div>}
              </div>
              <button className="ml-auto w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </button>
            </div>

            <button
              onClick={() => {
                updateJob({ status: 'canceled_by_customer' });
                setStep(1);
              }}
              className="w-full py-4 px-6 text-slate-500 rounded-2xl font-bold text-sm mt-4 hover:bg-slate-100 transition-all border border-slate-200"
            >
              Cancel Request
            </button>
          </div>
        )}

        {/* Step 8: Completion */}
        {step === 8 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 py-12 text-center text-slate-900">
            <div className="w-24 h-24 bg-brand text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-brand/30">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Job Completed!</h2>
            <p className="text-slate-500 mb-8 max-w-[250px]">
              You're good to go. Safe travels and thanks for using BlitzWerk.
            </p>

            <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500">Total Paid</span>
                <span className="font-bold text-xl">${price}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Card ****4242</span>
                <span className="text-slate-400 text-sm">Success</span>
              </div>
            </div>

            <button
              onClick={goHome}
              className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Return Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// Helper Component
function IssueCard({ icon, title, value, selected, onClick }: {
  icon: React.ReactNode, title: string, value: string, selected: boolean, onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 ${selected
        ? 'border-brand bg-brand/5 shadow-md scale-[1.02]'
        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
        }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${selected ? 'bg-brand text-white' : 'bg-slate-100 text-slate-600'
        }`}>
        {icon}
      </div>
      <span className={`font-semibold ${selected ? 'text-brand' : 'text-slate-700'}`}>
        {title}
      </span>
    </button>
  );
}
