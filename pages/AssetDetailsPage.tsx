// src/pages/AssetDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ChevronLeftIcon, AppContextLinkIcon } from '../constants';
import { User } from '../types'; 

// --- Icons Components ---
const ChartBarIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 0 1 6.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 0 1 5.25 0z" />
    </svg>
);

const UserGroupIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 0 1 4.5 0z" />
    </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);

const BoltIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const ArrowPathIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const UserCircleIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
);

const AssetDetailsPage: React.FC = () => {
    const { assetId } = useParams<{ assetId: string }>();
    
    // NOTE: Added fetchUserProfile from context
    const { getIdeaById, getUserById, currentUser, fetchUserProfile , sendConnectionRequest, isRequestPending,isUserConnected  } = useAppContext();
    
    const navigate = useNavigate();
    const location = useLocation();

    // NOTE: Added State for Founder to handle Async Fetching
    const [founder, setFounder] = useState<User | undefined>(undefined);
    const [isLoadingFounder, setIsLoadingFounder] = useState(false);
    
    useEffect(() => {
        if (location.hash === '#contact') {
            const el = document.getElementById('contact');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.hash]);

    const asset = assetId ? getIdeaById(assetId) : undefined;

    // NOTE: New Logic to Load Founder from API if not found locally
    useEffect(() => {
        const loadFounder = async () => {
            if (!asset || !asset.founderId) return;

            // 1. Try Local Context
            const localUser = getUserById(asset.founderId);
            if (localUser) {
                setFounder(localUser);
                return;
            }

            // 2. Try Backend API
            setIsLoadingFounder(true);
            try {
                const apiUser = await fetchUserProfile(asset.founderId);
                if (apiUser) {
                    setFounder(apiUser);
                }
            } catch (e) {
                console.error("Failed to load founder details");
            } finally {
                setIsLoadingFounder(false);
            }
        };
        loadFounder();
    }, [asset, assetId, getUserById, fetchUserProfile]);


    if (!asset) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <h1 className="text-2xl font-black uppercase text-[var(--text-primary)]">Asset Not Found</h1>
                <button onClick={() => navigate('/blueprint')} className="mt-4 button-gradient text-white px-8 py-2 rounded-full font-bold">Return to Shop</button>
            </div>
        );
    }

    const isOwner = currentUser?.id === asset.founderId;

    const MetaBadge: React.FC<{ label: string; value: string }> = ({ label, value }) => (
        <div className="flex flex-col bg-neutral-100 dark:bg-neutral-800/50 px-3 py-1.5 rounded-xl border border-[var(--border-primary)] shadow-sm">
            <span className="text-[7px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1">{label}</span>
            <span className="text-[10px] font-bold text-[var(--text-primary)] leading-none">{value}</span>
        </div>
    );

    const MetricBox: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
        <div className="bg-[var(--background-tertiary)] p-3 rounded-2xl border border-[var(--border-primary)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center text-purple-600 shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-[7px] font-black text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-xs font-bold text-[var(--text-primary)] leading-none">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="bg-[var(--background-secondary)] min-h-screen py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-8 inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] px-5 py-2.5 rounded-full border border-[var(--border-primary)] shadow-sm transition-all"
                >
                    <ChevronLeftIcon className="w-3 h-3" />
                    <span>Back</span>
                </button>

                <div className="bg-[var(--component-background)] border border-[var(--border-primary)] rounded-[2.5rem] relative overflow-hidden shadow-sm">
                    
                    {/* HEADER SECTION - REFINED EFFECT */}
                    <div className="p-8 sm:p-10 border-b border-[var(--border-primary)] flex flex-col md:flex-row items-center gap-8 relative z-10 bg-white dark:bg-neutral-950/40 overflow-hidden">
                        {/* Background Effect Layers */}
                        <div className="absolute inset-0 dot-pattern-bg opacity-[0.04] pointer-events-none"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
                        
                        <div className="relative group">
                            {/* Refined Glow Effect */}
                            <div className="absolute -inset-6 bg-gradient-to-tr from-red-500/10 to-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white dark:border-neutral-800 shadow-2xl flex-shrink-0 relative z-10">
                                <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="text-center md:text-left flex-grow relative z-10">
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <h1 className="text-3xl sm:text-4xl font-startives-brand tracking-tighter text-[var(--text-primary)] leading-none">{asset.title}</h1>
                                {isOwner && (
                                    <Link to={`/asset/${asset.id}/edit`} className="px-4 py-1.5 rounded-full bg-[var(--background-tertiary)] text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-orange-500 border border-[var(--border-primary)] transition-all">
                                        Edit Asset
                                    </Link>
                                )}
                            </div>

                            <p className="text-lg text-[var(--text-secondary)] font-medium mt-1.5 italic opacity-80">
                                {asset.tagline}
                            </p>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-5">
                                <MetaBadge label="Category" value={asset.category || 'Venture'} />
                                <MetaBadge label="Model" value={asset.businessModel || "SaaS"} />
                                <MetaBadge label="Monetization" value={asset.revenueModel || "Subscription"} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 relative z-10">
                        
                        {/* LEFT PANEL */}
                        <div className="lg:col-span-1 border-r border-[var(--border-primary)] bg-neutral-50/50 dark:bg-neutral-900/30 p-8 space-y-8">
                            <section>
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 pb-2 border-b border-[var(--border-primary)]">Authority</h3>
                                <div className="space-y-4">
                                    {/* UPDATED FOUNDER UI HANDLER */}
                                    {isLoadingFounder ? (
                                        <div className="flex items-center gap-3 animate-pulse">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        </div>
                                    ) : (
                                        <Link to={`/user/${asset.founderId}`} className="flex items-center gap-3 group bg-white dark:bg-neutral-800 p-3 rounded-2xl border border-[var(--border-primary)] shadow-sm">
                                            <img src={founder?.profilePictureUrl || "https://www.gravatar.com/avatar/?d=mp"} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/10" />
                                            <div>
                                                <p className="text-sm font-black text-[var(--text-primary)] group-hover:text-purple-600 transition-colors">{founder?.name || asset.founderName || "Unknown Innovator"}</p>
                                                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Founder & Seller</p>
                                            </div>
                                        </Link>
                                    )}
                                    
                                    {founder?.bio && (
                                        <div className="relative">
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
                                            <p className="text-xs text-[var(--text-secondary)] italic pl-3 leading-relaxed line-clamp-4">
                                                {founder.bio}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 pb-2 border-b border-[var(--border-primary)]">Team Profile</h3>
                                <div className="space-y-4">
                                    <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-[var(--border-primary)] shadow-sm flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center text-sky-600">
                                            <UserGroupIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-[var(--text-primary)]">{asset.teamSize ? `${asset.teamSize} Core Members` : '1-5 Core Members'}</p>
                                            <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Active Team Size</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-[var(--border-primary)]">
                                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed italic font-medium">
                                            {asset.teamDetails || "The team consists of the original founders who have managed all aspects from development to initial growth. They are prepared to facilitate a smooth transition."}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 pb-2 border-b border-[var(--border-primary)]">Site Age</h3>
                                <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-[var(--border-primary)] shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
                                        <CalendarIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-[var(--text-primary)] uppercase">{asset.siteAge || "2 Years, 4 Months"}</p>
                                        <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Since Domain Registry</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 pb-2 border-b border-[var(--border-primary)]">Official Asset Summary</h3>
                                <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-[var(--border-primary)] shadow-sm">
                                    <p className="text-xs font-medium leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap">{asset.description}</p>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 pb-2 border-b border-[var(--border-primary)]">Built With</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {(asset.techStack || ['React', 'Node', 'AWS']).map(t => (
                                        <span key={t} className="px-2.5 py-1 bg-white dark:bg-neutral-800 rounded-lg text-[8px] font-black uppercase border border-[var(--border-primary)] shadow-sm">{t}</span>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 pb-2 border-b border-[var(--border-primary)]">Product Link</h3>
                                {asset.websiteUrl ? (
                                    <a 
                                        href={asset.websiteUrl.startsWith('http') ? asset.websiteUrl : `https://${asset.websiteUrl}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg transition-all group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <AppContextLinkIcon className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-widest">Visit Asset</span>
                                        </div>
                                        <ChevronLeftIcon className="w-3 h-3 rotate-180 opacity-50 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                ) : (
                                    <p className="text-xs text-[var(--text-muted)] italic">No public URL available.</p>
                                )}
                            </section>
                        </div>

                        {/* RIGHT PANEL */}
                        <div className="lg:col-span-2 p-8 sm:p-10 space-y-12">
                            
                            {/* GALLERY */}
                            <section className="space-y-4">
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] px-2">Gallery</h3>
                                <div className="relative group overflow-hidden rounded-xl border-2 border-[var(--border-primary)] shadow-none">
                                    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing">
                                        {[asset.imageUrl, `https://picsum.photos/seed/${asset.id}-1/1600/900`, `https://picsum.photos/seed/${asset.id}-2/1600/900`].map((imgUrl, idx) => (
                                            <div key={idx} className="flex-shrink-0 w-full aspect-[16/9] snap-center">
                                                <img 
                                                    src={imgUrl} 
                                                    className="w-full h-full object-cover" 
                                                    alt={`View ${idx + 1}`} 
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* PERFORMANCE SECTION */}
                            <section className="space-y-4">
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] px-2">Performance</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-neutral-900 border border-[var(--border-primary)] p-6 rounded-[2rem] space-y-4">
                                        <h4 className="text-[8px] font-black uppercase text-purple-600 tracking-[0.2em] border-b border-[var(--border-primary)] pb-2">Traffic & Growth</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <MetricBox label="Monthly Users" value={asset.users || "1.2k"} icon={<UsersIcon />} />
                                            <MetricBox label="Active Growth" value={asset.growth || "N/A"} icon={<ChartBarIcon />} />
                                            <MetricBox label="Direct Traffic" value={asset.directTraffic || "45%"} icon={<BoltIcon />} />
                                            <MetricBox label="Retention" value={asset.retention || "62%"} icon={<ArrowPathIcon />} />
                                        </div>
                                        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed italic">
                                            {asset.trafficDetails || "Organic search traffic accounts for 85% of acquisition, showing strong SEO stability."}
                                        </p>
                                    </div>

                                    <div className="bg-white dark:bg-neutral-900 border border-[var(--border-primary)] p-6 rounded-[2rem] space-y-4">
                                        <h4 className="text-[8px] font-black uppercase text-emerald-600 tracking-[0.2em] border-b border-[var(--border-primary)] pb-2">Seller Notes</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-50 mt-1"></div>
                                                <p className="text-[11px] font-bold text-[var(--text-primary)] leading-tight">Handover: {asset.handoverNotes || "Includes 30 days of technical support."}</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-50 mt-1"></div>
                                                <p className="text-[11px] font-bold text-[var(--text-primary)] leading-tight">Reason for sale: {asset.reasonForSale || "Focusing on new AI projects."}</p>
                                            </div>
                                            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed font-medium">
                                                "{asset.sellerInsightsDetails || "This project has been highly optimized for low overhead. It's ready for a marketing-focused owner to scale."}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* COMPETITOR INFO */}
                            <section className="space-y-4">
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] px-2">Competitive Analysis</h3>
                                <div className="bg-white dark:bg-neutral-900 border border-[var(--border-primary)] p-8 rounded-[2rem] flex items-start gap-5 transition-all">
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                                        {asset.competitorInfo || "The project occupies a unique niche with high barriers to entry. Main competition includes larger legacy players, but our agile approach and specialized AI stack provide a 2.5x speed advantage."}
                                    </p>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] px-2">Financial Identity</h3>
                                <div className="bg-white dark:bg-neutral-900 border-2 border-[var(--border-primary)] rounded-[2.5rem] p-8 relative overflow-hidden mt-4">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-24 -mt-24 pointer-events-none"></div>
                                    
                                    <div className="mb-8">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">Asking Price</h3>
                                        <p className="text-6xl font-black tracking-tighter italic leading-none text-[var(--text-primary)]">{asset.askingPrice || "$35,000"}</p>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div className="bg-[var(--background-secondary)] p-4 rounded-2xl border border-[var(--border-primary)] flex flex-col justify-center text-center">
                                            <p className="text-[8px] font-black uppercase text-[var(--text-muted)] mb-1">Multiplier</p>
                                            <p className="text-lg font-black text-purple-600">{asset.multiplier || "7x"}</p>
                                        </div>
                                        <div className="bg-[var(--background-secondary)] p-4 rounded-2xl border border-[var(--border-primary)] flex flex-col justify-center text-center">
                                            <p className="text-[8px] font-black uppercase text-[var(--text-muted)] mb-1">TTM Revenue</p>
                                            <p className="text-lg font-black text-[var(--text-primary)]">{asset.ttmRevenue || "$5k"}</p>
                                        </div>
                                        <div className="bg-[var(--background-secondary)] p-4 rounded-2xl border border-[var(--border-primary)] flex flex-col justify-center text-center">
                                            <p className="text-[8px] font-black uppercase text-[var(--text-muted)] mb-1">Monthly Earnings</p>
                                            <p className="text-lg font-black text-[var(--text-primary)]">{asset.mrr || "$450"}</p>
                                        </div>
                                        <div className="bg-sky-50 dark:bg-sky-950/30 p-4 rounded-2xl border border-sky-100 dark:border-sky-500/20 flex flex-col justify-center text-center">
                                            <p className="text-[8px] font-black uppercase text-sky-600 dark:text-sky-400 mb-1">Growth Pulse</p>
                                            <p className="text-lg font-black text-sky-500">{asset.growthPulse || asset.growth || "+22%"}</p>
                                        </div>
                                        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 flex flex-col justify-center text-center">
                                            <p className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 mb-1">Net Profit</p>
                                            <p className="text-lg font-black text-emerald-500">{asset.netProfit || "82%"}</p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-2xl border border-purple-100 dark:border-purple-500/20 flex flex-col justify-center text-center">
                                            <p className="text-[8px] font-black uppercase text-purple-600 dark:text-purple-400 mb-1">Churn Rate</p>
                                            <p className="text-lg font-black text-purple-500">{asset.churnRate || "2.4%"}</p>
                                        </div>
                                    </div>

                                    <p className="text-[8px] font-medium text-[var(--text-muted)] mt-6 text-center">
                                        <span className="text-amber-500 font-bold">Note: </span>
                                        Asking price based on current TTM revenue and growth indicators (Author-Reported).
                                    </p>
                                </div>
                            </section>

                            {/* PAYMENT METHOD */}
                            <section className="space-y-4">
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] px-2 pb-2 border-b border-[var(--border-primary)]">Payment Method</h3>
                                <div className="backdrop-blur-md bg-emerald-50/80 dark:bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 flex items-start gap-5 transition-all hover:bg-emerald-100/80 dark:hover:bg-emerald-500/15">
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                                        {asset.paymentMethods || "We prefer secure transactions via Escrow.com or Direct Bank Transfer. For verified listings, we can also facilitate payments through Stripe Secure Checkout. All funds are held in a safe account until the digital assets are fully handed over to the new owner."}
                                    </p>
                                </div>
                            </section>

                        {/* CONTACT INFO SECTION */}
