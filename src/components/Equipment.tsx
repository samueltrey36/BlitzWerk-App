import { motion } from "motion/react";

const equipmentList = [
  {
    name: "Flatbed",
    description: "Standard 48' and 53' open decks hauling steel, lumber, pipe, and general industrial freight.",
    image: "/equipment_flatbed.png",
  },
  {
    name: "Step Deck",
    description: "Specialized trailers designed for taller freight, heavy machinery, and construction equipment.",
    image: "/equipment_stepdeck.png",
  },
  {
    name: "RGN (Lowboy)",
    description: "Removable Gooseneck trailers for heavy haul, oversized loads, and massive industrial components.",
    image: "/equipment_rgn.png",
  },
  {
    name: "Conestoga",
    description: "Rolling tarp systems providing weather protection for high-value industrial materials.",
    image: "/equipment_conestoga.png",
  },
  {
    name: "Hotshot Flatbed",
    description: "Heavy-duty dually trucks and 40' gooseneck trailers for expedited, regional LTL and dedicated freight.",
    image: "/equipment_hotshot.png",
  },
];

export default function Equipment() {
  return (
    <section id="equipment" className="py-24 bg-surface relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-16 border-l-4 border-brand pl-6">
          <h2 className="text-brand font-industrial font-bold tracking-[0.2em] uppercase text-sm mb-3">Equipment Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-industrial font-bold text-white uppercase text-shadow-glow">Freight We Dispatch</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {equipmentList.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface-light border border-slate-700/80 shadow-2xl group overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden border-b border-slate-700">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
              </div>
              <div className="p-6">
                <h4 className="text-2xl font-industrial font-bold text-white mb-2 uppercase tracking-wide">{item.name}</h4>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
