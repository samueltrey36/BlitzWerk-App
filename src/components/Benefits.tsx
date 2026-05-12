import { motion } from "motion/react";
import { Zap, DollarSign, MapPin, Navigation, ShieldCheck, Users } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Fast Response Times",
    description: "Our algorithm matches you with the closest helper instantly. No more waiting hours for a tow truck.",
    color: "bg-amber-500",
  },
  {
    icon: DollarSign,
    title: "No Membership Fees",
    description: "Only pay for the services you need, when you need them. No monthly subscriptions or hidden costs.",
    color: "bg-emerald-500",
  },
  {
    icon: MapPin,
    title: "Real-time GPS Tracking",
    description: "Watch your helper arrive in real-time on our live map. Know exactly when help will arrive.",
    color: "bg-brand",
  },
];

const whyChooseUs = [
  {
    icon: Navigation,
    title: "Faster than Tradition",
    description: "We bypass traditional dispatch systems to connect you directly with local helpers.",
  },
  {
    icon: ShieldCheck,
    title: "No Hidden Fees",
    description: "Transparent pricing upfront. You'll know exactly what you're paying before help arrives.",
  },
  {
    icon: MapPin,
    title: "Live Tracking",
    description: "Stay informed every step of the way with our precision GPS tracking system.",
  },
  {
    icon: Users,
    title: "Community Powered",
    description: "Anyone with the right skills can earn as a helper, creating a dense network of support.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-display font-extrabold text-slate-900 mb-6">
            Roadside Assistance, <span className="text-brand">Reimagined</span>.
          </h2>
          <p className="text-lg text-slate-600">
            We've stripped away the complexity of traditional roadside services to provide a faster, more transparent experience.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
            >
              <div className={`w-14 h-14 ${benefit.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-4">{benefit.title}</h3>
              <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-brand rounded-[48px] p-12 md:p-20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-light/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-8 leading-tight">
                Why drivers are switching to BlitzWerk
              </h2>
              <p className="text-xl text-brand-light/80 mb-12">
                Traditional roadside assistance is slow and expensive. We're building a network that works for everyone.
              </p>
              <button className="bg-white text-brand text-lg font-bold px-8 py-4 rounded-2xl hover:scale-105 transition-transform active:scale-95">
                Learn More
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {whyChooseUs.map((item, index) => (
                <div key={index} className="space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold">{item.title}</h4>
                  <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
