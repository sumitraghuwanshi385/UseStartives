import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ClipboardDocumentListIcon, UserCircleIcon, ChevronLeftIcon, AppContextLinkIcon, IdentificationIcon, BookmarkIcon, PencilSquareIcon } from '../constants';
import { StartupIdea } from '../types';

// --- Icons ---
const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
);
const ClockIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const TagIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

const getInitials = (name?: string): string => {
    if (!name || name.trim() === '') return '?';
    const parts = name.match(/\b\w/g) || [];
    return (parts.map(part => part.toUpperCase()).join('') || '?').substring(0, 2);
};

// --- Helper Components ---
interface DetailSectionProps {
  title: string;
  icon: React.ReactElement<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}
const DetailSection: React.FC<DetailSectionProps> = ({ title, icon, children, className=""}) => (
    <div className={`bg-[var(--component-background)] p-6 rounded-xl border border-[var(--border-primary)] ${className}`}>
        <div className="flex items-center text-[var(--text-primary)] mb-4">
            <div className="w-8 h-8 rounded-full icon-bg-gradient flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                {React.cloneElement(icon, { className: "w-4 h-4 text-white" })}
            </div>
            <h2 className="text-xl font-semibold uppercase tracking-tight">{title}</h2>
        </div>
        {children}
    </div>
);

