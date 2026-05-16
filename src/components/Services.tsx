import { motion } from "motion/react";
import { Truck, Map, Phone, FileText, ClipboardCheck, Headset, Clock, Repeat } from "lucide-react";

const services = [
  {
    title: "FLATBED LOAD BOOKING",
    description: "Dedicated load booking tailored to your flatbed or step deck equipment, focusing on loaded mile consistency.",
    icon: Truck,
  },
  {
    title: "REGIONAL ROUTE PLANNING",
    description: "Strategic route planning across Texas to maximize loaded miles and significantly reduce deadhead.",
    icon: Map,
  },
  {
    title: "BROKER COMMUNICATION",
    description: "We negotiate hard on every load, leveraging our relationships to secure the highest possible linehaul rates.",
    icon: Phone,
  },
  {
    title: "RATE CONFIRMATION MANAGEMENT",
    description: "We handle all the paperwork, signing rate confirmations and ensuring all broker requirements are met before you roll.",
    icon: FileText,
  },
  {
    title: "CARRIER SETUP ASSISTANCE",
    description: "Full carrier packet assistance. We complete new broker setups so you don't have to stop driving to fill out forms.",
    icon: ClipboardCheck,
  },
  {
    title: "DISPATCH COMMUNICATION",
    description: "We handle all check-calls, transit updates, and direct communication with the broker from pickup to delivery.",
    icon: Headset,
  },
  {
    title: "DETENTION & LAYOVER SUPPORT",
    description: "We aggressively track your time at the shipper/receiver and fight for every dollar of detention and layover pay.",
    icon: Clock,
  },
  {
    title: "REPEAT FREIGHT COORDINATION",
    description: "We prioritize building long-term broker relationships to secure dedicated, repeat freight for your truck.",
    icon: Repeat,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-surface relative">
      <div className="absolute inset-0 bg-texture-steel opacity-10 mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-left border-l-4 border-brand pl-6 mb-16">
          <h2 className="text-3xl md:text-5xl font-industrial font-bold text-white uppercase tracking-tight">
            REGIONAL FLATBED OPERATIONS SUPPORT
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-surface-light p-8 rounded-none border border-slate-700 shadow-none relative"
            >
              <div className="w-14 h-14 bg-surface border border-slate-600 flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-brand" />
              </div>
              <h4 className="text-xl font-industrial font-bold text-white mb-3 uppercase tracking-wide">{service.title}</h4>
              <p className="text-slate-400 leading-relaxed text-sm">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
