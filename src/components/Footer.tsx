import { Truck, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">BlitzWerk</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Dispatch Services For Carriers. We handle the paperwork, broker communication, and route planning so you can focus on driving.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold text-white">Services</h4>
          <ul className="space-y-4">
            <li><a href="/#services" className="hover:text-brand transition-colors">Load Booking</a></li>
            <li><a href="/#services" className="hover:text-brand transition-colors">Rate Negotiation</a></li>
            <li><a href="/#services" className="hover:text-brand transition-colors">Broker Communication</a></li>
            <li><a href="/#services" className="hover:text-brand transition-colors">Route Planning</a></li>
            <li><a href="/#services" className="hover:text-brand transition-colors">Paperwork Management</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold text-white">Company</h4>
          <ul className="space-y-4">
            <li><a href="/#about" className="hover:text-brand transition-colors">About Us</a></li>
            <li><Link to="/carrier-intake" className="hover:text-brand transition-colors">Carrier Intake</Link></li>
            <li><Link to="/contact" className="hover:text-brand transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold text-white">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand" />
              <a href="tel:8326574825" className="hover:text-white transition-colors">832-657-4825</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand" />
              <a href="mailto:info@blitzwerk.com" className="hover:text-white transition-colors">info@blitzwerk.com</a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-brand" />
              <span>Nationwide Dispatch Support</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} BlitzWerk. All rights reserved.
      </div>
    </footer>
  );
}
