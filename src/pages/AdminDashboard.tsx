import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Truck, MessageSquare, Shield, AlertCircle } from 'lucide-react';

interface CarrierSubmission {
  id: string;
  company_name: string;
  owner_name: string;
  email: string;
  phone: string;
  mc_number: string;
  dot_number: string;
  equipment_type: string;
  home_base: string;
  created_at: string;
  status: string;
}

interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  company_name: string | null;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'carriers' | 'messages'>('carriers');
  const [carriers, setCarriers] = useState<CarrierSubmission[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [carrierRes, messageRes] = await Promise.all([
        supabase.from('carrier_intake_submissions').select('id, company_name, owner_name, email, phone, mc_number, dot_number, equipment_type, home_base, created_at, status').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('id, full_name, email, company_name, message, status, created_at').order('created_at', { ascending: false })
      ]);

      if (carrierRes.error) throw carrierRes.error;
      if (messageRes.error) throw messageRes.error;

      setCarriers(carrierRes.data as CarrierSubmission[]);
      setMessages(messageRes.data as ContactMessage[]);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCarrierStatus = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setCarriers(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      
      const { error } = await supabase
        .from('carrier_intake_submissions')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        // Revert on error
        fetchData();
        throw error;
      }
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  const updateMessageStatus = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));

      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        fetchData();
        throw error;
      }
    } catch (err: any) {
      console.error('Error updating message status:', err);
      alert('Failed to update message status: ' + err.message);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] pt-28 px-4 pb-20 font-sans">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-brand font-industrial font-bold tracking-[0.2em] uppercase text-sm mb-2">
              <Shield className="w-4 h-4" /> ADMIN PANEL
            </div>
            <h1 className="text-3xl md:text-4xl font-industrial font-bold text-white uppercase">CRM Dashboard</h1>
          </div>
          
          <div className="flex bg-slate-900 rounded-none border border-slate-800 p-1">
            <button
              onClick={() => setActiveTab('carriers')}
              className={`px-6 py-2 font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 ${
                activeTab === 'carriers' 
                  ? 'bg-brand text-white border-b-2 border-brand' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              Carrier Applications
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-2 font-bold uppercase tracking-wider text-sm transition-all flex items-center gap-2 ${
                activeTab === 'messages' 
                  ? 'bg-brand text-white border-b-2 border-brand' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Contact Messages
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-500/50 text-red-400 px-4 py-3 rounded flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-slate-400">Loading data...</div>
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-none shadow-xl overflow-hidden">
            {activeTab === 'carriers' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-bold">Company / Owner</th>
                      <th className="px-4 py-3 font-bold">Contact</th>
                      <th className="px-4 py-3 font-bold">MC / DOT</th>
                      <th className="px-4 py-3 font-bold">Equipment / Base</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 font-bold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {carriers.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No applications found.</td></tr>
                    ) : (
                      carriers.map(carrier => (
                        <tr key={carrier.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-4">
                            <div className="font-bold text-white">{carrier.company_name}</div>
                            <div className="text-xs text-slate-400">{carrier.owner_name}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-white">{carrier.phone}</div>
                            <div className="text-xs text-brand">{carrier.email}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div>MC: {carrier.mc_number}</div>
                            <div className="text-xs text-slate-400">DOT: {carrier.dot_number}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-white">{carrier.equipment_type}</div>
                            <div className="text-xs text-slate-400">{carrier.home_base}</div>
                          </td>
                          <td className="px-4 py-4">
                            <select 
                              value={carrier.status}
                              onChange={(e) => updateCarrierStatus(carrier.id, e.target.value)}
                              className="bg-slate-950 border border-slate-700 text-xs font-bold uppercase rounded px-2 py-1.5 text-white focus:border-brand outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewing">Reviewing</option>
                              <option value="missing_docs">Missing Docs</option>
                              <option value="interview_scheduled">Interview</option>
                              <option value="approved">Approved</option>
                              <option value="active">Active</option>
                              <option value="paused">Paused</option>
                              <option value="rejected">Rejected</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-400">
                            {formatDate(carrier.created_at)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-bold">Sender</th>
                      <th className="px-4 py-3 font-bold">Email</th>
                      <th className="px-4 py-3 font-bold">Message</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 font-bold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {messages.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No messages found.</td></tr>
                    ) : (
                      messages.map(msg => (
                        <tr key={msg.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-4 align-top">
                            <div className="font-bold text-white">{msg.full_name}</div>
                            {msg.company_name && <div className="text-xs text-slate-400">{msg.company_name}</div>}
                          </td>
                          <td className="px-4 py-4 align-top text-brand">{msg.email}</td>
                          <td className="px-4 py-4 align-top max-w-md">
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                          </td>
                          <td className="px-4 py-4 align-top">
                            <select 
                              value={msg.status}
                              onChange={(e) => updateMessageStatus(msg.id, e.target.value)}
                              className="bg-slate-950 border border-slate-700 text-xs font-bold uppercase rounded px-2 py-1.5 text-white focus:border-brand outline-none"
                            >
                              <option value="unread">Unread</option>
                              <option value="read">Read</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="px-4 py-4 align-top text-xs text-slate-400">
                            {formatDate(msg.created_at)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
