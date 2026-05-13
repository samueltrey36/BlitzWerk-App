import { motion } from "motion/react";
import { DollarSign, Route, FileText, Headphones, CalendarCheck, ShieldCheck } from "lucide-react";

const services = [
  {
    title: "Load Booking",
    description: "We find and secure the best paying loads that match your equipment and preferences.",
    icon: CalendarCheck,
  },
  {
    title: "Rate Negotiation",
    description: "Our experts negotiate aggressively with brokers to get you the highest possible rates.",
    icon: DollarSign,
  },
  {
    title: "Broker Communication",
    description: "We handle all broker check-calls and updates, saving you time and stress.",
    icon: Headphones,
  },
  {
    title: "Route Planning",
    description: "Efficient route optimization to minimize deadhead miles and maximize profit.",
    icon: Route,
  },
  {
    title: "Paperwork Management",
    description: "We take care of setups, rate confirmations, and invoicing paperwork.",
    icon: FileText,
  },
  {
    title: "Dedicated Dispatch Support",
    description: "Get a dedicated dispatcher who understands your business and your goals.",
    icon: ShieldCheck,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-brand font-bold tracking-wider uppercase text-sm mb-3">Our Services</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-white">Everything You Need to Succeed</h3>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-brand/50 transition-colors group"
            >
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand/20 transition-colors">
                <service.icon className="w-7 h-7 text-brand" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{service.title}</h4>
              <p className="text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
