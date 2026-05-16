import { motion } from "motion/react";
import { HardHat, Truck, MapPin, Building2 } from "lucide-react";

const targets = [
  {
    title: "FLATBED OWNER-OPERATORS",
    description: "Independent drivers who need strong broker relationships, consistent loaded miles, and a dispatcher who negotiates hard for every rate.",
    icon: Truck,
  },
  {
    title: "STEP DECK CARRIERS",
    description: "Specialized operators hauling heavy machinery and oversized freight who require precise coordination and higher-tier rate negotiations.",
    icon: HardHat,
  },
  {
    title: "SMALL REGIONAL FLEETS",
    description: "Growing operations (2-5 trucks) that need a dedicated back-office to manage dispatch, detention tracking, and rate confirmations.",
    icon: Building2,
  },
  {
    title: "TEXAS-BASED CARRIERS",
    description: "Truckers rooted in Texas who want to stay regional, run the I-10 corridor, and haul industrial freight out of Houston, Dallas, and Odessa.",
    icon: MapPin,
  },
];

export default function WhoWeWorkWith() {
  return (
    <section id="who-we-work-with" className="py-24 bg-[#0B0F14] border-y border-slate-700/80 relative">
      <div className="absolute inset-0 bg-texture-steel opacity-10 mix-blend-multiply"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-industrial font-bold text-white uppercase tracking-tight">BUILT FOR REGIONAL FLATBED OPERATIONS</h2>
          <div className="w-24 h-1 bg-brand mx-auto mt-6"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {targets.map((target, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface-light p-8 border border-slate-700 shadow-none flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="w-16 h-16 bg-surface border border-slate-600 flex items-center justify-center shrink-0">
                <target.icon className="w-8 h-8 text-brand" />
              </div>
              <div>
                <h4 className="text-xl font-industrial font-bold text-white mb-2 uppercase tracking-wide">{target.title}</h4>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {target.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
