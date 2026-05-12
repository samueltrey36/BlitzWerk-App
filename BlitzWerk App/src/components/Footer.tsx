import { Truck, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-slate-900" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-white">
              Blitz<span className="text-brand">Werk</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed font-medium">
            Reliable Dispatch Services For Owner-Operators & Small Fleets. We keep your trucks moving and your business growing.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold text-white">Contact</h4>
          <ul className="space-y-4">
            <li>
              <a href="tel:8326574825" className="flex items-center gap-3 hover:text-brand transition-colors">
                <Phone className="w-5 h-5 text-brand" />
                832-657-4825
              </a>
            </li>
            <li>
              <a href="mailto:dispatch@blitzwerk.com" className="flex items-center gap-3 hover:text-brand transition-colors">
                <Mail className="w-5 h-5 text-brand" />
                dispatch@blitzwerk.com
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold text-white">Services</h4>
          <ul className="space-y-3">
            {["Load Booking", "Rate Negotiation", "Route Planning", "Broker Communication", "Paperwork Management"].map((item, i) => (
              <li key={i}><a href="#services" className="hover:text-brand transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold text-white">Company</h4>
          <ul className="space-y-3">
            {["About Us", "Carrier Intake", "Contact"].map((item, i) => (
              <li key={i}><a href="#" className="hover:text-brand transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm font-medium">
        © {new Date().getFullYear()} BlitzWerk Logistics. All rights reserved.
      </div>
    </footer>
  );
}
