import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const submissionData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    try {
      const { error: insertError } = await supabase
        .from('contact_submissions')
        .insert([submissionData]);

      if (insertError) throw insertError;
      
      setSuccess(true);
      e.currentTarget.reset();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand/10 text-brand font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wider mb-6">
              Get In Touch
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6">
              Ready To Maximize Your Earnings?
            </h2>
            <p className="text-lg text-slate-400 mb-10">
              Contact us today to discuss how our dispatching services can help your trucking business grow. We're available 24/7.
            </p>

            <div className="space-y-8">
              <a href="tel:8326574825" className="flex items-start gap-4 group">
                <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                  <Phone className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-500 mb-1">Call Us 24/7</div>
                  <div className="text-xl font-display font-bold text-white group-hover:text-brand transition-colors">832-657-4825</div>
                </div>
              </a>
              
              <a href="mailto:dispatch@blitzwerk.com" className="flex items-start gap-4 group">
                <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand/20 transition-colors">
                  <Mail className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-500 mb-1">Email Us</div>
                  <div className="text-xl font-display font-bold text-white group-hover:text-brand transition-colors">dispatch@blitzwerk.com</div>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-slate-800 p-8 md:p-10 rounded-3xl border border-slate-700 shadow-2xl">
            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">Message Sent!</h3>
                <p className="text-slate-400 mb-8">We'll get back to you as soon as possible.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="bg-slate-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-display font-bold text-white mb-6">Send us a message</h3>
                
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Your Name</label>
                  <input required name="name" type="text" className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Email Address</label>
                  <input required name="email" type="email" className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Phone Number</label>
                  <input name="phone" type="tel" className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Message</label>
                  <textarea required name="message" rows={4} className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-brand text-slate-900 text-lg font-bold px-6 py-4 rounded-xl hover:bg-brand-dark transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
