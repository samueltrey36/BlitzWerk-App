import { motion } from "motion/react";
import { Truck, ShieldCheck, Clock, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-surface pt-32 pb-20 px-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/95 to-surface"></div>
      
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand font-black px-5 py-2 rounded-full text-sm sm:text-base uppercase tracking-wider border border-brand/20 shadow-sm backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4" />
            Premium Dispatch Services
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight text-white leading-[1.1]">
            Reliable Truck Dispatch For <span className="text-brand">Owner-Operators</span> & Small Fleets
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-xl">
            We help carriers stay loaded with high-paying freight, broker communication, route planning, and dispatch support. Focus on driving, we'll handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full max-w-2xl">
            <a href="#contact" className="flex-1 bg-brand text-slate-900 text-lg md:text-xl font-bold px-6 py-4 rounded-2xl shadow-[0_8px_30px_-8px_rgba(245,158,11,0.5)] hover:bg-brand-dark hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95">
              Work With Us
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#intake" className="flex-1 bg-slate-800 text-white border border-slate-700 text-lg md:text-xl font-bold px-6 py-4 rounded-2xl hover:bg-slate-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group active:scale-95">
              Submit Carrier Info
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:ml-auto w-full h-[400px] lg:h-[600px] hidden lg:block"
        >
          <div className="absolute inset-0 bg-slate-800 rounded-[40px] overflow-hidden shadow-2xl border-4 border-slate-700 group">
            <img 
              src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop" 
              alt="Truck on highway" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-slate-900/90 backdrop-blur-md px-6 py-5 rounded-2xl shadow-xl flex items-center justify-between border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand/20 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-400">Loads Booked</div>
                    <div className="text-2xl font-display font-black text-white">10k+</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-700"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-400">Support</div>
                    <div className="text-2xl font-display font-black text-white">24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
