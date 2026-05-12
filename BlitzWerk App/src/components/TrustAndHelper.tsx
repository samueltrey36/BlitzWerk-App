import { motion } from "motion/react";
import { ShieldCheck, Star, CreditCard, MapPin, CheckCircle2, DollarSign, Clock, Briefcase, Zap, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const trustFeatures = [
  { icon: ShieldCheck, title: "Verified Drivers", description: "Every helper undergoes a rigorous background check." },
  { icon: Star, title: "Ratings & Reviews", description: "See real feedback from drivers before you accept help." },
  { icon: CreditCard, title: "Secure Payments", description: "All transactions are encrypted and handled through our app." },
  { icon: MapPin, title: "GPS Tracking", description: "Watch your helper arrive in real-time on our live map." },
];

const helperBenefits = [
  { icon: DollarSign, title: "Get paid per job", description: "Earnings are deposited directly into your account after each completed job." },
  { icon: Clock, title: "Work when you want", description: "You're the boss. Choose your own hours and turn on the app only when you're available." },
  { icon: Briefcase, title: "No long-term commitment", description: "Earn on your own terms without any strict schedules or company obligations." },
];

export default function TrustAndHelper() {
  return (
    <div className="space-y-24 py-24">
      {/* Trust Section */}
      <section id="trust" className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 leading-tight">
              Safety and trust are our <span className="text-brand">top priorities</span>.
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              We've built a platform that ensures every interaction is safe, secure, and reliable.
            </p>
            <div className="grid sm:grid-cols-2 gap-8">
              {trustFeatures.map((feature, index) => (
                <div key={index} className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{feature.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-8 md:p-12 rounded-[48px] border border-slate-100 relative"
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand rounded-full flex items-center justify-center text-white shadow-xl rotate-12">
              <Star className="w-10 h-10 fill-white" />
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                  <img src="https://picsum.photos/seed/driver/200/200" alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">Jessica Miller</div>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                  </div>
                </div>
              </div>
              <blockquote className="text-2xl font-display font-bold text-slate-900 italic leading-snug">
                “Got help in 10 minutes. Way faster than traditional roadside services. The live tracking gave me peace of mind while I was stranded on the highway.”
              </blockquote>
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                Verified Customer
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Helper Section */}
      <section id="helpers" className="bg-slate-900 py-24 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[48px] border border-white/10 shadow-2xl">
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-8 leading-tight">
                  Earn Money Helping Drivers in Houston Tx
                </h2>
                <div className="grid sm:grid-cols-2 gap-8 mb-12">
                  {helperBenefits.map((benefit, index) => (
                    <div key={index} className="space-y-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-brand">
                        <benefit.icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-white">{benefit.title}</h4>
                      <p className="text-sm text-white/60 leading-relaxed">{benefit.description}</p>
                    </div>
                  ))}
                </div>
                <Link to="/become-helper" className="w-full bg-brand text-white text-xl font-bold px-8 py-5 rounded-2xl shadow-xl shadow-brand/30 hover:scale-105 transition-transform active:scale-95 inline-block text-center">
                  Become a Helper
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-semibold">
                Join 5,000+ Helpers
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white leading-tight">
                Turn your vehicle into a <span className="text-emerald-400">revenue stream</span>.
              </h2>
              <p className="text-xl text-white/60 leading-relaxed">
                Whether you're a professional mechanic or just someone who knows how to change a tire, BlitzWerk gives you the platform to earn on your own terms.
              </p>
              <ul className="space-y-4">
                {["No company required", "Accept nearby jobs", "Get paid instantly"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-medium">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
