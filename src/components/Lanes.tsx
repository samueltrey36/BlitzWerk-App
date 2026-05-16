import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const lanes = [
  { name: "HOUSTON TO DALLAS", description: "Heavy industrial and manufacturing freight." },
  { name: "HOUSTON TO ODESSA", description: "Oilfield equipment and pipe runs." },
  { name: "DALLAS TO OKLAHOMA", description: "Consistent northbound flatbed materials." },
  { name: "HOUSTON TO LOUISIANA", description: "I-10 East corridor port and refinery freight." },
  { name: "SAN ANTONIO REGIONAL", description: "South Texas industrial runs." },
];

export default function Lanes() {
  return (
    <section id="corridors" className="py-24 bg-[#0B0F14] border-y border-slate-700/80 relative">
      <div className="absolute inset-0 bg-texture-asphalt opacity-30 mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">

          {/* Left Side: Content */}
          <div className="lg:w-1/3 space-y-8">
            <div className="border-l-4 border-brand pl-6">
              <h2 className="text-4xl md:text-5xl font-industrial font-bold text-white uppercase leading-tight">
                TEXAS REGIONAL FREIGHT CORRIDORS
              </h2>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed">
              We focus on building density and strong broker relationships within these core Texas operating regions.
            </p>

            <div className="space-y-3 pt-4">
              {lanes.map((lane, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between p-5 bg-surface-light border border-slate-700"
                >
                  <div>
                    <h4 className="text-lg font-industrial font-bold text-white uppercase tracking-wide">{lane.name}</h4>
                    <p className="text-slate-400 text-sm">{lane.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-brand" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Realistic Map */}
          <div className="lg:w-2/3 w-full">
             <div className="bg-surface-light border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <img 
                  src="/texas_freight_map_realistic.png" 
                  alt="Texas Regional Freight Map" 
                  className="w-full h-auto object-cover opacity-90"
                />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
