import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { StartupIdea, StartupCategory } from '../types';
import { BookmarkIcon, STARTUP_CATEGORIES, MagnifyingGlassIcon as SearchIcon, COUNTRIES } from '../constants';

// --- Icons ---
const CurrencyDollarIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChartBarIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const ChevronDownIconUI: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
);

const GrowthIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
);

const TagIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
);

const MapPinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
);

// --- Custom Dropdown Component ---
interface CustomDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon: React.ReactNode;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, value, onChange, options, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-full transition-all duration-300 border shadow-none ${isOpen ? 'bg-white dark:bg-neutral-800 border-purple-500' : 'bg-gray-100 dark:bg-neutral-800 border-transparent hover:border-purple-500/50'} text-[var(--text-primary)] focus:outline-none min-w-[100px] font-poppins`}>
        <span className="flex-shrink-0 text-purple-600 dark:text-purple-400">{icon}</span>
        <span className="truncate max-w-[80px] font-poppins">{selectedOption && selectedOption.value !== 'All' ? selectedOption.label : label}</span>
        <ChevronDownIconUI className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 max-h-80 bg-[var(--component-background)] backdrop-blur-xl border border-[var(--border-primary)] rounded-2xl shadow-2xl z-[100] overflow-hidden slide-in-from-top animate-[slide-in-from-top_0.2s_ease-out] font-poppins">
          <div className="overflow-y-auto max-h-80 p-2 custom-scrollable">
            {options.map((option) => (
              <button key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); }} className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all duration-200 flex items-center justify-between group ${value === option.value ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold' : 'text-[var(--text-secondary)] hover:bg-[var(--component-background-hover)] hover:text-[var(--text-primary)]'}`}>
                <span className="truncate">{option.label}</span>
                {value === option.value && <CheckIcon className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ExchangeCard: React.FC<{ idea: StartupIdea }> = ({ idea }) => {
  const { isProjectSaved, saveProject, unsaveProject, currentUser } = useAppContext();
  const isSaved = isProjectSaved(idea.id);
  const navigate = useNavigate();

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    isSaved ? unsaveProject(idea.id) : saveProject(idea.id);
  };

  return (
    <div className="bg-[var(--component-background)] rounded-3xl border border-[var(--border-primary)] overflow-hidden group flex flex-col h-full hover:border-emerald-500/50 transition-all duration-300 shadow-none font-poppins">
      <div className="relative h-44 overflow-hidden bg-neutral-950">
        <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4 flex gap-2"><span className="bg-emerald-600/30 backdrop-blur-xl border border-emerald-500/30 text-emerald-100 text-[9px] font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-full flex items-center gap-1.5">{idea.category || 'SaaS'}</span></div>
        <button onClick={handleSave} className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-xl transition-all duration-300 border ${isSaved ? 'bg-red-500 border-red-400 text-white' : 'bg-black/40 border-white/20 text-white hover:bg-black/60'}`}><BookmarkIcon className="w-4 h-4" solid={isSaved} /></button>
        <div className="absolute bottom-4 left-6 right-6 text-white text-left"><h2 className="text-2xl font-bold tracking-tight leading-none uppercase">{idea.title}</h2><p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-widest">{idea.businessModel} • {idea.location}</p></div>
      </div>
      <div className="p-6 flex flex-col flex-grow space-y-5">
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--background-secondary)] p-3 rounded-2xl border border-[var(--border-primary)] flex flex-col justify-center text-center shadow-none"><span className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-1 text-center">Asking price</span><span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{idea.askingPrice || "$TBD"}</span></div>
            <div className="bg-[var(--background-secondary)] p-3 rounded-2xl border border-[var(--border-primary)] flex flex-col justify-center text-center shadow-none"><span className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest mb-1 text-center">Multiplier</span><span className="text-lg font-black text-purple-500">{idea.multiplier || "N/A"}</span></div>
        </div>
        <div className="flex items-center justify-between px-2 text-[10px] font-bold text-[var(--text-secondary)] border-b border-[var(--border-primary)] pb-3"><div className="flex items-center gap-1.5"><CurrencyDollarIcon className="w-3.5 h-3.5 text-emerald-500" /><span>TTM Revenue: <span className="text-[var(--text-primary)]">{idea.ttmRevenue || "N/A"}</span></span></div><div className="flex items-center gap-1.5"><ChartBarIcon className="w-3.5 h-3.5 text-blue-500" /><span>Monthly: <span className="text-[var(--text-primary)]">{idea.mrr || "TBD"}</span></span></div></div>
        <p className="text-xs text-[var(--text-secondary)] text-left leading-relaxed line-clamp-4 font-medium flex-grow italic opacity-80">{idea.description}</p>
        <div className="pt-2 flex gap-3 mt-auto"><button onClick={() => navigate(`/asset/${idea.id}`)} className="flex-1 py-3 rounded-full bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] text-[10px] font-black uppercase tracking-widest transition-all border border-[var(--border-primary)] shadow-none">View asset</button><button onClick={() => navigate(`/asset/${idea.id}#contact`)} className="flex-1 py-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest shadow-none hover:scale-105 transition-all">Contact</button></div>
      </div>
    </div>
  );
};

