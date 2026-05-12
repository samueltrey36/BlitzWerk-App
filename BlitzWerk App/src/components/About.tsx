import { motion } from "motion/react";

export default function About() {
  return (
    <section id="about" className="py-24 bg-surface border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wider mb-6">
            About BlitzWerk
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-8 leading-tight">
            Built For The Open Road
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-medium">
            We help owner-operators and small trucking companies focus on driving while we handle dispatching, broker communication, paperwork coordination, and load management.
          </p>
          <div className="mt-12 h-1 w-24 bg-brand mx-auto rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
}
