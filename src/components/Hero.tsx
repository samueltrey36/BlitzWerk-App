import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative bg-[#0B0F14] min-h-screen flex items-center pt-20 border-b border-slate-700/80 overflow-hidden">
      
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Layer 1: Charcoal Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14] via-[#0B0F14]/90 to-transparent"></div>
        
        {/* Layer 2: Asphalt Texture */}
        <div className="absolute inset-0 bg-texture-asphalt opacity-30 mix-blend-multiply"></div>
        
        {/* Layer 3: Faint Map Lines */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-screen"
          style={{ backgroundImage: "url('/texas_freight_map_realistic.png')" }}
        ></div>
        
        {/* Layer 4: Truck Image on Right Side */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[60%]">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0B0F14] z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14]/80 via-transparent to-transparent z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center brightness-110"
            style={{ backgroundImage: "url('/hero_split_truck_bg.png')" }}
          ></div>
        </div>
      </div>

      <section className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="max-w-[650px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Eyebrow */}
            <div className="text-brand font-industrial font-bold text-sm uppercase tracking-[0.3em]">
              TEXAS REGIONAL FLATBED DISPATCH
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-[70px] font-industrial font-bold tracking-tight text-white leading-[1] uppercase">
              Flatbed Dispatch Built For <span className="text-brand">Texas</span> Owner-Operators
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-slate-400 font-medium max-w-[580px] leading-relaxed pt-2 pb-4">
              We help flatbed owner-operators and small fleets secure consistent regional freight across Texas and surrounding freight corridors through broker communication, route planning, and dispatch support.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Link 
                to="/carrier-intake" 
                className="bg-brand hover:bg-brand-dark text-white text-base md:text-lg font-industrial font-bold uppercase tracking-wider px-10 py-5 transition-colors border border-transparent shadow-[0_4px_15px_rgba(0,0,0,0.5)] text-center"
              >
                Submit Carrier Packet
              </Link>
              <a 
                href="#corridors" 
                className="bg-transparent hover:bg-surface-light text-white text-base md:text-lg font-industrial font-bold uppercase tracking-wider px-10 py-5 transition-colors border-2 border-slate-600 text-center"
              >
                View Freight Corridors
              </a>
            </div>

            {/* Operational Indicators */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-8">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-brand" />
                <span className="text-slate-300 font-industrial font-bold text-sm uppercase tracking-wide">Texas Regional Lanes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-brand" />
                <span className="text-slate-300 font-industrial font-bold text-sm uppercase tracking-wide">Flatbed & Step Deck</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-brand" />
                <span className="text-slate-300 font-industrial font-bold text-sm uppercase tracking-wide">Owner-Operators & Small Fleets</span>
              </div>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
}
