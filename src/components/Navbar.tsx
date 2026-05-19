import { Link } from "react-router-dom";
import { Truck, Phone } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#08111F] border-b border-slate-700/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 h-[80px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-transparent border-2 border-brand flex items-center justify-center">
            <Truck className="w-6 h-6 text-brand" />
          </div>
          <Link to="/" className="font-industrial font-bold text-2xl tracking-[0.1em] text-white uppercase">BlitzWerk</Link>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          <a href="/#equipment" className="text-sm font-industrial font-bold uppercase tracking-widest text-slate-300 hover:text-brand transition-colors">Equipment</a>
          <a href="/#services" className="text-sm font-industrial font-bold uppercase tracking-widest text-slate-300 hover:text-brand transition-colors">Operations</a>
          <a href="/#corridors" className="text-sm font-industrial font-bold uppercase tracking-widest text-slate-300 hover:text-brand transition-colors">Freight Corridors</a>
          <Link to="/carrier-intake" className="text-sm font-industrial font-bold uppercase tracking-widest text-slate-300 hover:text-brand transition-colors">Carrier Setup</Link>
          <Link to="/contact" className="text-sm font-industrial font-bold uppercase tracking-widest text-slate-300 hover:text-brand transition-colors">Contact</Link>
        </div>
        <div className="flex items-center gap-6">
          <a href="tel:8326574825" className="hidden sm:flex items-center gap-2 text-sm font-industrial font-bold text-white hover:text-brand transition-colors tracking-widest">
            <Phone className="w-4 h-4 text-brand" />
            832-657-4825
          </a>
          <Link to="/carrier-intake" className="bg-surface-light hover:bg-brand-dark text-white px-3 py-2 sm:px-6 sm:py-3 font-industrial font-bold uppercase tracking-wider transition-colors border-2 border-brand text-xs sm:text-sm shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center text-center">
            <span className="hidden sm:inline">Submit Carrier Packet</span>
            <span className="sm:hidden">Join Network</span>
          </Link>
          <Link to="/login" className="text-[10px] font-industrial font-bold uppercase tracking-widest text-slate-500 hover:text-brand transition-colors ml-2">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
