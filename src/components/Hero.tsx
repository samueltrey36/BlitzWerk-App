import { motion } from "motion/react";
import { MapPin, Search, Navigation, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative">
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              Available in your area
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Stranded? Get Help in <span className="text-brand">Minutes</span> — Not Hours.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed">
              BlitzWerk connects you with nearby helpers for flat tires, jump starts, fuel delivery, and towing. Fast, reliable, and no membership required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/get-help" className="bg-brand text-white text-lg font-bold px-8 py-5 rounded-2xl shadow-xl shadow-brand/30 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 group">
                Get Help Now
                <Navigation className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/become-helper" className="bg-white text-slate-900 text-lg font-bold px-8 py-5 rounded-2xl border-2 border-slate-200 hover:border-brand hover:text-brand transition-all active:scale-95 flex items-center justify-center gap-3">
                Become a Helper
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-square max-w-[500px] mx-auto lg:ml-auto"
          >
            <div className="absolute inset-0 bg-slate-200 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
              {/* Mock Map Background */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"></div>
              
              {/* Animated Helpers */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/3 bg-white p-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <Navigation className="w-4 h-4 rotate-45" />
                </div>
                <div className="text-[10px] font-bold">Helper: Mike (4 min)</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/3 right-1/4 bg-white p-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <Navigation className="w-4 h-4 rotate-45" />
                </div>
                <div className="text-[10px] font-bold">Helper: Sarah (6 min)</div>
              </motion.div>

              {/* User Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping bg-brand/20 rounded-full"></div>
                  <div className="relative w-12 h-12 bg-brand rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                    <MapPin className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
                <div className="mt-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
                  <Search className="w-4 h-4 text-brand animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">Finding nearby helpers...</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Stats Banner - Moved right below hero */}
      <div className="max-w-7xl mx-auto px-4 pb-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white p-6 md:p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
              <Navigation className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Average ETA</div>
              <div className="text-3xl font-display font-black text-slate-900">8.4 Minutes</div>
            </div>
          </div>
          
          <div className="h-px w-full md:h-12 md:w-px bg-slate-100"></div>

          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Helpers Online</div>
              <div className="text-3xl font-display font-black text-slate-900">1,284</div>
            </div>
          </div>

          <div className="h-px w-full md:h-12 md:w-px bg-slate-100"></div>

          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
              <Star className="w-8 h-8 fill-amber-500" />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">Avg. Rating</div>
              <div className="text-3xl font-display font-black text-slate-900">4.9/5</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
