import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { StartupCategory, BusinessModel } from '../types'; 
import { PageTitle } from '../App';
import { 
    STARTUP_CATEGORIES, 
    BUSINESS_MODELS, 
    ChevronLeftIcon,
    IdeaStarIcon,
    BoltIcon,
    COUNTRIES,
    UsersIcon,
    ChartBarIcon,
    PhotoIcon,
    AppContextBriefcaseIcon,
    AppContextChatBubbleIcon,
    IdentificationIcon,
    CurrencyDollarIcon,
    AppContextLinkIcon,
    XMarkIcon,
    CalendarDaysIcon,
    GlobeAltIcon
} from '../constants';

const DocumentTextIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

// --- Custom Select Dropdown Component ---
interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder = "Select...", className = "" }) => {
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
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg shadow-sm text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-poppins font-medium h-11"
      >
        <span className={!value ? 'text-[var(--text-muted)]' : ''}>{value || placeholder}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-[var(--component-background)] border border-[var(--border-primary)] rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollable">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors flex items-center justify-between font-poppins ${value === opt ? 'bg-red-50 dark:bg-red-900/20 text-red-600 font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--component-background-hover)]'}`}
            >
              {opt}
              {value === opt && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" /></svg>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface FormRowProps {
  label: string;
  subtext?: string;
  children: React.ReactNode;
  isRequired?: boolean;
}
const FormRow: React.FC<FormRowProps> = ({ label, subtext, children, isRequired }) => (
  <div className="grid md:grid-cols-3 gap-3 md:gap-5 items-start">
    <div className="md:col-span-1 pt-1 md:pt-2.5">
      <label className="flex items-center text-sm font-semibold text-[var(--text-secondary)] font-poppins tracking-tight">
        {label} {isRequired && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>
      {subtext && <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold leading-relaxed text-left font-poppins">{subtext}</p>}
    </div>
    <div className="md:col-span-2">{children}</div>
  </div>
);

interface FormSectionProps {
    title: string;
    icon: React.ReactNode;
    subtext: string;
    children: React.ReactNode;
}
const FormSection: React.FC<FormSectionProps> = ({ title, icon, subtext, children }) => (
    <div className="space-y-8">
        <div className="pb-3 border-b border-[var(--border-primary)]">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full icon-bg-gradient flex items-center justify-center shadow-md">
                    {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4 text-white" })}
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] font-poppins tracking-tight">{title}</h3>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-bold pl-11 font-poppins">{subtext}</p>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const SubmitAssetPage: React.FC = () => {
    const { addNotification, addIdea, currentUser } = useAppContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '', tagline: '', description: '', spark: '',
        askingPrice: '', ttmRevenue: '', mrr: '', growthRate: '', multiplier: '', netProfit: '', churnRate: '',
        category: 'SaaS' as StartupCategory, businessModel: 'B2B' as BusinessModel, location: '',
        websiteUrl: '', brandLogo: '', cardCover: '', gallery: [] as string[],
        sellerNotes: '', handoverNotes: '', reasonForSale: '', teamSize: '', revenueModel: '',
        paymentMethods: '', contactEmail: currentUser?.email || '', techStack: '', users: '', retention: '',
        siteAge: '', directTraffic: '', trafficDetails: '', sellerInsightsDetails: '', additionalContactDetails: '',
        growthPulse: '', teamDetails: '', competitorInfo: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'brandLogo' | 'cardCover' | 'gallery') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        if (field === 'gallery') {
            (Array.from(files) as File[]).forEach((file: File) => {
                const reader = new FileReader();
                reader.onloadend = () => setFormData(prev => ({ ...prev, gallery: [...prev.gallery, reader.result as string].slice(0, 5) }));
                reader.readAsDataURL(file);
            });
        } else {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, [field]: reader.result as string }));
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Define what is NOT mandatory
        const optionalFields = ['gallery', 'competitorInfo', 'techStack'];
        
        // Define key core fields to strictly check
        const mandatoryChecklist = [
            'title', 'tagline', 'description', 'spark', 'siteAge', 
            'category', 'businessModel', 'location', 'revenueModel', 
            'teamSize', 'brandLogo', 'cardCover', 'askingPrice', 
            'reasonForSale', 'paymentMethods', 'contactEmail'
        ];

        const missing = mandatoryChecklist.filter(f => !(formData as any)[f]);

        if (missing.length > 0) {
            addNotification(`Please complete all mandatory fields. Missing: ${missing[0].charAt(0).toUpperCase() + missing[0].slice(1)}`, "error");
            setIsLoading(false); 
            return;
        }

        await new Promise(r => setTimeout(r, 1000));
        addIdea({ ...formData, imageDataUrl: formData.brandLogo, stage: 'Launched' } as any);
        addNotification("Asset successfully enrolled!", "success");
        navigate('/my-projects');
    };

    const inputClasses = "block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg shadow-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-[var(--text-primary)] text-sm font-poppins font-medium";
    const subBoxClasses = "block w-full px-3 py-2 mt-2 bg-neutral-50 dark:bg-neutral-900 border border-dashed border-[var(--border-secondary)] rounded-lg text-xs text-[var(--text-secondary)] font-poppins focus:outline-none";

    return (
        <div className="max-w-3xl mx-auto pb-24 font-poppins">
            <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all rounded-full px-5 py-2 bg-[var(--background-tertiary)] border border-[var(--border-primary)] shadow-sm">
                <ChevronLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Back</span>
            </button>

            <PageTitle title="Asset Enrollment" description="Present your digital masterpiece to potential acquirers." />

            <form onSubmit={handleSubmit} className="bg-[var(--component-background)] p-6 sm:p-8 rounded-2xl border border-[var(--border-primary)] shadow-sm space-y-12">
                
                {/* Section 1: The Narrative */}
                <FormSection title="The Narrative" icon={<BoltIcon />} subtext="The story and vision behind your build.">
                    <FormRow label="Project Name" isRequired subtext="Official name of the asset.">
                        <input name="title" value={formData.title} onChange={handleInputChange} required className={inputClasses} placeholder="e.g. EcoRoute SaaS" />
                    </FormRow>
                    <FormRow label="Tagline" isRequired subtext="Catchy summary for the marketplace.">
                        <input name="tagline" value={formData.tagline} onChange={handleInputChange} required className={inputClasses} placeholder="Navigate the world, sustainably." />
                    </FormRow>
                    <FormRow label="Official Summary" isRequired subtext="Full breakdown of the value proposition.">
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} required className={`${inputClasses} resize-none`} placeholder="Comprehensive breakdown of what you've built..." />
                    </FormRow>
                    <FormRow label="Founder's Spark" isRequired subtext="The personal origin story of this build.">
                        <textarea name="spark" value={formData.spark} onChange={handleInputChange} rows={3} required className={inputClasses} placeholder="Why did you build this? Inspiration?" />
                    </FormRow>
                </FormSection>

                {/* Section 2: Registry Info */}
                <FormSection title="Registry Details" icon={<CalendarDaysIcon />} subtext="Domain age and establishment info.">
                    <FormRow label="Site Age" isRequired subtext="How long has it been online?">
                        <input name="siteAge" value={formData.siteAge} onChange={handleInputChange} className={inputClasses} placeholder="2 Years, 4 Months" />
                    </FormRow>
                </FormSection>

                {/* Section 3: Technical & Team */}
                <FormSection title="Technical & Team" icon={<IdentificationIcon />} subtext="Foundation and structural data.">
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormRow label="Category" isRequired subtext="Industry segment.">
                            <CustomSelect value={formData.category} options={STARTUP_CATEGORIES} onChange={v => setFormData(p => ({...p, category: v as StartupCategory}))} />
                        </FormRow>
                        <FormRow label="Monetization" isRequired subtext="How does it generate funds?">
                            <input name="revenueModel" value={formData.revenueModel} onChange={handleInputChange} className={inputClasses} placeholder="SaaS, Ads, Transaction" />
                        </FormRow>
                    </div>
                    <FormRow label="Built With" subtext="Comma separated tech stack. (Optional)">
                        <input name="techStack" value={formData.techStack} onChange={handleInputChange} className={inputClasses} placeholder="React, AWS, Node" />
                    </FormRow>
                    <FormRow label="Team Profile" isRequired subtext="Size and structure of the team.">
                        <div className="space-y-2">
                            <input name="teamSize" value={formData.teamSize} onChange={handleInputChange} className={inputClasses} placeholder="3 Core Members" />
                            <textarea name="teamDetails" value={formData.teamDetails} onChange={handleInputChange} rows={3} className={subBoxClasses} placeholder="Describe the team's involvement and structure..." />
                        </div>
                    </FormRow>
                    <FormRow label="Operational Base" isRequired subtext="Main region of operations.">
                        <CustomSelect value={formData.location} placeholder="Select Country" options={COUNTRIES.map(c => c.name)} onChange={v => setFormData(p => ({...p, location: v}))} />
                    </FormRow>
                    <FormRow label="Product Link" isRequired subtext="Public URL for live preview.">
                        <input name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} className={inputClasses} placeholder="https://..." />
                    </FormRow>
                </FormSection>

                {/* Section 4: Product Identity */}
                <FormSection title="Product Identity" icon={<IdeaStarIcon />} subtext="Branding and visual proof for the shop listing.">
                    <FormRow label="Brand Logo" isRequired subtext="High-resolution square icon.">
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--border-primary)] rounded-xl bg-[var(--background-tertiary)] hover:border-red-500/20 transition-all cursor-pointer w-full relative group" onClick={() => logoInputRef.current?.click()}>
                            {formData.brandLogo ? <img src={formData.brandLogo} className="h-16 w-16 object-contain rounded-lg" /> : (
                                <div className="flex flex-col items-center pointer-events-none">
                                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <PlusIcon className="w-6 h-6 text-red-500" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase font-poppins text-[var(--text-muted)]">Upload Logo*</span>
                                </div>
                            )}
                            <input type="file" ref={logoInputRef} className="hidden" onChange={e => handleImageUpload(e, 'brandLogo')} accept="image/*" />
                        </div>
                    </FormRow>
                    <FormRow label="Card Cover" isRequired subtext="Main visual for the marketplace card.">
                         <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--border-primary)] rounded-xl bg-[var(--background-tertiary)] hover:border-red-500/20 transition-all cursor-pointer w-full relative group" onClick={() => coverInputRef.current?.click()}>
                            {formData.cardCover ? <img src={formData.cardCover} className="h-20 w-full object-cover rounded-lg" /> : (
                                <div className="flex flex-col items-center pointer-events-none">
                                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <PhotoIcon className="w-6 h-6 text-red-500" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase font-poppins text-[var(--text-muted)]">Upload Cover Image*</span>
                                </div>
                            )}
                            <input type="file" ref={coverInputRef} className="hidden" onChange={e => handleImageUpload(e, 'cardCover')} accept="image/*" />
                        </div>
                    </FormRow>
                    <FormRow label="Gallery" subtext="Supporting screenshots. (Optional)">
                         <div className="space-y-4">
                            <div className="flex flex-wrap gap-3">
                                {formData.gallery.map((img, i) => (
                                    <div key={i} className="relative w-full aspect-[16/9] sm:w-[calc(50%-0.75rem)] rounded-xl overflow-hidden border border-[var(--border-primary)] group">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setFormData(p => ({...p, gallery: p.gallery.filter((_, idx) => idx !== i)}))} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><XMarkIcon className="w-4 h-4"/></button>
                                    </div>
                                ))}
                                {formData.gallery.length < 5 && (
                                    <button type="button" onClick={() => galleryInputRef.current?.click()} className="w-full aspect-[16/9] sm:w-[calc(50%-0.75rem)] rounded-xl border-2 border-dashed border-[var(--border-primary)] flex flex-col items-center justify-center text-[var(--text-muted)] hover:border-red-500/30 transition-all gap-2 p-6 group">
                                        <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <PlusIcon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[9px] font-bold uppercase">Add Screenshot</span>
                                    </button>
                                )}
                            </div>
                            <input type="file" ref={galleryInputRef} className="hidden" onChange={e => handleImageUpload(e, 'gallery')} multiple accept="image/*" />
                         </div>
                    </FormRow>
                </FormSection>

                {/* Section 5: Competitor Info */}
                <FormSection title="Competitive Analysis" icon={<GlobeAltIcon />} subtext="Market positioning and rivals. (Optional)">
                    <FormRow label="Competitors" subtext="List main rivals and your edge.">
                        <textarea name="competitorInfo" value={formData.competitorInfo} onChange={handleInputChange} rows={3} className={inputClasses} placeholder="List 2-3 main competitors and what makes you better..." />
                    </FormRow>
                </FormSection>

                {/* Section 6: Financial Pulse */}
                <FormSection title="Financial Identity" icon={<CurrencyDollarIcon />} subtext="Valuation, revenue, and churn metrics.">
                    <FormRow label="Asking Price" isRequired subtext="Total cost to acquire the asset.">
                        <input name="askingPrice" value={formData.askingPrice} onChange={handleInputChange} required className={inputClasses} placeholder="$45,000" />
                    </FormRow>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormRow label="TTM Revenue" isRequired subtext="Last 12 months income.">
                            <input name="ttmRevenue" value={formData.ttmRevenue} onChange={handleInputChange} className={inputClasses} placeholder="$12k" />
                        </FormRow>
                        <FormRow label="Monthly MRR" isRequired subtext="Current monthly revenue.">
                            <input name="mrr" value={formData.mrr} onChange={handleInputChange} className={inputClasses} placeholder="$450" />
                        </FormRow>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormRow label="Profit Multiplier" isRequired subtext="Valuation multiple used.">
                            <input name="multiplier" value={formData.multiplier} onChange={handleInputChange} className={inputClasses} placeholder="3.5x" />
                        </FormRow>
                        <FormRow label="Growth Pulse" isRequired subtext="Recent momentum pulse.">
                            <input name="growthPulse" value={formData.growthPulse} onChange={handleInputChange} className={inputClasses} placeholder="+12% Monthly" />
                        </FormRow>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormRow label="Net Profit (%)" isRequired subtext="Average profit margin.">
                            <input name="netProfit" value={formData.netProfit} onChange={handleInputChange} className={inputClasses} placeholder="85%" />
                        </FormRow>
                        <FormRow label="Churn Rate" isRequired subtext="Monthly subscriber loss.">
                            <input name="churnRate" value={formData.churnRate} onChange={handleInputChange} className={inputClasses} placeholder="2.4%" />
                        </FormRow>
                    </div>
                </FormSection>

                {/* Section 7: Strategy */}
                <FormSection title="Seller Notes" icon={<DocumentTextIcon />} subtext="Exit strategy and handover details.">
                    <FormRow label="Reason for Sale" isRequired subtext="Why are you listing the asset?">
                        <textarea name="reasonForSale" value={formData.reasonForSale} onChange={handleInputChange} rows={4} className={inputClasses} placeholder="Focusing on AI projects. Need liquidity..." />
                    </FormRow>
                    <FormRow label="Seller Insights" isRequired subtext="Detailed growth advice.">
                         <textarea name="sellerInsightsDetails" value={formData.sellerInsightsDetails} onChange={handleInputChange} rows={4} className={subBoxClasses} placeholder="Ready for a marketing-focused owner to scale..." />
                    </FormRow>
                    <FormRow label="Handover Info" isRequired subtext="Assets included in the sale.">
                        <input name="handoverNotes" value={formData.handoverNotes} onChange={handleInputChange} className={inputClasses} placeholder="Domain, Source, Support" />
                    </FormRow>
                </FormSection>

                {/* Section 8: Closing */}
                <FormSection title="Closing Details" icon={<UsersIcon />} subtext="Transaction and finalization steps.">
                    <FormRow label="Payment Method" isRequired subtext="Preferred ways to receive funds.">
                        <textarea name="paymentMethods" value={formData.paymentMethods} onChange={handleInputChange} rows={3} className={inputClasses} placeholder="Escrow, Bank, Stripe..." />
                    </FormRow>
                    <FormRow label="Contact Info" isRequired subtext="Direct email for due diligence.">
                        <div className="space-y-4">
                            <input name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} type="email" className={inputClasses} placeholder="founder@venture.com" />
                            <textarea name="additionalContactDetails" isRequired value={formData.additionalContactDetails} onChange={handleInputChange} rows={3} className={subBoxClasses} placeholder="Additional options like Slack, LinkedIn..." />
                        </div>
                    </FormRow>
                </FormSection>

                <div className="pt-8 border-t border-[var(--border-primary)] flex justify-end">
                    <button type="submit" disabled={isLoading} className="button-gradient px-12 py-3 rounded-full text-white text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all font-poppins">
                        {isLoading ? "Listing..." : "Enroll Asset"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmitAssetPage;