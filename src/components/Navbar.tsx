import { Link } from "react-router-dom";
import { Truck, Phone } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <Link to="/" className="font-display font-bold text-2xl tracking-tight text-white">BlitzWerk</Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="/#services" className="text-sm font-medium text-slate-300 hover:text-brand transition-colors">Services</a>
          <a href="/#about" className="text-sm font-medium text-slate-300 hover:text-brand transition-colors">About</a>
          <Link to="/carrier-intake" className="text-sm font-medium text-slate-300 hover:text-brand transition-colors">Carrier Intake</Link>
          <Link to="/contact" className="text-sm font-medium text-slate-300 hover:text-brand transition-colors">Contact</Link>
        </div>
        <div className="flex items-center gap-4">
          <a href="tel:8326574825" className="hidden sm:flex items-center gap-2 text-sm font-bold text-white hover:text-brand transition-colors">
            <Phone className="w-4 h-4" />
            832-657-4825
          </a>
          <Link to="/carrier-intake" className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-lg font-semibold transition-all">
            Work With Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
