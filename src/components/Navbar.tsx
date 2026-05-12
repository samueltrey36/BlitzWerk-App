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
            <div className="flex items-center gap-2 sm:gap-6">
              <a href="tel:8326574825" className="flex items-center gap-2 md:gap-3 text-xl sm:text-2xl md:text-3xl font-black font-display text-red-600 hover:text-red-700 transition-colors drop-shadow-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-red-100 flex items-center justify-center shadow-lg animate-pulse border-2 border-red-200">
                  <span className="text-xl sm:text-2xl">📞</span>
                </div>
                832-657-4825
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
