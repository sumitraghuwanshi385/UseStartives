import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { COUNTRIES } from '../constants';
import FullScreenLoader from './FullScreenLoader';

// --- Icons (Memoized for performance) ---
const MemoizedUserCircleIcon: React.FC<{ className?: string }> = React.memo(({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>
));
const MemoizedAcademicCapIcon: React.FC<{ className?: string }> = React.memo(({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
));
const MemoizedCameraIcon: React.FC<{ className?: string }> = React.memo(({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
));
const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CustomCountrySelect: React.FC<{ 
    value: string; 
    onChange: (val: string) => void;
}> = ({ value, onChange }) => {
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
        className="w-full flex items-center justify-between px-3.5 py-2 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg shadow-inner text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium h-10"
      >
        <span>{value || 'Select Country'}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      {isOpen && (
        <div className="absolute z-[1100] w-full mt-1.5 bg-[var(--component-background)] border border-[var(--border-primary)] rounded-lg shadow-2xl overflow-hidden max-h-48 overflow-y-auto custom-scrollable">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => { onChange(c.name); setIsOpen(false); }}
              className={`w-full text-left px-3.5 py-2 text-sm transition-colors flex items-center justify-between ${value === c.name ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold' : 'text-[var(--text-secondary)] hover:bg-[var(--component-background-hover)]'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const OnboardingPage: React.FC = () => {
    const { currentUser, updateUser, setShowOnboardingModal } = useAppContext();
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const [name, setName] = useState(currentUser?.name || '');
    const [country, setCountry] = useState(currentUser?.country || '');
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(currentUser?.profilePictureUrl || null);
    const [headline, setHeadline] = useState(currentUser?.headline || '');
    
    const [skills, setSkills] = useState<string[]>(currentUser?.skills || []);
    const [skillInput, setSkillInput] = useState('');
    const [interests, setInterests] = useState<string[]>(currentUser?.interests || []);
    const [interestInput, setInterestInput] = useState('');
    
    const [hearAboutSource, setHearAboutSource] = useState<string | null>(null);

    const premiumSkills = ['Full Stack', 'AI/ML', 'Cloud Architecture', 'Product Strategy', 'Cybersecurity', 'UX Research', 'Go', 'Growth Marketing'];
    const coreInterests = ['FinTech', 'SaaS', 'Web3', 'Sustainability', 'HealthTech', 'Robotics', 'SpaceTech', 'AgriTech'];

    useEffect(() => {
        if(modalRef.current) {
            requestAnimationFrame(() => {
                modalRef.current?.classList.remove('opacity-0');
            });
        }
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleNext = async () => {
        if (step === 1) {
            await updateUser({ name, country, headline, profilePictureUrl: profilePicturePreview || '' });
        }
        setStep(s => s + 1);
    };

    const handleFinish = async () => {
        setIsLoading(true);
        await updateUser({ skills, interests });
        setShowOnboardingModal(false);
    };
    
    const handleTagToggle = (tag: string, type: 'skill' | 'interest') => {
        if (type === 'skill') {
            setSkills(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
        } else {
            setInterests(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
        }
    };

    const onboardingSteps = [
        {
            title: "Welcome to Startives",
            subtitle: "The world's fastest growing community for builders and acquirers.",
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <img src="https://i.postimg.cc/pLTtqf3Q/Picsart-25-09-19-20-29-01-019.png" className="w-24 h-24 drop-shadow-2xl animate-logo-pulse" alt="Startives Logo" />
                    <div className="space-y-2">
                        <h2 className="text-4xl font-extrabold tracking-tighter text-[var(--text-primary)]">The Future Starts Here.</h2>
                        <p className="text-base text-[var(--text-muted)] font-medium max-w-sm mx-auto">Connecting visionaries with strategic talent and capital.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                        {[
                            { label: "Find Co-founders", icon: "🤝" },
                            { label: "Discover Ideas", icon: "💡" },
                            { label: "Asset Exchange", icon: "💎" },
                            { label: "Real-time Chat", icon: "⚡" }
                        ].map((feat, i) => (
                            <div key={feat.label} className="p-4 bg-[var(--background-tertiary)] rounded-2xl border border-[var(--border-primary)] shadow-sm animate-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 100}ms` }}>
                                <span className="text-2xl block mb-1">{feat.icon}</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">{feat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            icon: <MemoizedUserCircleIcon />,
            title: "The Essentials",
            subtitle: "Tell the network who you are.",
            content: (
                <div className="grid md:grid-cols-2 gap-8 items-center h-full">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative w-28 h-28">
                            <div className="w-full h-full icon-bg-gradient rounded-full flex items-center justify-center text-4xl text-white font-bold ring-4 ring-white dark:ring-[var(--component-background)] overflow-hidden shadow-lg">
                                {profilePicturePreview ? (
                                    <img src={profilePicturePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                ) : (
                                    name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || 'U'
                                )}
                            </div>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white shadow-md border-2 border-white dark:border-[var(--component-background)] transition-transform hover:scale-110">
                                <MemoizedCameraIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setProfilePicturePreview(reader.result as string);
                                reader.readAsDataURL(file);
                            }
                        }} className="hidden" />
                    </div>
                    <div className="space-y-4">
                        <div>
                           <label className="block text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Full Name*</label>
                           <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" className="w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg p-2 text-sm text-[var(--text-primary)] h-10" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Country*</label>
                            <CustomCountrySelect value={country} onChange={setCountry} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Headline*</label>
                            <input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Founder @ Stealth" className="w-full bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg p-2 text-sm text-[var(--text-primary)] h-10" />
                        </div>
                    </div>
                </div>
            )
        },
        {
            icon: <MemoizedAcademicCapIcon />,
            title: "Expertise",
            subtitle: "What's in your arsenal?",
            content: (
                 <div className="flex flex-col gap-6 h-full justify-center">
                    <div className="space-y-3">
                        <h3 className="font-bold text-[var(--text-primary)] uppercase text-[10px] tracking-widest">Premium Skills</h3>
                        <div className="bg-[var(--background-tertiary)] p-2 rounded-xl flex flex-wrap gap-2 items-center border border-[var(--border-secondary)] shadow-inner min-h-[60px]">
                            {skills.map(skill => (
                                <div key={skill} className="bg-purple-100 dark:bg-purple-500/50 text-purple-800 dark:text-purple-100 text-[9px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                    {skill}
                                    <button onClick={() => handleTagToggle(skill, 'skill')}><XMarkIcon className="w-3 h-3"/></button>
                                </div>
                            ))}
                            <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={(e) => {
                                if(e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleTagToggle(skillInput.trim(), 'skill'); setSkillInput(''); }
                            }} placeholder="Add manually..." className="flex-grow bg-transparent focus:outline-none text-xs p-1" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {premiumSkills.map(s => (
                                <button key={s} onClick={() => handleTagToggle(s, 'skill')} className={`text-[9px] font-black uppercase tracking-tight px-2.5 py-1 rounded-full border transition-all hover:scale-105 ${skills.includes(s) ? 'bg-purple-600 text-white border-transparent' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/30'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-bold text-[var(--text-primary)] uppercase text-[10px] tracking-widest">Core Interests</h3>
                        <div className="bg-[var(--background-tertiary)] p-2 rounded-xl flex flex-wrap gap-2 items-center border border-[var(--border-secondary)] shadow-inner min-h-[60px]">
                             {interests.map(interest => (
                                <div key={interest} className="bg-sky-100 dark:bg-sky-500/50 text-sky-800 dark:text-sky-100 text-[9px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                    {interest}
                                    <button onClick={() => handleTagToggle(interest, 'interest')}><XMarkIcon className="w-3 h-3"/></button>
                                </div>
                            ))}
                            <input value={interestInput} onChange={e => setInterestInput(e.target.value)} onKeyDown={(e) => {
                                if(e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleTagToggle(interestInput.trim(), 'interest'); setInterestInput(''); }
                            }} placeholder="Add manually..." className="flex-grow bg-transparent focus:outline-none text-xs p-1" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {coreInterests.map(i => (
                                <button key={i} onClick={() => handleTagToggle(i, 'interest')} className={`text-[9px] font-black uppercase tracking-tight px-2.5 py-1 rounded-full border transition-all hover:scale-105 ${interests.includes(i) ? 'bg-sky-600 text-white border-transparent' : 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/30'}`}>{i}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Where did you hear about us?",
            subtitle: "Help us reach more innovators like you.",
            content: (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-xl">
                        {[
                            { name: 'Instagram', icon: '📸' },
                            { name: 'X / Twitter', icon: '𝕏' },
                            { name: 'LinkedIn', icon: '💼' },
                            { name: 'YouTube', icon: '🎥' },
                            { name: 'Facebook', icon: '👥' },
                            { name: 'Other', icon: '🌍' }
                        ].map((src) => (
                            <button
                                key={src.name}
                                type="button"
                                onClick={() => setHearAboutSource(src.name)}
                                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300
                                    ${hearAboutSource === src.name 
                                        ? 'button-gradient border-transparent text-white shadow-xl scale-105' 
                                        : 'bg-[var(--background-tertiary)] border-[var(--border-primary)] text-[var(--text-primary)] hover:border-purple-500/50'}`}
                            >
                                <span className="text-3xl">{src.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">{src.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )
        }
    ];

    const currentStep = onboardingSteps[step];
    const isWelcomeStep = step === 0;

    if (isLoading) return <FullScreenLoader messages={["Syncing your profile...", "Entering the network..."]} />;

    return (
        <div className="fixed inset-0 bg-[var(--background-primary)] z-[1000] flex flex-col items-center justify-center">
            {/* FIX: Removed sm:shadow-2xl for desktop mode as requested */}
            <div ref={modalRef} className="bg-[var(--component-background)] w-full max-w-4xl h-full sm:h-[80vh] flex flex-col transition-opacity duration-500 ease-out opacity-0 sm:rounded-[3rem] sm:border border-[var(--border-primary)] sm:shadow-none relative overflow-hidden">
                <div className="absolute inset-0 dot-pattern-bg opacity-[0.03] pointer-events-none"></div>
                
                {!isWelcomeStep && (
                    <div className="p-8 pb-4 space-y-4 relative z-10">
                        <div className="flex items-center justify-center gap-3">
                            {onboardingSteps.slice(1).map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step - 1 >= i ? 'bg-purple-600 w-12' : 'bg-neutral-200 w-3'}`}></div>
                            ))}
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">{currentStep.title}</h2>
                            <p className="text-sm text-[var(--text-muted)] font-medium">{currentStep.subtitle}</p>
                        </div>
                    </div>
                )}

                <div className="px-10 py-6 overflow-y-auto custom-scrollable flex-grow relative z-10">
                    {currentStep.content}
                </div>

                <div className="p-8 pt-4 bg-[var(--background-tertiary)]/50 border-t border-[var(--border-primary)] rounded-b-[3rem] flex items-center justify-center sm:justify-end gap-3 relative z-10">
                    {step > 0 && (
                        <button onClick={() => setStep(s => s - 1)} className="px-8 py-3.5 text-xs font-black uppercase tracking-widest text-[var(--text-primary)] bg-white dark:bg-neutral-800 rounded-full transition-all border border-[var(--border-secondary)] shadow-sm hover:bg-[var(--component-background-hover)]">Back</button>
                    )}
                    {step < onboardingSteps.length - 1 ? (
                        <button 
                            onClick={handleNext} 
                            disabled={(step === 1 && (!name || !country || !headline)) || (step === 3 && !hearAboutSource)}
                            className="button-gradient px-12 py-3.5 text-xs font-black uppercase tracking-widest text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:saturate-50"
                        >
                            {isWelcomeStep ? "Get Started" : "Next Step"}
                        </button>
                    ) : (
                        <button onClick={handleFinish} className="button-gradient px-12 py-3.5 text-xs font-black uppercase tracking-widest text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all">
                            Complete Setup
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;