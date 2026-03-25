import { motion } from "motion/react";
import { Zap, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/authStore";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <Link to="/" className="font-display font-bold text-xl tracking-tight text-brand">BlitzWerk</Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">Benefits</a>
          <Link to="/create-account" onClick={() => { sessionStorage.setItem('intendedRole', 'Helper'); sessionStorage.setItem('flowReturnTo', '/become-helper'); }} className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">Become a Helper</Link>
          <a href="#trust" className="text-sm font-medium text-slate-600 hover:text-brand transition-colors">Trust</a>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to={user.accountType === 'Customer' ? '/customer-dashboard' : '/helper-dashboard'}
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-brand transition-colors p-1 pr-3 rounded-full hover:bg-slate-50"
              >
                <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                Hi, {user.fullName.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" onClick={() => sessionStorage.removeItem('flowReturnTo')} className="text-sm font-semibold text-brand px-2 sm:px-4 py-2 rounded-full hover:bg-brand/5 transition-colors whitespace-nowrap">
                Log In
              </Link>
              <Link to="/create-account" onClick={() => sessionStorage.removeItem('flowReturnTo')} className="bg-brand text-white text-sm font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg shadow-brand/20 hover:scale-105 transition-transform active:scale-95 inline-block whitespace-nowrap">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
