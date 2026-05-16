import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, UploadCloud, AlertCircle, Loader2, Truck } from "lucide-react";
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
    trailerType: '',
    preferredLanes: '',
    homeBase: '',
    yearsOperating: '',
    numberOfTrucks: '',
  });

  const [files, setFiles] = useState<{
    w9: File | null;
    insurance: File | null;
    mcAuthority: File | null;
    safetyPacket: File | null;
  }>({
    w9: null,
    insurance: null,
    mcAuthority: null,
    safetyPacket: null,
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
      setErrorMessage("Please upload all required documents (W-9, Insurance, MC Authority).");
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionId = crypto.randomUUID();

      // Upload documents
      const w9Url = await uploadFile(files.w9, submissionId, 'w9');
      const insuranceUrl = await uploadFile(files.insurance, submissionId, 'insurance');
      const mcAuthorityUrl = await uploadFile(files.mcAuthority, submissionId, 'mc_authority');
      
      let safetyPacketUrl = null;
      if (files.safetyPacket) {
        safetyPacketUrl = await uploadFile(files.safetyPacket, submissionId, 'safety_packet');
      }

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
          trailer_type: formData.trailerType,
          preferred_lanes: formData.preferredLanes,
          home_base: formData.homeBase,
          years_operating: formData.yearsOperating ? parseInt(formData.yearsOperating) : null,
          number_of_trucks: formData.numberOfTrucks ? parseInt(formData.numberOfTrucks) : null,
          w9_url: w9Url,
          insurance_url: insuranceUrl,
          mc_authority_url: mcAuthorityUrl,
          optional_safety_packet_url: safetyPacketUrl,
        });

      if (insertError) throw insertError;

      setSubmitStatus('success');
      setFormData({
        companyName: '', ownerName: '', phone: '', email: '',
        mcNumber: '', dotNumber: '', equipmentType: '', trailerType: '', preferredLanes: '', homeBase: '', yearsOperating: '', numberOfTrucks: ''
      });
      setFiles({ w9: null, insurance: null, mcAuthority: null, safetyPacket: null });

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
      <div className="min-h-screen bg-surface pt-32 px-4 pb-20">
        <div className="max-w-3xl mx-auto bg-industrial-panel rounded-none p-12 text-center border-t-4 border-brand">
          <div className="w-20 h-20 bg-brand/10 border border-brand/30 rounded-none flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-brand" />
          </div>
          <h2 className="text-3xl font-industrial font-bold text-white mb-4 uppercase tracking-wider">Submission Received</h2>
          <p className="text-slate-300 text-lg mb-8">
            Thank you for choosing BlitzWerk. Our onboarding team will review your documents and reach out shortly to complete your setup for our regional network.
          </p>
          <button onClick={() => setSubmitStatus('idle')} className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-none font-industrial font-bold uppercase tracking-wider transition-all border border-brand-dark">
            Submit Another Carrier
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] pt-32 px-4 pb-20 relative">
      <div className="absolute inset-0 bg-texture-steel opacity-10 mix-blend-multiply"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-brand font-industrial font-bold tracking-[0.2em] uppercase text-sm mb-4">
            <Truck className="w-4 h-4" /> REGIONAL ONBOARDING
          </div>
          <h1 className="text-4xl md:text-5xl font-industrial font-bold text-white mb-4 uppercase">CARRIER SETUP PACKET</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Submit your carrier information below to begin the setup process for our Texas regional flatbed network.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-industrial-panel rounded-none p-8 md:p-12 shadow-2xl border-t-4 border-t-brand">
          {submitStatus === 'error' && (
            <div className="mb-8 p-4 bg-red-950/50 border border-red-500/50 rounded-none flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              <p className="text-red-400 font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Company Info */}
            <div className="space-y-5">
              <h3 className="text-xl font-industrial font-bold text-white mb-4 border-b border-slate-700 pb-2 uppercase tracking-wide">Company Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">Company Name *</label>
                <input required type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-sans" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">Owner Name *</label>
                <input required type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-sans" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">Phone Number *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-sans" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-sans" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">Years Operating</label>
                  <input type="number" name="yearsOperating" min="0" value={formData.yearsOperating} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">Number of Trucks *</label>
                  <input required type="number" name="numberOfTrucks" min="1" value={formData.numberOfTrucks} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-sans" />
                </div>
              </div>
            </div>

            {/* Operating Info */}
            <div className="space-y-5">
              <h3 className="text-xl font-industrial font-bold text-white mb-4 border-b border-slate-700 pb-2 uppercase tracking-wide">Operating Profile</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">MC Number *</label>
                  <input required type="text" name="mcNumber" value={formData.mcNumber} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">DOT Number *</label>
                  <input required type="text" name="dotNumber" value={formData.dotNumber} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-sans" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">Equipment *</label>
                  <select required name="equipmentType" value={formData.equipmentType} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none font-sans">
                    <option value="">Select...</option>
                    <option value="Flatbed">Flatbed</option>
                    <option value="Step Deck">Step Deck</option>
                    <option value="RGN">RGN</option>
                    <option value="Conestoga">Conestoga</option>
                    <option value="Hotshot Flatbed">Hotshot Flatbed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">Trailer Details</label>
                  <input type="text" name="trailerType" placeholder="e.g. 48' Aluminum" value={formData.trailerType} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-sans" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">Preferred Regional Lanes *</label>
                <input required type="text" name="preferredLanes" placeholder="e.g. Houston to Dallas, TX to OK" value={formData.preferredLanes} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-sans" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 uppercase tracking-wider">Home Base (City, State) *</label>
                <input required type="text" name="homeBase" value={formData.homeBase} onChange={handleInputChange} className="w-full bg-surface-lighter border border-slate-600 rounded-none px-4 py-3 text-white focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all font-sans" />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-industrial font-bold text-white mb-4 border-b border-slate-700 pb-2 uppercase tracking-wide">CARRIER QUALIFICATION DOCUMENTS</h3>
            <p className="text-sm text-slate-400 mb-6">Upload clear PDF, JPG, or PNG files. Max 10MB per file.</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'w9', label: 'W-9 Form *', sub: 'Required for payment processing', file: files.w9 },
                { id: 'insurance', label: 'Certificate of Insurance *', sub: '$1M Auto, $100k Cargo', file: files.insurance },
                { id: 'mcAuthority', label: 'MC Authority Letter *', sub: 'Must show active status', file: files.mcAuthority },
                { id: 'safetyPacket', label: 'Safety Packet (Optional)', sub: 'Helpful for faster broker setup', file: files.safetyPacket },
              ].map((doc) => (
                <div key={doc.id} className="relative group">
                  <label className="cursor-pointer block p-4 border border-dashed border-slate-600 bg-surface-lighter rounded-none hover:border-brand hover:bg-surface-lighter/80 transition-all text-center h-full flex flex-col justify-center min-h-[120px]">
                    {doc.file ? (
                      <div className="space-y-2">
                        <CheckCircle2 className="w-6 h-6 text-brand mx-auto" />
                        <div className="text-xs font-medium text-white truncate px-2">{doc.file.name}</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud className="w-6 h-6 text-slate-400 mx-auto group-hover:text-brand transition-colors" />
                        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">{doc.label}</div>
                        <div className="text-[10px] text-slate-500">{doc.sub}</div>
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
            className="w-full bg-surface-light hover:bg-brand-dark disabled:bg-slate-700 disabled:border-slate-600 disabled:cursor-not-allowed text-white font-industrial font-bold uppercase tracking-widest py-5 rounded-none flex items-center justify-center gap-3 transition-colors border-2 border-brand shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing Submission...
              </>
            ) : (
              'Submit Carrier Packet'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
