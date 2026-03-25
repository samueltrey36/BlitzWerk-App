import { motion } from "motion/react";
import { Check, X, Zap, Shield, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const comparison = [
  { feature: "Response Time", blitz: "8-15 Minutes", trad: "45-90 Minutes", icon: Clock },
  { feature: "Membership", blitz: "No Fees", trad: "$99+/Year", icon: Shield },
  { feature: "Tracking", blitz: "Real-time GPS", trad: "Phone Updates", icon: Zap },
  { feature: "Pricing", blitz: "Upfront & Clear", trad: "Hidden Fees", icon: DollarSign },
];

export default function Comparison() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-display font-extrabold text-slate-900 mb-6">
            BlitzWerk vs. <span className="text-brand">Traditional</span> Roadside
          </h2>
          <p className="text-lg text-slate-600">
            We've redesigned the experience from the ground up to be faster, cheaper, and more reliable.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="py-6 px-4 text-left text-slate-400 font-bold uppercase tracking-wider text-xs">Feature</th>
                <th className="py-6 px-4 text-center text-brand font-display font-extrabold text-xl">BlitzWerk</th>
                <th className="py-6 px-4 text-center text-slate-400 font-display font-bold text-xl">Traditional</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((item, index) => (
                <tr key={index} className="border-b border-slate-100 group hover:bg-slate-50 transition-colors">
                  <td className="py-8 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-900">{item.feature}</span>
                    </div>
                  </td>
                  <td className="py-8 px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full font-bold">
                      <Check className="w-4 h-4" />
                      {item.blitz}
                    </div>
                  </td>
                  <td className="py-8 px-4 text-center">
                    <div className="inline-flex items-center gap-2 text-slate-400 font-bold">
                      <X className="w-4 h-4" />
                      {item.trad}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 bg-brand rounded-[48px] p-12 md:p-20 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold leading-tight">
              Ready to get back <br /> on the road?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Don't wait hours for a tow truck. BlitzWerk connects you with nearby helpers in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/get-help" className="bg-white text-brand text-xl font-bold px-10 py-5 rounded-2xl shadow-2xl hover:scale-105 transition-transform active:scale-95 inline-block text-center">
                Get Help Now
              </Link>
              <Link to="/become-helper" className="bg-transparent text-white text-xl font-bold px-10 py-5 rounded-2xl border-2 border-white/20 hover:border-white hover:bg-white/10 transition-all active:scale-95 inline-block text-center">
                Become a Helper
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
