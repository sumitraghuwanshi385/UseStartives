import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageTitle } from '../App';
import { 
    APP_NAME, 
    ChevronLeftIcon, 
    EnvelopeOpenIcon, 
    PhoneIcon, 
    ChatBubbleLeftRightIcon,
    TwitterXIcon,
    XMarkIcon
} from '../constants';
import { useAppContext } from '../contexts/AppContext';

// --- Custom Select for Subject ---
const CustomSelect: React.FC<{ 
    value: string; 
    onChange: (val: string) => void;
    options: string[];
    placeholder: string;
}> = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl shadow-sm text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium h-12"
      >
        <span className={!value ? 'text-[var(--text-muted)]' : ''}>{value || placeholder}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-[var(--component-background)] border border-[var(--border-primary)] rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto custom-scrollable">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full text-left px-5 py-3 text-sm transition-colors flex items-center justify-between ${value === opt ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold' : 'text-[var(--text-secondary)] hover:bg-[var(--component-background-hover)]'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Rich Small Feedback Modal ---
const FeedbackModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { addNotification, currentUser } = useAppContext();
    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [desc, setDesc] = useState('');
    const [isSending, setIsSending] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!desc.trim()) return;
        setIsSending(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsSending(false);
        addNotification("Feedback received. Thank you!", "success");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[var(--component-background)] border border-[var(--border-primary)] rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 font-poppins">
                <div className="p-6 pb-2 flex justify-between items-center">
                    <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)] uppercase">Give feedback</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--background-tertiary)]"><XMarkIcon className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
                    <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1 px-1">Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} required className="w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl p-3 text-sm" placeholder="Your name" />
                    </div>
                    <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1 px-1">Email (Optional)</label>
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl p-3 text-sm" placeholder="Email address" />
                    </div>
                    <div>
                        <label className="block text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1 px-1">Description</label>
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} required rows={4} className="w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl p-3 text-sm resize-none" placeholder="What can we improve?" />
                    </div>
                    <button type="submit" disabled={isSending} className="w-full py-3.5 button-gradient text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all">
                        {isSending ? "Sending..." : "Submit feedback"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const ContactUsPage: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification, currentUser } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (val: string) => {
        setFormData(prev => ({ ...prev, subject: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.message.trim() || !formData.name.trim()) {
            addNotification("Please fill in your name and message.", "error");
            return;
        }
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        addNotification("Thank you! Your message has been sent successfully. We'll be in touch soon.", "success");
        setFormData({ name: currentUser?.name || '', email: currentUser?.email || '', subject: '', message: '' });
    };

    const inputClasses = "block w-full px-5 py-3.5 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl shadow-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-[var(--text-primary)] text-sm font-medium";

    return (
        <div className="max-w-6xl mx-auto space-y-12 font-poppins">
            <header className="flex flex-col items-center text-center space-y-4">
                <div className="w-full flex justify-start mb-6">
                    <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 group rounded-full px-5 py-2.5 bg-[var(--background-tertiary)] border border-[var(--border-primary)] shadow-sm">
                        <ChevronLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        <span>Go back</span>
                    </button>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-[var(--text-primary)] uppercase">
                    Let's build the <span className="bg-gradient-to-r from-red-500 to-blue-500 gradient-text">future together</span>
                </h1>
                <div className="space-y-1">
                    <p className="max-w-2xl text-base text-[var(--text-secondary)]">
                        Have questions, ideas, or feedback? We're here to help you navigate your startup journey on {APP_NAME}.
                    </p>
                    <button onClick={() => setIsFeedbackOpen(true)} className="text-purple-600 font-bold uppercase text-[10px] tracking-widest hover:underline decoration-2 underline-offset-4">Give feedback</button>
                </div>
            </header>

            <div className="bg-[var(--component-background)] rounded-[3rem] border border-[var(--border-primary)] overflow-hidden flex flex-col lg:flex-row shadow-none">
                <div className="lg:w-1/2 p-8 sm:p-12 space-y-8 bg-gradient-to-br from-red-500/5 to-blue-500/5 border-r border-[var(--border-primary)] text-left">
                    <div>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">Send us a message</h2>
                        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed font-medium">
                            Fill out the form and our team will get back to you within 24-48 hours. We value every message from our community.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600">
                                <PhoneIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[var(--text-primary)]">Fast response</h4>
                                <p className="text-xs text-[var(--text-muted)]">Typically replies in 1 day.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                                <TwitterXIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[var(--text-primary)]">Twitter support</h4>
                                <p className="text-xs text-[var(--text-muted)]">DM us @startives for quick help.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 p-8 sm:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6 text-left">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1">Name*</label>
                                <input name="name" type="text" value={formData.name} onChange={handleInputChange} className={inputClasses} placeholder="Your name" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1">Email</label>
                                <input name="email" type="email" value={formData.email} onChange={handleInputChange} className={inputClasses} placeholder="your@email.com" />
                            </div>
                        </div>
                        <div className="text-left">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1">Subject</label>
                            <CustomSelect 
                                value={formData.subject} 
                                onChange={handleSubjectChange} 
                                placeholder="General inquiry"
                                options={['General inquiry', 'Platform support', 'Partnership', 'Feedback', 'Other']}
                            />
                        </div>
                        <div className="text-left">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1">Message*</label>
                            <textarea name="message" value={formData.message} onChange={handleInputChange} rows={5} className={`${inputClasses} resize-none`} placeholder="How can we help you?" required />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto button-gradient text-white font-black uppercase tracking-widest text-[10px] py-3.5 px-10 rounded-full shadow-lg hover:scale-[1.02] active:scale-100 disabled:opacity-70 flex items-center justify-center space-x-2">
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <><span>Send message</span> <EnvelopeOpenIcon className="w-5 h-5 ml-2"/></>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
        </div>
    );
};

export default ContactUsPage;