<section id="contact" className="space-y-4 pb-10">
    <h3 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] px-2 pb-2 border-b border-[var(--border-primary)]">Contact Info</h3>
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-[var(--border-primary)] shadow-sm">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
            Interested in this asset? Connect with the author directly for due diligence or negotiation.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-grow p-4 bg-[var(--background-tertiary)] rounded-xl border border-[var(--border-primary)] w-full">
                <p className="text-xs font-bold text-[var(--text-primary)]">Author Email:</p>
                <p className="text-sm font-semibold text-purple-600 mt-1">{asset.contactEmail || asset.founderEmail}</p>
            </div>

            {/* --- CONNECT BUTTON LOGIC START --- */}
            {currentUser?.id === asset.founderId ? (
                // 1. Agar ye MERI profile hai
                <button disabled className="flex-shrink-0 px-6 py-3 rounded-full bg-gray-200 text-gray-400 text-xs font-black uppercase tracking-widest cursor-not-allowed">
                    You Own This
                </button>
            ) : isUserConnected(asset.founderId) ? (
                // 2. Agar hum PEHLE SE Connected hain
                <button className="flex-shrink-0 px-6 py-3 rounded-full bg-green-500 text-white text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                    <span className="text-lg">✓</span> Connected
                </button>
            ) : isRequestPending(asset.founderId) ? (
                // 3. Agar Request PENDING hai
                <button disabled className="flex-shrink-0 px-6 py-3 rounded-full bg-amber-100 text-amber-600 border border-amber-200 text-xs font-black uppercase tracking-widest cursor-wait">
                    Request Sent...
                </button>
            ) : (
                // 4. Agar Connect KARNA hai (Normal State)
                <button 
                    onClick={() => sendConnectionRequest(asset.founderId)}
                    className="flex-shrink-0 px-6 py-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <UserCircleIcon className="w-4 h-4" />
                    Connect +
                </button>
            )}
            {/* --- CONNECT BUTTON LOGIC END --- */}

        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-4 italic font-medium">
            {asset.additionalContactDetails || "You may also request additional contact options like Slack, Discord, or LinkedIn manually during initial outreach."}
        </p>
    </div>
</section>
                        </div>
                    </div>

                    {/* DISCLAIMER */}
                    <div className="bg-[var(--background-tertiary)] dark:bg-black/20 p-8 border-t border-[var(--border-primary)]">
                        <div className="max-w-4xl mx-auto flex items-start gap-5 opacity-80">
                            <div className="flex-shrink-0 mt-1">
                                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                                <strong>Legal Registry Note:</strong> Asset Shop (powered by Startives) is an introduction marketplace only. We do not audit, verify, or warrant the accuracy of any financial metrics, user numbers, or technical claims made by the author. Buyers are legally responsible for conducting their own technical, financial, and legal audits before initiating a transaction. Startives bears no liability for discrepancies in author-vetted data or subsequent transaction outcomes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetDetailsPage;