import { motion } from "motion/react";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative bg-slate-950 overflow-hidden pt-20">
      {/* Background styling elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <section className="relative pt-32 pb-32 px-4 z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 bg-brand/20 text-brand-dark font-black px-5 py-2 rounded-full text-sm uppercase tracking-wider border border-brand/30 shadow-sm backdrop-blur-sm mx-auto text-brand-100">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand"></span>
              </span>
              Top-Rated Nationwide Dispatch
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.1]">
              Reliable Truck Dispatch Services For <span className="text-brand">Owner-Operators</span> & Small Fleets
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
              We help carriers stay loaded with high-paying freight, broker communication, route planning, and dispatch support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-8 w-full max-w-xl mx-auto justify-center">
              <Link to="/carrier-intake" className="bg-brand text-white text-lg font-bold px-8 py-4 rounded-xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:bg-brand-dark hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group active:scale-95 border border-blue-400/20">
                Work With Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/carrier-intake" className="bg-slate-800 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-slate-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 border border-slate-700">
                <FileText className="w-5 h-5" />
                Submit Carrier Information
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Decorative divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
    </div>
  );
}
