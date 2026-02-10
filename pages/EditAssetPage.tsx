import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { StartupCategory, BusinessModel, StartupIdea } from '../types'; 
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
                <h3 className="text-xl font-bold text-[var(--text-primary)] font-poppins tracking-tight uppercase">{title}</h3>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-bold pl-11 font-poppins">{subtext}</p>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const EditAssetPage: React.FC = () => {
    const { assetId } = useParams<{ assetId: string }>();
    const { getIdeaById, updateIdea, addNotification } = useAppContext();
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
        paymentMethods: '', contactEmail: '', techStack: '', users: '', retention: '',
        siteAge: '', directTraffic: '', trafficDetails: '', sellerInsightsDetails: '', additionalContactDetails: '',
        growthPulse: '', teamDetails: '', competitorInfo: ''
    });

    useEffect(() => {
        if (!assetId) return;
        const idea = getIdeaById(assetId);
        if (!idea) return;
        setFormData({
            title: idea.title || '', tagline: idea.tagline || '', description: idea.description || '', spark: idea.spark || '',
            askingPrice: idea.askingPrice || '', ttmRevenue: idea.ttmRevenue || '', mrr: idea.mrr || '', growthRate: idea.growth || '', multiplier: idea.multiplier || '', netProfit: idea.netProfit || '', churnRate: idea.churnRate || '',
            category: idea.category || 'SaaS', businessModel: idea.businessModel || 'B2B', location: idea.location || '',
            websiteUrl: idea.websiteUrl || '', brandLogo: idea.imageUrl || '', cardCover: idea.imageUrl || '', gallery: [],
            sellerNotes: '', handoverNotes: idea.handoverNotes || '', reasonForSale: idea.reasonForSale || '', teamSize: idea.teamSize?.toString() || '', revenueModel: idea.revenueModel || '',
            paymentMethods: idea.paymentMethods || '', contactEmail: idea.contactEmail || '', techStack: idea.techStack?.join(', ') || '', users: idea.users || '', retention: idea.retention || '',
            siteAge: idea.siteAge || '', directTraffic: idea.directTraffic || '', trafficDetails: idea.trafficDetails || '', sellerInsightsDetails: idea.sellerInsightsDetails || '', additionalContactDetails: idea.additionalContactDetails || '',
            growthPulse: idea.growthPulse || '', teamDetails: idea.teamDetails || '', competitorInfo: idea.competitorInfo || ''
        });
    }, [assetId, getIdeaById]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'brandLogo' | 'cardCover' | 'gallery') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        if (field === 'gallery') {
            Array.from(files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onloadend = () => setFormData(prev => ({ ...prev, gallery: [...prev.gallery, reader.result as string].slice(0, 5) }));
                reader.readAsDataURL(file);
            });
        } else {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, [field]: reader.result as string }));
            reader.readAsDataURL(files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const mandatoryChecklist = [
            'title', 'tagline', 'description', 'spark', 'siteAge', 
            'category', 'businessModel', 'location', 'revenueModel', 
            'teamSize', 'brandLogo', 'cardCover', 'askingPrice', 
            'reasonForSale', 'paymentMethods', 'contactEmail'
        ];

        const missing = mandatoryChecklist.filter(f => !(formData as any)[f]);
        if (missing.length > 0) {
            addNotification(`Missing: ${missing[0]}`, "error");
            setIsLoading(false); return;
        }

        await new Promise(r => setTimeout(r, 1000));
        updateIdea(assetId!, { ...formData, imageUrl: formData.brandLogo } as any);
        addNotification("Asset updated!", "success");
        navigate(`/asset/${assetId}`);
    };

    return (
        <div className="max-w-3xl mx-auto pb-24 font-poppins">
            <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all rounded-full px-5 py-2 bg-[var(--background-tertiary)] border border-[var(--border-primary)] shadow-none">
                <ChevronLeftIcon className="w-3.5 h-3.5" />
                <span>Back</span>
            </button>

            <PageTitle title="Update Asset" description={`Refining "${formData.title}"`} />

            <form onSubmit={handleSubmit} className="bg-[var(--component-background)] p-6 sm:p-8 rounded-[2.5rem] border border-[var(--border-primary)] shadow-none space-y-12">
                <FormSection title="The Narrative" icon={<BoltIcon />} subtext="Story and vision details.">
                    <FormRow label="Project Name" isRequired><input name="title" value={formData.title} onChange={handleInputChange} required className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                    <FormRow label="Tagline" isRequired><input name="tagline" value={formData.tagline} onChange={handleInputChange} required className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                    <FormRow label="Official Summary" isRequired><textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} required className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm resize-none" /></FormRow>
                    <FormRow label="Founder's Spark" isRequired><textarea name="spark" value={formData.spark} onChange={handleInputChange} rows={3} required className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm resize-none" /></FormRow>
                </FormSection>

                <FormSection title="Registry Details" icon={<CalendarDaysIcon />} subtext="Domain and establishment.">
                    <FormRow label="Site Age" isRequired><input name="siteAge" value={formData.siteAge} onChange={handleInputChange} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                </FormSection>

                <FormSection title="Technical & Team" icon={<IdentificationIcon />} subtext="Structural data.">
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormRow label="Category" isRequired><CustomSelect value={formData.category} options={STARTUP_CATEGORIES} onChange={v => setFormData(p => ({...p, category: v as StartupCategory}))} /></FormRow>
                        <FormRow label="Monetization" isRequired><input name="revenueModel" value={formData.revenueModel} onChange={handleInputChange} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                    </div>
                    <FormRow label="Built With"><input name="techStack" value={formData.techStack} onChange={handleInputChange} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                    <FormRow label="Team Profile" isRequired><textarea name="teamDetails" value={formData.teamDetails} onChange={handleInputChange} rows={3} className="block w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-dashed border-[var(--border-secondary)] rounded-lg text-xs" /></FormRow>
                    <FormRow label="Location" isRequired><CustomSelect value={formData.location} placeholder="Select Country" options={COUNTRIES.map(c => c.name)} onChange={v => setFormData(p => ({...p, location: v}))} /></FormRow>
                    <FormRow label="Product Link" isRequired><input name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                </FormSection>

                <FormSection title="Product Identity" icon={<IdeaStarIcon />} subtext="Visual branding.">
                    <FormRow label="Brand Logo" isRequired>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--border-primary)] rounded-xl bg-[var(--background-tertiary)] cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                            {formData.brandLogo ? <img src={formData.brandLogo} className="h-16 w-16 object-contain rounded-lg" /> : <PhotoIcon className="w-8 h-8 text-neutral-400" />}
                            <input type="file" ref={logoInputRef} className="hidden" onChange={e => handleImageUpload(e, 'brandLogo')} accept="image/*" />
                        </div>
                    </FormRow>
                    <FormRow label="Card Cover" isRequired>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--border-primary)] rounded-xl bg-[var(--background-tertiary)] cursor-pointer" onClick={() => coverInputRef.current?.click()}>
                            {formData.cardCover ? <img src={formData.cardCover} className="h-20 w-full object-cover rounded-lg" /> : <PhotoIcon className="w-8 h-8 text-neutral-400" />}
                            <input type="file" ref={coverInputRef} className="hidden" onChange={e => handleImageUpload(e, 'cardCover')} accept="image/*" />
                        </div>
                    </FormRow>
                </FormSection>

                <FormSection title="Competitive Analysis" icon={<GlobeAltIcon />} subtext="Market Positioning.">
                    <FormRow label="Competitors"><textarea name="competitorInfo" value={formData.competitorInfo} onChange={handleInputChange} rows={3} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm resize-none" /></FormRow>
                </FormSection>

                <FormSection title="Financial Identity" icon={<CurrencyDollarIcon />} subtext="Valuation and revenue.">
                    <FormRow label="Asking Price" isRequired><input name="askingPrice" value={formData.askingPrice} onChange={handleInputChange} required className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormRow label="TTM Revenue" isRequired><input name="ttmRevenue" value={formData.ttmRevenue} onChange={handleInputChange} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                        <FormRow label="Monthly MRR" isRequired><input name="mrr" value={formData.mrr} onChange={handleInputChange} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormRow label="Multiplier" isRequired><input name="multiplier" value={formData.multiplier} onChange={handleInputChange} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                        <FormRow label="Growth Pulse" isRequired><input name="growthPulse" value={formData.growthPulse} onChange={handleInputChange} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormRow label="Net Profit (%)" isRequired><input name="netProfit" value={formData.netProfit} onChange={handleInputChange} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                        <FormRow label="Churn Rate" isRequired><input name="churnRate" value={formData.churnRate} onChange={handleInputChange} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                    </div>
                </FormSection>

                <FormSection title="Seller Notes" icon={<DocumentTextIcon />} subtext="Handover details.">
                    <FormRow label="Reason for Sale" isRequired><textarea name="reasonForSale" value={formData.reasonForSale} onChange={handleInputChange} rows={4} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm resize-none" /></FormRow>
                    <FormRow label="Seller Insights" isRequired><textarea name="sellerInsightsDetails" value={formData.sellerInsightsDetails} onChange={handleInputChange} rows={4} className="block w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-dashed border-[var(--border-secondary)] rounded-lg text-xs" /></FormRow>
                    <FormRow label="Handover Info" isRequired><input name="handoverNotes" value={formData.handoverNotes} onChange={handleInputChange} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /></FormRow>
                </FormSection>

                <FormSection title="Closing Details" icon={<UsersIcon />} subtext="Transaction steps.">
                    <FormRow label="Payment Method" isRequired><textarea name="paymentMethods" value={formData.paymentMethods} onChange={handleInputChange} rows={3} className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm resize-none" /></FormRow>
                    <FormRow label="Contact Info" isRequired><div className="space-y-4"><input name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} type="email" className="block w-full px-4 py-3 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm" /><textarea name="additionalContactDetails" value={formData.additionalContactDetails} onChange={handleInputChange} rows={3} className="block w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-dashed border-[var(--border-secondary)] rounded-lg text-xs" /></div></FormRow>
                </FormSection>

                <div className="pt-8 border-t border-[var(--border-primary)] flex justify-end gap-4">
                    <Link to={`/asset/${assetId}`} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--background-tertiary)] rounded-full border border-[var(--border-primary)]">Cancel</Link>
                    <button type="submit" disabled={isLoading} className="button-gradient px-12 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-none hover:scale-105 active:scale-95 transition-all">Update Asset</button>
                </div>
            </form>
        </div>
    );
};

export default EditAssetPage;