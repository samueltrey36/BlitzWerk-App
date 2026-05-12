import React from 'react';
import { motion } from 'motion/react';
import { Clock, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../lib/authStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function WaitingForApproval() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 text-center"
      >
        <div className="mx-auto w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-amber-50/50">
          <Clock className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Account Pending Approval
        </h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Your helper account has been successfully created and is currently under review by our administration team. You will be able to access the dispatch system once approved.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100 flex items-start text-left gap-3">
          <ShieldAlert className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            If you believe this is taking longer than usual, please contact support.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full h-14 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
