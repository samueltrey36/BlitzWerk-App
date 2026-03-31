import { supabase } from '../lib/supabase.ts';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, Phone, ArrowRight, CheckCircle2, Wrench, Fuel, MapPin } from 'lucide-react';
import { useAuth } from '../lib/authStore';

type AccountType = 'Customer' | 'Helper';

const SERVICES = [
  { id: 'jump-start', label: 'Jump Start', icon: Zap },
  { id: 'towing', label: 'Towing', icon: MapPin },
  { id: 'tire', label: 'Tire Replacement/Flat', icon: Wrench },
  { id: 'fuel', label: 'Fuel Delivery', icon: Fuel },
];

export default function CreateAccount() {
  const [accountType, setAccountType] = useState<AccountType>(
    (sessionStorage.getItem('intendedRole') as AccountType) || 'Customer'
  );
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);

    // Basic Validationconst handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (accountType === 'Helper' && selectedServices.length === 0) {
      setError('Please select at least one service you can provide.');
      return;
    }

    setIsSubmitting(true);

    // SIGN UP
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsSubmitting(false);
      return;
    }

    // SIGN IN (REQUIRED FOR RLS)
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

    if (signInError) {
      setError(signInError.message);
      setIsSubmitting(false);
      return;
    }

    console.log('SIGN IN USER:', signInData.user);

    if (signInData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: signInData.user.id,
        email: formData.email,
        phone: formData.phone,
        full_name: formData.fullName,
        role: accountType === 'Customer' ? 'CUSTOMER' : 'HELPER',
        selected_services:
          accountType === 'Helper' ? selectedServices : null,
        is_approved: false, // New helpers default to unapproved
      });

      if (profileError) {
        setError(profileError.message);
        setIsSubmitting(false);
        return;
      }

      login({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        accountType,
        selectedServices: accountType === 'Helper' ? selectedServices : [],
        isApproved: false,
      });

      setIsSuccess(true);
      setIsSubmitting(false);

      let targetRoute =
        accountType === 'Customer' ? '/customer-dashboard' : '/helper-dashboard';

      if (accountType === 'Helper') {
        targetRoute = '/waiting-for-approval';
      } else {
        const flowReturnTo = sessionStorage.getItem('flowReturnTo');
        if (flowReturnTo && flowReturnTo === '/get-help') {
          targetRoute = flowReturnTo;
        }
        sessionStorage.removeItem('flowReturnTo');
      }

      navigate(targetRoute, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-center text-3xl font-display font-bold text-slate-900 tracking-tight"
        >
          Create your account
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-center text-sm text-slate-600"
        >
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand hover:text-brand-light transition-colors">
            Log in
          </Link>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0 mb-12"
      >
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                {error}
              </div>
            )}

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-200 flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">Account created successfully!</p>
                  <p className="text-green-600 mt-1">Your data has been saved locally.</p>
                </div>
              </motion.div>
            )}

            {/* Account Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                I want to use BlitzWerk as a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(['Customer', 'Helper'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    className={`relative flex items-center justify-center p-4 border rounded-xl text-sm font-semibold transition-all ${accountType === type
                      ? 'border-brand bg-brand/5 text-brand shadow-sm ring-1 ring-brand'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    {type}
                    {accountType === type && (
                      <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-brand" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full pl-10 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors sm:text-sm"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full pl-10 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Helper Services Section */}
            <AnimatePresence>
              {accountType === 'Helper' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-slate-100">
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      Select Services You Provide
                    </label>
                    <p className="text-sm text-slate-500 mb-4">
                      Choose at least one service you can assist customers with.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SERVICES.map((service) => {
                        const isSelected = selectedServices.includes(service.id);
                        const Icon = service.icon;
                        return (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => toggleService(service.id)}
                            className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${isSelected
                              ? 'border-brand bg-brand/5 ring-1 ring-brand'
                              : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                              }`}
                          >
                            <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-brand text-white' : 'bg-white text-slate-400 shadow-sm border border-slate-100'
                              }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-semibold ${isSelected ? 'text-brand' : 'text-slate-700'}`}>
                                {service.label}
                              </p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${isSelected ? 'border-brand bg-brand' : 'border-slate-300 bg-white'
                              }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-brand hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
