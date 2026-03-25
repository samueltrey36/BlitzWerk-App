import { Zap, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">BlitzWerk</span>
          </div>
          <p className="text-white/60 leading-relaxed">
            Modern roadside assistance for the modern driver. Fast, reliable, and community-powered.
          </p>
          <div className="flex items-center gap-4">
            {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/60 hover:text-brand hover:bg-white/10 transition-all">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold">Services</h4>
          <ul className="space-y-4 text-white/60">
            {["Flat Tires", "Jump Starts", "Fuel Delivery", "Towing", "Lockout Service"].map((item, i) => (
              <li key={i}><a href="#" className="hover:text-brand transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold">Company</h4>
          <ul className="space-y-4 text-white/60">
            {["About Us", "Careers", "Press", "Blog", "Contact"].map((item, i) => (
              <li key={i}><a href="#" className="hover:text-brand transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold">Legal</h4>
          <ul className="space-y-4 text-white/60">
            {["Terms of Service", "Privacy Policy", "Cookie Policy", "Helper Agreement"].map((item, i) => (
              <li key={i}><a href="#" className="hover:text-brand transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} BlitzWerk Technologies Inc. All rights reserved.
      </div>
    </footer>
  );
}
