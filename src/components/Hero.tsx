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
            <div className="inline-flex items-center gap-2 bg-brand/10 text-brand font-black px-5 py-2 rounded-full text-sm sm:text-base uppercase tracking-wider border border-brand/20 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand"></span>
              </span>
              Roadside Assistance in Houston, TX
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Stranded? Get Help in <span className="text-brand">Minutes</span> — Not Hours.
            </h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4">
              {['Flat Tires', 'Jump Starts', 'Fuel Delivery', 'Towing'].map(service => (
                <div key={service} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm md:text-base font-bold shadow-sm">
                  {service}
                </div>
              ))}
            </div>
            <div className="bg-slate-50/80 backdrop-blur-sm border border-slate-100 p-5 md:p-6 rounded-3xl shadow-sm my-6 mt-8 max-w-xl">
              <ul className="space-y-4 text-lg md:text-xl text-slate-800 font-bold">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm border border-emerald-200">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  </div>
                  24/7 Service
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm border border-emerald-200">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  </div>
                  Fast Response Time
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm border border-emerald-200">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  </div>
                  No Membership Required
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full max-w-2xl">
              <a href="tel:8326574825" className="flex-1 bg-red-600 text-white text-xl md:text-2xl font-black px-6 py-5 md:py-6 rounded-2xl shadow-[0_8px_30px_-8px_rgba(220,38,38,0.7)] hover:bg-red-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95">
                📞 Call Now
              </a>
              <Link to="/get-help" className="flex-1 bg-slate-900 text-white text-xl md:text-2xl font-bold px-6 py-5 md:py-6 rounded-2xl shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group active:scale-95">
                Get Help Now
                <Navigation className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-auto w-full h-[400px] lg:h-[600px]"
          >
            <div className="absolute inset-0 bg-slate-200 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group">
              <img 
                src="https://images.unsplash.com/photo-1605389445171-ec641527ef94?q=80&w=1200&auto=format&fit=crop" 
                alt="Roadside emergency assistance" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center justify-between border border-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Average Arrival</div>
                      <div className="text-xl font-display font-black text-brand">Under 15 Mins</div>
                    </div>
                  </div>
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
