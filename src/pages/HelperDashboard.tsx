import { motion } from 'motion/react';
import { useAuth } from '../lib/authStore';
import { Navigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, User, Mail, Phone, Wrench } from 'lucide-react';

export default function HelperDashboard() {
  const { user } = useAuth();

  // Protect route
  if (!user || user.accountType !== 'Helper') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 mb-8 border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">
                Welcome back, {user.fullName.split(' ')[0]}!
              </h1>
              <p className="text-slate-500 mt-1">Helper Dashboard</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>

              {user.selectedServices && user.selectedServices.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-blue-500" />
                    Registered Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.selectedServices.map(svc => (
                      <span key={svc} className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-sm font-medium rounded-lg shadow-sm">
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col justify-center items-center text-center p-6 bg-brand/5 border border-brand/10 rounded-2xl">
              <h3 className="text-lg font-semibold text-brand mb-2">Ready to assist?</h3>
              <p className="text-slate-600 mb-6 text-sm">Head over to the dispatch center to find customers actively waiting.</p>
              <Link 
                to="/become-helper"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 transition-all"
              >
                Go Online / Find Jobs
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
