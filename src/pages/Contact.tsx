import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Contact Us</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Have questions about our dispatch services? Need help getting set up? Reach out to our team today.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 font-medium mb-1">Phone</div>
                    <a href="tel:8326574825" className="text-lg font-bold text-white hover:text-brand transition-colors">832-657-4825</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 font-medium mb-1">Email</div>
                    <a href="mailto:info@blitzwerk.com" className="text-lg font-bold text-white hover:text-brand transition-colors">info@blitzwerk.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 font-medium mb-1">Coverage</div>
                    <div className="text-lg font-bold text-white">Nationwide Dispatch Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10" onSubmit={(e) => { e.preventDefault(); alert('Form submitted! (Demo)'); }}>
              <h3 className="text-2xl font-bold text-white mb-8">Send Us A Message</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input required type="email" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea required rows={5} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none"></textarea>
              </div>

              <button type="submit" className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all inline-flex">
                Send Message
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
