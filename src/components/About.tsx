import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section id="about" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-800 rounded-3xl p-8 md:p-16 border border-slate-700 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-brand font-bold tracking-wider uppercase text-sm mb-4">About BlitzWerk</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Your Partner on the Road</h3>
            
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              We help owner-operators and small trucking companies focus on driving while we handle dispatching, broker communication, paperwork coordination, and load management.
            </p>
            
            <p className="text-lg text-slate-400 leading-relaxed mb-10">
              Our mission is to keep your trucks moving with the best paying freight available. We understand the challenges of the logistics industry and act as your dedicated back-office support, ensuring you never miss an opportunity to maximize your profits.
            </p>
            
            <div className="flex items-center gap-4">
              <Link to="/carrier-intake" className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-lg font-bold transition-all inline-flex items-center gap-2 shadow-lg shadow-brand/20">
                Work With Us Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
