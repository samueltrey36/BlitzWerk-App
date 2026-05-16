import { Truck, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#08111F] text-slate-400 py-12 border-t border-slate-700/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-texture-steel opacity-10 mix-blend-multiply"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-brand" />
            <span className="font-industrial font-bold text-2xl tracking-[0.1em] text-white uppercase">BlitzWerk</span>
          </div>
          <p className="text-slate-400 font-industrial font-bold uppercase tracking-widest text-sm">
            Texas Regional Flatbed Dispatch Services
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 font-industrial font-bold uppercase tracking-wider text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand" />
            <span className="text-slate-300">Houston, TX</span>
          </div>
          <span className="text-slate-500 text-xs">Serving Texas & Surrounding Freight Corridors</span>
        </div>

      </div>
    </footer>
  );
}
