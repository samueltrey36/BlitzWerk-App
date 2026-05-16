import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section id="about" className="py-24 bg-surface relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-surface-light p-8 md:p-16 border border-slate-700 shadow-2xl relative">

          <div className="relative z-10 max-w-3xl">
            <h2 className="text-brand font-industrial font-bold tracking-[0.2em] uppercase text-sm mb-4">About BlitzWerk</h2>
            <h3 className="text-3xl md:text-5xl font-industrial font-bold text-white mb-6 uppercase text-shadow-glow leading-tight">Your Operations Partner</h3>

            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              BlitzWerk specializes in regional flatbed dispatch services exclusively for owner-operators and small fleets running Texas and surrounding industrial freight corridors.
            </p>

            <p className="text-lg text-slate-400 leading-relaxed mb-10 border-l-4 border-brand/80 pl-6 py-2 bg-surface p-4">
              We focus on repeat freight, broker relationships, consistent loaded miles, and operational support that helps carriers build sustainable long-term businesses. We act as your dedicated back-office, ensuring you never miss an opportunity to maximize your profit while keeping your truck moving.
            </p>

            <div className="flex items-center gap-4">
              <Link to="/carrier-intake" className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-none font-industrial font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-xl border border-brand-dark">
                Work With Us Today
              </Link>
            </div>
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand"></div>
        </div>
      </div>
    </section>
  );
}
