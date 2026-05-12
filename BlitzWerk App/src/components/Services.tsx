import { motion } from "motion/react";
import { FileText, Map, PhoneCall, TrendingUp, Truck, HeadphonesIcon } from "lucide-react";

const services = [
  {
    icon: <TrendingUp className="w-8 h-8 text-brand" />,
    title: "Load Booking & Rate Negotiation",
    description: "We negotiate the highest rates possible and keep your trucks moving with profitable freight."
  },
  {
    icon: <PhoneCall className="w-8 h-8 text-brand" />,
    title: "Broker Communication",
    description: "We handle all calls, check-ins, and updates with brokers so you can focus on the road."
  },
  {
    icon: <Map className="w-8 h-8 text-brand" />,
    title: "Route Planning",
    description: "Strategic trip planning to maximize your loaded miles and minimize deadhead."
  },
  {
    icon: <FileText className="w-8 h-8 text-brand" />,
    title: "Paperwork Management",
    description: "We handle rate cons, invoicing, NOAs, and all necessary paperwork for your loads."
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8 text-brand" />,
    title: "Dedicated Dispatch Support",
    description: "Get an assigned dispatcher who knows your preferences and works exclusively for your success."
  },
  {
    icon: <Truck className="w-8 h-8 text-brand" />,
    title: "Equipment Types",
    description: "Dry Van, Reefer, Flatbed, Step Deck, and Power Only. We dispatch for all major equipment."
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6">Our Dispatch Services</h2>
          <p className="text-lg text-slate-400">We offer comprehensive dispatching solutions designed to maximize your revenue and keep your operations running smoothly.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-colors"
            >
              <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3">{service.title}</h3>
              <p className="text-slate-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