const IdeaDetailPage: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const { 
  getIdeaById, 
  currentUser, 
  isProjectSaved, 
  saveProject, 
  unsaveProject, 
  getUserById,
  sendConnectionRequest,
  isUserConnected,
  isRequestPending
} = useAppContext();
  const navigate = useNavigate();

  const idea = ideaId ? getIdeaById(ideaId) : undefined;
  const founder = idea?.founderId 
  ? getUserById(idea.founderId.toString(), 'id') 
  : undefined;

  if (!idea) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-[var(--accent-danger-text)] mb-4">Idea Not Found</h1>
        <Link to="/projects" className="button-gradient inline-flex items-center text-white font-semibold py-2.5 px-6 rounded-lg">Back to Projects</Link>
      </div>
    );
  }
  
  const isOwner = currentUser?.id === idea.founderId;
  const isSaved = isProjectSaved(idea.id);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) { navigate('/login'); return; }
    isSaved ? unsaveProject(idea.id) : saveProject(idea.id);
  };
  
  return (
    <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 group rounded-full px-5 py-2.5 bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] border border-[var(--border-primary)]">
            <ChevronLeftIcon className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            <span>Back to Projects</span>
        </button>

      <section className="bg-[var(--component-background)] rounded-[2.5rem] border border-[var(--border-primary)] relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 dot-pattern-bg opacity-[0.04] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 sm:p-10 relative z-10">
            <div className="flex-shrink-0 w-32 h-32 md:w-36 md:h-36 rounded-[2rem] overflow-hidden bg-gray-200 dark:bg-neutral-800 border-4 border-white dark:border-neutral-800 shadow-2xl group relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-red-500/10 to-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover relative z-10" />
            </div>
            <div className="flex-grow text-center md:text-left pt-2">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-startives-brand text-[var(--text-primary)] tracking-tighter leading-none">{idea.title}</h1>
                        <p className="mt-2 text-lg text-[var(--text-secondary)] font-medium italic opacity-80">{idea.tagline}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        {idea.websiteUrl && (
                            <a 
                                href={idea.websiteUrl.startsWith('http') ? idea.websiteUrl : `https://${idea.websiteUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-widest rounded-full border border-purple-200 dark:border-purple-500/30 hover:shadow-lg transition-all"
                            >
                                <AppContextLinkIcon className="w-4 h-4" />
                                Visit Project
                            </a>
                        )}
                        {isOwner ? (
                            <Link to={`/project/${idea.id}/edit`} className="bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] text-[var(--text-secondary)] font-bold py-2 px-5 rounded-full text-[10px] uppercase tracking-widest transition-colors border border-[var(--border-primary)] flex items-center justify-center space-x-2">
                                <PencilSquareIcon className="w-4 h-4"/>
                                <span>Edit</span>
                            </Link>
                        ) : (
                            <button onClick={handleSaveToggle} className={`flex items-center justify-center space-x-2 font-bold py-2 px-5 rounded-full text-[10px] uppercase tracking-widest transition-colors border ${isSaved ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30' : 'bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] text-[var(--text-secondary)] border border-[var(--border-primary)]'}`}>
                                <BookmarkIcon className="w-4 h-4" solid={isSaved} />
                                <span>{isSaved ? 'Saved' : 'Save'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <DetailSection title="About Project" icon={<InformationCircleIcon />}>
                <div className="space-y-8">
                  <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-sm sm:text-base font-medium opacity-90">{idea.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[var(--border-primary)] pt-8">
                      <div className="bg-red-50/50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/30 space-y-3">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400 flex items-center gap-2">
                              <span className="w-4 h-px bg-red-600/30"></span> The Problem
                          </h3>
                          <p className="text-sm font-semibold text-[var(--text-primary)] leading-relaxed">
                              {idea.problem || "The market currently lacks a streamlined way for innovators to synchronize their vision with the right builders."}
                          </p>
                      </div>
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 space-y-3">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                              <span className="w-4 h-px bg-emerald-600/30"></span> The Solution
                          </h3>
                          <p className="text-sm font-semibold text-[var(--text-primary)] leading-relaxed italic">
                              {idea.buildingNow || "A decentralized collaborative ecosystem that bridges the gap between raw talent and high-impact ideas."}
                          </p>
                      </div>
                  </div>
                </div>
            </DetailSection>
        </div>
        <div className="lg:col-span-1 space-y-8 sticky top-24">
             <DetailSection title="Founder" icon={<UserCircleIcon />}>
                {founder ? (
                    <div className="space-y-4">
                        <Link to={`/user/${founder.id}`} className="flex items-center space-x-3 group">
                            <img src={founder.profilePictureUrl || `https://i.pravatar.cc/150?u=${founder.id}`} alt={founder.name} className="w-12 h-12 rounded-full object-cover border-2 border-[var(--border-secondary)] group-hover:border-purple-500 transition-colors" />
                            <div>
                                <p className="font-bold text-[var(--text-primary)] group-hover:text-purple-600 transition-colors">{founder.name}</p>
                                <p className="text-xs text-[var(--text-muted)] font-medium line-clamp-1">{founder.headline}</p>
                            </div>
                        </Link>
                        {founder.bio && (
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
                                <p className="text-xs text-[var(--text-secondary)] italic pl-3 leading-relaxed line-clamp-4">
                                    {founder.bio}
                                </p>
                            </div>
                        )}

{currentUser && currentUser.id !== founder.id && (
  <div className="pt-3">
    {isUserConnected(founder.id) ? (
      <button className="w-full bg-green-100 text-green-700 text-xs font-bold py-2 rounded-full border border-green-200">
        Connected
      </button>
    ) : isRequestPending(founder.id) ? (
      <button className="w-full bg-yellow-100 text-yellow-700 text-xs font-bold py-2 rounded-full border border-yellow-200">
        Request Sent
      </button>
    ) : (
      <button
        onClick={() => sendConnectionRequest(founder.id)}
        className="w-full button-gradient text-white text-xs font-bold py-2 rounded-full hover:scale-105 transition-all"
      >
        Connect
      </button>
    )}
  </div>
)}

                    </div>
                ) : <p className="text-sm text-[var(--text-muted)]">{idea.founderName}</p>}
            </DetailSection>

            <DetailSection title="Quick Stats" icon={<ClipboardDocumentListIcon />}>
                 <ul className="text-sm text-[var(--text-secondary)] font-medium space-y-4">
                     <li className="flex items-center justify-between gap-3 bg-[var(--background-tertiary)] px-3 py-1.5 rounded-lg border border-[var(--border-primary)] shadow-sm">
                         <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Phase</span>
                         <span className="text-[var(--text-primary)] font-bold">{idea.stage}</span>
                     </li>
                     <li className="flex items-center justify-between gap-3 bg-[var(--background-tertiary)] px-3 py-1.5 rounded-lg border border-[var(--border-primary)] shadow-sm">
                         <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Category</span>
                         <span className="text-[var(--text-primary)] font-bold">{idea.category || 'Venture'}</span>
                     </li>
                     <li className="flex items-center justify-between gap-3 bg-[var(--background-tertiary)] px-3 py-1.5 rounded-lg border border-[var(--border-primary)] shadow-sm">
                         <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Model</span>
                         <span className="text-[var(--text-primary)] font-bold">{idea.businessModel || 'N/A'}</span>
                     </li>
                     <li className="flex items-center justify-between gap-3 bg-[var(--background-tertiary)] px-3 py-1.5 rounded-lg border border-[var(--border-primary)] shadow-sm">
                         <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Mode</span>
                         <span className="text-[var(--text-primary)] font-bold">{idea.workMode || 'N/A'}</span>
                     </li>
                     <li className="flex items-center justify-between gap-3 bg-[var(--background-tertiary)] px-3 py-1.5 rounded-lg border border-[var(--border-primary)] shadow-sm">
                         <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Base</span>
                         <span className="text-[var(--text-primary)] font-bold">{idea.location ?? 'Global'}</span>
                     </li>
                     <li className="flex items-center justify-between gap-3 bg-[var(--background-tertiary)] px-3 py-1.5 rounded-lg border border-[var(--border-primary)] shadow-sm">
                         <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Team Size</span>
                         <span className="text-[var(--text-primary)] font-bold">{idea.teamSize ?? 'N/A'}</span>
                     </li>
                     <li className="flex items-center justify-between gap-3 bg-[var(--background-tertiary)] px-3 py-1.5 rounded-lg border border-[var(--border-primary)] shadow-sm">
                         <span className="text-[10px] font-black uppercase text-[var(--text-muted)]">Posted</span>
                         <span className="text-[var(--text-primary)] font-bold">{new Date(idea.postedDate).toLocaleDateString()}</span>
                     </li>
                 </ul>
            </DetailSection>

            {idea.tags && idea.tags.length > 0 && (
              <DetailSection title="Project Tags" icon={<TagIcon />}>
                <div className="flex flex-wrap gap-2">
                  {idea.tags.slice(0, 7).map((tag, idx) => (
                    <span key={idx} className="bg-[var(--background-tertiary)] text-[var(--text-primary)] text-[10px] px-2.5 py-1 rounded-full font-black uppercase border border-[var(--border-primary)] shadow-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </DetailSection>
            )}
        </div>
        <div className="lg:col-span-3">
            <DetailSection title={`Active Openings (${idea.positions.filter(p => p.isOpen).length})`} icon={<IdentificationIcon />}>
                {idea.positions.filter(p => p.isOpen).length > 0 ? (
                <div className="space-y-6">
                    {idea.positions.filter(p => p.isOpen).map(position => (
                    <div key={position.id} className="bg-[var(--component-secondary-background)] p-6 rounded-2xl border border-[var(--border-primary)] group hover:border-purple-500/30 transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{position.title}</h3>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-lg border border-indigo-100 dark:border-indigo-500/30 flex items-center gap-1.5">
                                        <ClockIcon className="w-3 h-3" />
                                        {position.type}
                                    </span>
                                    {position.equityOffered && <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase rounded-lg border border-emerald-100 dark:border-emerald-500/30">Equity: {position.equityOffered}</span>}
                                </div>
                            </div>
                            {currentUser && !isOwner && (
                                <Link to={`/idea/${idea.id}/position/${position.id}/apply`} className="button-gradient inline-flex items-center text-white font-bold py-2 px-6 rounded-full text-xs shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                                    Apply Now
                                </Link>
                            )}
                        </div>
                        <p className="text-[var(--text-secondary)] mb-5 text-sm leading-relaxed whitespace-pre-wrap font-medium">{position.description}</p>
                        {position.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {position.skills.map(skill => (
                                    <span key={skill} className="bg-white dark:bg-neutral-800 text-[var(--text-secondary)] text-[10px] px-3 py-1 rounded-full font-bold border border-[var(--border-secondary)] uppercase tracking-tight shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    ))}
                </div>
                ) : (
                <p className="text-[var(--text-muted)] text-sm italic">No open positions at this time.</p>
                )}
            </DetailSection>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetailPage;
