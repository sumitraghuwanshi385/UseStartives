import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { StartalkCard } from './StartalksPage';
import { 
    getFlagEmoji, 
    EnvelopeOpenIcon, 
    TwitterXIcon, 
    ChevronLeftIcon, 
    ShoppingBagIcon, 
    GlobeAltIcon, 
    LinkIconHero, 
    UsersIcon,
    IdentificationIcon,
    AcademicCapIcon,
    GithubLogoIcon,
    LinkedInLogoIcon,
    InstagramIcon,
    HeartIcon,
    BoltIcon,
    TrashIcon
} from '../constants';

// --- Local Icons ---
const PencilSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const ProfilePillCard: React.FC<{ 
    title: string; 
    subtitle: string; 
    imageUrl?: string;
    link: string; 
    badge?: string;
    badgeColor?: string;
    onDelete?: () => void;
}> = ({ title, subtitle, imageUrl, link, badge, badgeColor = "bg-purple-100 text-purple-700", onDelete }) => (
    <div className="flex-shrink-0 group relative snap-start">
        <Link 
            to={link}
            className="flex items-center gap-3 px-5 py-3.5 bg-white dark:bg-neutral-900 border border-[var(--border-primary)] rounded-full hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 min-w-[240px] max-w-[320px] shadow-sm"
        >
            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[var(--text-primary)] border border-[var(--border-primary)] group-hover:border-purple-500/30 transition-colors overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <GlobeAltIcon className="w-5 h-5" />
                )}
            </div>
            <div className="overflow-hidden flex-grow">
                <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[var(--text-primary)] truncate">{title}</h4>
                    {badge && <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>}
                </div>
                <p className="text-[10px] font-medium text-[var(--text-muted)] truncate">{subtitle}</p>
            </div>
            <ChevronLeftIcon className="w-3 h-3 rotate-180 text-[var(--text-muted)] opacity-50 group-hover:translate-x-1 transition-transform" />
        </Link>
        {onDelete && (
            <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
                className="absolute -top-1 -right-1 p-1.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 border border-red-200 dark:border-red-800/30 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110 active:scale-95"
                title="Delete Listing"
            >
                <TrashIcon className="w-3 h-3" />
            </button>
        )}
    </div>
);

