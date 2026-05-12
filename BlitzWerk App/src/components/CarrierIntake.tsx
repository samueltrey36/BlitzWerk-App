import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function CarrierIntake() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [files, setFiles] = useState<{
    w9: File | null;
    insurance: File | null;
    authority: File | null;
  }>({ w9: null, insurance: null, authority: null });

  const fileInputRefs = {
    w9: useRef<HTMLInputElement>(null),
    insurance: useRef<HTMLInputElement>(null),
    authority: useRef<HTMLInputElement>(null)
  };

  const handleFileChange = (type: 'w9' | 'insurance' | 'authority', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const uploadFile = async (file: File, type: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${type}.${fileExt}`;
    const filePath = `intake/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('carrier-documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('carrier-documents')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const carrierData = {
      company_name: formData.get('company_name') as string,
      owner_name: formData.get('owner_name') as string,
      phone_number: formData.get('phone_number') as string,
      email: formData.get('email') as string,
      mc_number: formData.get('mc_number') as string,
      dot_number: formData.get('dot_number') as string,
      equipment_type: formData.get('equipment_type') as string,
      preferred_lanes: formData.get('preferred_lanes') as string,
      home_base: formData.get('home_base') as string,
      w9_url: null as string | null,
      insurance_url: null as string | null,
      authority_url: null as string | null,
    };

    try {
      // Upload files first
      if (files.w9) carrierData.w9_url = await uploadFile(files.w9, 'w9');
      if (files.insurance) carrierData.insurance_url = await uploadFile(files.insurance, 'insurance');
      if (files.authority) carrierData.authority_url = await uploadFile(files.authority, 'authority');

      // Insert carrier record
      const { error: insertError } = await supabase
        .from('carriers')
        .insert([carrierData]);

      if (insertError) throw insertError;
      
      setSuccess(true);
      setFiles({ w9: null, insurance: null, authority: null });
      e.currentTarget.reset();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit carrier information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="intake" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-display font-black text-slate-900 mb-4">Application Submitted!</h2>
            <p className="text-lg text-slate-600 mb-8">
              Thank you for applying to work with BlitzWerk. Our dispatch team will review your information and get back to you shortly.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="bg-brand text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-brand-dark transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="intake" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-4">Carrier Intake</h2>
          <p className="text-lg text-slate-600">Join our network of elite owner-operators. Fill out the form below to get started.</p>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-slate-200 text-slate-900">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Company Name *</label>
                <input required name="company_name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Owner Name *</label>
                <input required name="owner_name" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                <input required name="phone_number" type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                <input required name="email" type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">MC Number *</label>
                <input required name="mc_number" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">DOT Number *</label>
                <input required name="dot_number" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Equipment Type *</label>
                <select required name="equipment_type" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all">
                  <option value="">Select Equipment</option>
                  <option value="Dry Van">Dry Van</option>
                  <option value="Reefer">Reefer</option>
                  <option value="Flatbed">Flatbed</option>
                  <option value="Step Deck">Step Deck</option>
                  <option value="Power Only">Power Only</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Home Base (City, State) *</label>
                <input required name="home_base" type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Lanes/Routes</label>
              <textarea name="preferred_lanes" rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" placeholder="e.g. Midwest to Southeast"></textarea>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Required Documents</h3>
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* File Upload Helper Component */}
                {(['w9', 'insurance', 'authority'] as const).map((type) => (
                  <div key={type} className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                    <input 
                      type="file" 
                      ref={fileInputRefs[type]}
                      onChange={(e) => handleFileChange(type, e)}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <div className="mb-3">
                      {files[type] ? (
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      ) : (
                        <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      )}
                    </div>
                    <div className="font-bold text-slate-700 mb-1 capitalize">
                      {type === 'authority' ? 'MC Authority' : type}
                    </div>
                    <div className="text-sm text-slate-500 mb-4">
                      {files[type] ? files[type]?.name : 'PDF, JPG, PNG'}
                    </div>
                    <button 
                      type="button"
                      onClick={() => fileInputRefs[type].current?.click()}
                      className="text-sm font-bold text-brand hover:text-brand-dark"
                    >
                      {files[type] ? 'Change File' : 'Browse File'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand text-slate-900 text-lg font-bold px-6 py-4 rounded-xl shadow-lg hover:bg-brand-dark transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