const StartupStoriesPage: React.FC = () => {
  const { startupIdeas } = useAppContext();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activePricing, setActivePricing] = useState<string>('All');
  const [activeLocation, setActiveLocation] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const pricingOptions = ['All', 'Under $10k', '$10k - $50k', '$50k - $100k', '$100k+'];
  const filteredIdeas = useMemo(() => {
    let list = startupIdeas.filter(idea => idea.askingPrice);
    if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        list = list.filter(idea => idea.title.toLowerCase().includes(lowerSearch) || idea.description.toLowerCase().includes(lowerSearch));
    }
    if (activeCategory !== 'All') list = list.filter(idea => idea.category === activeCategory);
    if (activeLocation !== 'All') list = list.filter(idea => idea.location?.includes(activeLocation));
    if (activePricing !== 'All') {
        list = list.filter(idea => {
            const price = parseInt(idea.askingPrice?.replace(/[^0-9]/g, '') || '0');
            if (activePricing === 'Under $10k') return price < 10000;
            if (activePricing === '$10k - $50k') return price >= 10000 && price <= 50000;
            if (activePricing === '$50k - $100k') return price > 50000 && price <= 100000;
            return price > 100000;
        });
    }
    return list.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [startupIdeas, activeCategory, activePricing, activeLocation, searchTerm]);

  return (
    <div className="bg-[var(--background-secondary)] min-h-screen flex flex-col font-poppins">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-4xl font-startives-brand tracking-tighter text-[var(--text-primary)] leading-tight">Asset Shop</h1>
                    <p className="text-lg text-[var(--text-secondary)] font-medium mt-1">Founders selling to founders.</p>
                </div>
                <div className="flex items-center justify-center gap-6 button-gradient text-white px-6 py-2.5 rounded-full border border-white/10 shadow-none overflow-hidden relative">
                    <div className="flex items-center gap-2 relative z-10"><p className="text-[8px] font-black uppercase text-white/70 tracking-widest">Market Volume</p><p className="text-sm font-black">$1.4M</p></div>
                    <div className="w-px h-4 bg-white/20 relative z-10"></div>
                    <div className="flex items-center gap-2 relative z-10"><p className="text-[8px] font-black uppercase text-white/70 tracking-widest">Active Assets</p><p className="text-sm font-black">{filteredIdeas.length}</p></div>
                </div>
            </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex justify-center"><div className="relative group max-w-2xl w-full"><div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><SearchIcon className="h-5 w-5 text-[var(--text-muted)]" /></div><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search digital assets..." className="block w-full pl-12 pr-6 py-4 bg-[var(--component-background)] border border-[var(--border-primary)] rounded-full shadow-none focus:border-emerald-500 outline-none transition-all text-base font-medium font-poppins" /></div></div>
        <div className="bg-[var(--background-secondary)] border-b border-[var(--border-primary)] font-poppins"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-center gap-3"><CustomDropdown label="All categories" value={activeCategory} options={['All', ...STARTUP_CATEGORIES].map(c => ({value: c, label: c}))} onChange={setActiveCategory} icon={<TagIcon className="w-4 h-4" />} /><CustomDropdown label="All pricing" value={activePricing} options={pricingOptions.map(p => ({value: p, label: p}))} onChange={setActivePricing} icon={<GrowthIcon className="w-4 h-4" />} /><CustomDropdown label="All locations" value={activeLocation} options={['All', ...COUNTRIES.map(c => c.name)].map(l => ({value: l, label: l}))} onChange={setActiveLocation} icon={<MapPinIcon className="w-4 h-4" />} /></div></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">{filteredIdeas.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{filteredIdeas.map(idea => <ExchangeCard key={idea.id} idea={idea} />)}</div> : <div className="text-center py-20 bg-[var(--component-background)] rounded-3xl border-2 border-dashed border-[var(--border-primary)] shadow-none"><p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-sm font-poppins">No assets found matching filters</p><button onClick={() => { setActiveCategory('All'); setActivePricing('All'); setActiveLocation('All'); setSearchTerm(''); }} className="mt-4 text-purple-600 font-bold uppercase text-[10px] hover:underline font-poppins">Clear all filters</button></div>}</div>
    </div>
  );
};

export default StartupStoriesPage;