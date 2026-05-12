import { Truck, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg">
            <Truck className="w-6 h-6 text-slate-900" />
          </div>
          <Link to="/" className="font-display font-black text-2xl tracking-tight text-white">
            Blitz<span className="text-brand">Werk</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-bold text-slate-300 hover:text-brand transition-colors">Services</a>
          <a href="#about" className="text-sm font-bold text-slate-300 hover:text-brand transition-colors">About</a>
          <a href="#intake" className="text-sm font-bold text-slate-300 hover:text-brand transition-colors">Carrier Intake</a>
          <a href="#contact" className="text-sm font-bold text-slate-300 hover:text-brand transition-colors">Contact</a>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:8326574825" className="flex items-center gap-2 text-lg font-black font-display text-brand hover:text-brand-dark transition-colors">
            832-657-4825
          </a>
        </div>

        <button 
          className="md:hidden text-slate-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-4">
          <a onClick={() => setIsOpen(false)} href="#services" className="block text-slate-300 font-bold">Services</a>
          <a onClick={() => setIsOpen(false)} href="#about" className="block text-slate-300 font-bold">About</a>
          <a onClick={() => setIsOpen(false)} href="#intake" className="block text-slate-300 font-bold">Carrier Intake</a>
          <a onClick={() => setIsOpen(false)} href="#contact" className="block text-slate-300 font-bold">Contact</a>
          <a onClick={() => setIsOpen(false)} href="tel:8326574825" className="block text-brand font-bold text-xl">832-657-4825</a>
        </div>
      )}
    </nav>
  );
}
