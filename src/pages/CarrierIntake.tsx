import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, UploadCloud, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function CarrierIntake() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    phone: '',
    email: '',
    mcNumber: '',
    dotNumber: '',
    equipmentType: '',
    preferredLanes: '',
    homeBase: '',
  });

  const [files, setFiles] = useState<{
    w9: File | null;
    insurance: File | null;
    mcAuthority: File | null;
  }>({
    w9: null,
    insurance: null,
    mcAuthority: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be under 10MB");
        return;
      }
      setFiles({ ...files, [fileType]: file });
    }
  };

  const uploadFile = async (file: File, submissionId: string, docType: string) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${submissionId}/${docType}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('carrier-documents')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('carrier-documents')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    if (!files.w9 || !files.insurance || !files.mcAuthority) {
      setErrorMessage("Please upload all required documents.");
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionId = crypto.randomUUID();

      // Upload documents
      const w9Url = await uploadFile(files.w9, submissionId, 'w9');
      const insuranceUrl = await uploadFile(files.insurance, submissionId, 'insurance');
      const mcAuthorityUrl = await uploadFile(files.mcAuthority, submissionId, 'mc_authority');

      // Insert into DB
      const { error: insertError } = await supabase
        .from('carrier_intake_submissions')
        .insert({
          id: submissionId,
          company_name: formData.companyName,
          owner_name: formData.ownerName,
          phone: formData.phone,
          email: formData.email,
          mc_number: formData.mcNumber,
          dot_number: formData.dotNumber,
          equipment_type: formData.equipmentType,
          preferred_lanes: formData.preferredLanes,
          home_base: formData.homeBase,
          w9_url: w9Url,
          insurance_url: insuranceUrl,
          mc_authority_url: mcAuthorityUrl,
        });

      if (insertError) throw insertError;

      setSubmitStatus('success');
      setFormData({
        companyName: '', ownerName: '', phone: '', email: '',
        mcNumber: '', dotNumber: '', equipmentType: '', preferredLanes: '', homeBase: ''
      });
      setFiles({ w9: null, insurance: null, mcAuthority: null });

    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "An error occurred while submitting your information.");
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-slate-950 pt-32 px-4 pb-20">
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-brand" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">Submission Received</h2>
          <p className="text-slate-400 text-lg mb-8">
            Thank you for choosing BlitzWerk. Our onboarding team will review your documents and reach out shortly to complete your setup.
          </p>
          <button onClick={() => setSubmitStatus('idle')} className="bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-bold transition-all">
            Submit Another Carrier
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-32 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Carrier Intake Form</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Ready to get loaded? Submit your carrier packet information below and our team will get you set up in our system immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {submitStatus === 'error' && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              <p className="text-red-400 font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Company Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Company Name *</label>
                <input required type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Owner Name *</label>
                <input required type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
              </div>
            </div>

            {/* Operating Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Operating Authority</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">MC Number *</label>
                  <input required type="text" name="mcNumber" value={formData.mcNumber} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">DOT Number *</label>
                  <input required type="text" name="dotNumber" value={formData.dotNumber} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Equipment Type *</label>
                <select required name="equipmentType" value={formData.equipmentType} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none">
                  <option value="">Select Equipment</option>
                  <option value="Dry Van">Dry Van</option>
                  <option value="Reefer">Reefer</option>
                  <option value="Flatbed">Flatbed</option>
                  <option value="Step Deck">Step Deck</option>
                  <option value="Power Only">Power Only</option>
                  <option value="Hotshot">Hotshot</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Preferred Lanes</label>
                <input type="text" name="preferredLanes" placeholder="e.g. Midwest to Southeast" value={formData.preferredLanes} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Home Base (City, State) *</label>
                <input required type="text" name="homeBase" value={formData.homeBase} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all" />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Required Documents</h3>
            <p className="text-sm text-slate-400 mb-6">Upload clear PDF, JPG, or PNG files. Max 10MB per file.</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { id: 'w9', label: 'W-9 Form *', file: files.w9 },
                { id: 'insurance', label: 'Certificate of Insurance *', file: files.insurance },
                { id: 'mcAuthority', label: 'MC Authority Letter *', file: files.mcAuthority },
              ].map((doc) => (
                <div key={doc.id} className="relative group">
                  <label className="cursor-pointer block p-6 border-2 border-dashed border-slate-700 rounded-2xl hover:border-brand hover:bg-slate-800/50 transition-all text-center">
                    {doc.file ? (
                      <div className="space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-brand mx-auto" />
                        <div className="text-sm font-medium text-white truncate px-2">{doc.file.name}</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud className="w-8 h-8 text-slate-500 mx-auto group-hover:text-brand transition-colors" />
                        <div className="text-sm font-medium text-slate-300">{doc.label}</div>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, doc.id as keyof typeof files)} 
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-brand hover:bg-brand-dark disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Profile...
              </>
            ) : (
              'Submit Carrier Information'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