const ProfilePage: React.FC = () => {
  const { currentUser, startupIdeas, connectedUserIds, startalks, deleteStartalk, deleteIdea } = useAppContext();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login'); 
    return null;
  }
  
  const myProjects = startupIdeas.filter(idea => idea.founderId === currentUser.id && !idea.askingPrice);
  const myAssets = startupIdeas.filter(idea => idea.founderId === currentUser.id && idea.askingPrice);
  const myTalks = startalks.filter(talk => talk.authorId === currentUser.id);

  const initials = currentUser.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || 'P';
  const countryFlag = getFlagEmoji(currentUser.country);

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 group rounded-full px-5 py-2 bg-[var(--background-tertiary)] border border-[var(--border-primary)]">
            <ChevronLeftIcon className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            <span>Dashboard</span>
          </Link>
          {/* ALWAYS SHOW EDIT PROFILE HERE */}
          <Link to="/profile/edit" className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white button-gradient px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all active:scale-100">
            <PencilSquareIcon className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>
      </div>

      {/* PERSONAL HEADER */}
      <section className="bg-white dark:bg-black border border-[var(--border-primary)] rounded-[3rem] p-8 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 dot-pattern-bg opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-red-500/10 to-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-neutral-100 dark:bg-neutral-800 border-4 border-white dark:border-neutral-900 shadow-2xl flex-shrink-0 flex items-center justify-center overflow-hidden relative z-10">
                    {currentUser.profilePictureUrl ? (
                        <img src={currentUser.profilePictureUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-5xl font-black text-neutral-300 dark:text-neutral-700">{initials}</span>
                    )}
                </div>
            </div>

            <div className="flex-grow text-center md:text-left space-y-5 pt-2">
                <div>
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-[var(--text-primary)] leading-none">{currentUser.name}</h1>
                        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded-full border border-[var(--border-primary)]">
                            <span className="text-xl">{countryFlag}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{currentUser.country}</span>
                        </div>
                    </div>
                    <p className="text-xl text-purple-600 dark:text-purple-400 font-medium mt-3 italic">{currentUser.headline || "Innovator & Builder"}</p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <div className="flex items-center gap-2 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-primary)] shadow-sm">
                        <GlobeAltIcon className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Projects</span>
                        <span className="text-xs font-black text-[var(--text-primary)] ml-1">{myProjects.length}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-primary)] shadow-sm">
                        <ShoppingBagIcon className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Assets</span>
                        <span className="text-xs font-black text-[var(--text-primary)] ml-1">{myAssets.length}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-primary)] shadow-sm">
                        <UsersIcon className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Connections</span>
                        <span className="text-xs font-black text-[var(--text-primary)] ml-1">{connectedUserIds.length}</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 border-t border-[var(--border-primary)] pt-5">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium">
                        <EnvelopeOpenIcon className="w-4 h-4 opacity-50 text-purple-500" />
                        <span>{currentUser.email}</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-12">
            {/* BIO SECTION */}
            <div className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <IdentificationIcon className="w-3 h-3" />
                    </div>
                    Bio
                </h3>
                <section className="bg-white dark:bg-neutral-950 p-8 rounded-[2.5rem] border border-[var(--border-primary)] shadow-sm">
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium opacity-90 whitespace-pre-wrap">
                        {currentUser.bio || "No bio provided yet. Every innovator has a story; what is yours?"}
                    </p>
                </section>
            </div>

            {/* MY UPDATES SECTION - Swipable full cards - Shadow removed - Increased width */}
             <section className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <BoltIcon className="w-3 h-3" />
                    </div>
                    My Updates
                </h3>
                {myTalks.length > 0 ? (
                    <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory px-2">
                        {myTalks.map(talk => (
                            <StartalkCard key={talk.id} talk={talk} onDeleteRequest={(id) => deleteStartalk(id)} className="flex-shrink-0 w-[320px] sm:w-[480px] snap-start shadow-none" />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-900/50 rounded-[2.5rem] border-2 border-dashed border-[var(--border-primary)]">
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase italic tracking-widest">No updates posted yet.</p>
                    </div>
                )}
            </section>

            {/* PROJECTS LISTED SECTION - Swipable pills */}
            <section className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <GlobeAltIcon className="w-3 h-3" />
                    </div>
                    Projects Listed
                </h3>
                {myProjects.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory px-2">
                        {myProjects.map(idea => (
                            <ProfilePillCard 
                                key={idea.id}
                                title={idea.title}
                                subtitle={idea.tagline}
                                imageUrl={idea.imageUrl}
                                link={`/idea/${idea.id}`}
                                badge={idea.stage}
                                badgeColor="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                                onDelete={() => deleteIdea(idea.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-900/50 rounded-[2.5rem] border-2 border-dashed border-[var(--border-primary)]">
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase italic tracking-widest">No active ventures to display</p>
                    </div>
                )}
            </section>

            {/* ASSETS LISTED SECTION - Swipable pills */}
             <section className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <ShoppingBagIcon className="w-3 h-3" />
                    </div>
                    Assets Listed
                </h3>
                {myAssets.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory px-2">
                        {myAssets.map(asset => (
                            <ProfilePillCard 
                                key={asset.id}
                                title={asset.title}
                                subtitle={asset.askingPrice || 'Pricing TBD'}
                                imageUrl={asset.imageUrl}
                                link={`/asset/${asset.id}`}
                                badge="Vetted"
                                badgeColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                onDelete={() => deleteIdea(asset.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-900/50 rounded-[2.5rem] border-2 border-dashed border-[var(--border-primary)]">
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase italic tracking-widest">No vetted assets currently listed</p>
                    </div>
                )}
            </section>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1 space-y-10">
            {/* CONNECTIVITY SECTION */}
            <div className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <LinkIconHero className="w-3 h-3" />
                    </div>
                    Connectivity
                </h3>
                <section className="bg-white dark:bg-neutral-950 p-6 rounded-[2.5rem] border border-[var(--border-primary)] shadow-sm">
                    {currentUser.socialLinks && Object.values(currentUser.socialLinks).some(link => link) ? (
                        <div className="space-y-3">
                            {currentUser.socialLinks.linkedin && (
                                <a href={currentUser.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-full hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-colors group border border-[var(--border-primary)] hover:border-sky-200 dark:hover:border-sky-900/30 shadow-sm px-5">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">LinkedIn</span>
                                    <LinkedInLogoIcon className="w-4 h-4 text-sky-600" />
                                </a>
                            )}
                            {currentUser.socialLinks.github && (
                                <a href={currentUser.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group border border-[var(--border-primary)] hover:border-neutral-200 dark:hover:border-neutral-700 shadow-sm px-5">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">GitHub</span>
                                    <GithubLogoIcon className="w-4 h-4 text-[var(--text-primary)]" />
                                </a>
                            )}
                            {currentUser.socialLinks.twitter && (
                                <a href={currentUser.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-colors group border border-[var(--border-primary)] hover:border-pink-200 dark:hover:border-pink-900/30 shadow-sm px-5">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">X (Twitter)</span>
                                    <TwitterXIcon className="w-4 h-4 text-pink-600" />
                                </a>
                            )}
                            {currentUser.socialLinks.instagram && (
                                <a href={currentUser.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-full hover:bg-gradient-to-tr hover:from-purple-500/10 hover:to-orange-500/10 transition-colors group border border-[var(--border-primary)] hover:border-purple-200 dark:hover:border-purple-900/30 shadow-sm px-5">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">Instagram</span>
                                    <InstagramIcon className="w-4 h-4 text-purple-600" />
                                </a>
                            )}
                        </div>
                    ) : <p className="text-[10px] font-medium text-[var(--text-muted)] italic text-center">No social links connected.</p>}
                </section>
            </div>

            {/* INTERESTS SECTION */}
            <div className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <HeartIcon className="w-3 h-3" />
                    </div>
                    Interests
                </h3>
                <section className="bg-white dark:bg-neutral-950 p-6 rounded-[2.5rem] border border-[var(--border-primary)] shadow-sm">
                    <div className="flex flex-wrap gap-2">
                        {currentUser.interests && currentUser.interests.length > 0 ? (
                            currentUser.interests.map(interest => (
                                <span key={interest} className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-[var(--border-primary)] rounded-full text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-tight shadow-inner">
                                    {interest}
                                </span>
                            ))
                        ) : <p className="text-[10px] italic text-[var(--text-muted)] text-center w-full">No interests added yet.</p>}
                    </div>
                </section>
            </div>

            {/* CORE STACK SECTION */}
            <div className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <AcademicCapIcon className="w-3 h-3" />
                    </div>
                    Core Stack
                </h3>
                <section className="bg-white dark:bg-neutral-950 p-6 rounded-[2.5rem] border border-[var(--border-primary)] shadow-sm">
                    <div className="flex flex-wrap gap-2">
                        {currentUser.skills && currentUser.skills.length > 0 ? (
                            currentUser.skills.map(skill => (
                                <span key={skill} className="px-4 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-[var(--border-primary)] rounded-full text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-tight shadow-inner">
                                    {skill}
                                </span>
                            ))
                        ) : <p className="text-[10px] italic text-[var(--text-muted)] text-center w-full">No skills added yet.</p>}
                    </div>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;