// src/pages/PublicProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { StartalkCard } from './StartalksPage';
import { User } from '../types';
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
    PaperAirplaneIcon
    // CheckCircleIcon yahan se hata diya hai kyunki niche defined hai
} from '../constants';

// --- Local Icons (Defined here to avoid import errors) ---
const ClockIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

// ✅ CheckCircleIcon Local Definition
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const ProfilePillCard: React.FC<{ 
    title: string; 
    subtitle: string; 
    imageUrl?: string;
    link: string; 
    badge?: string;
    badgeColor?: string;
}> = ({ title, subtitle, imageUrl, link, badge, badgeColor = "bg-purple-100 text-purple-700" }) => (
    <Link 
        to={link}
        className="flex-shrink-0 flex items-center gap-3 px-5 py-3.5 bg-white dark:bg-neutral-900 border border-[var(--border-primary)] rounded-full hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 min-w-[240px] max-w-[320px] group shadow-sm snap-start"
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
);

const PublicProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { 
    getUserById, 
    fetchUserProfile, 
    sendConnectionRequest, 
    currentUser, 
    startupIdeas, 
    isRequestPending, 
    isUserConnected, 
    startalks, 
    connectedUserIds 
  } = useAppContext();
  const navigate = useNavigate();

  const [fetchedUser, setFetchedUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ Fetch user if not already available
  useEffect(() => {
    if (!userId) return;

    // Check local first
    const existing = getUserById(userId);
    if (existing) {
        setFetchedUser(existing);
        setLoadingUser(false);
    } else {
        // Fetch from API
        fetchUserProfile(userId).then(u => {
            setFetchedUser(u);
            setLoadingUser(false);
        });
    }
  }, [userId, getUserById, fetchUserProfile]);
  
  // Show Loading or Not Found
  if (loadingUser) return <div className="text-center py-20">Loading Innovator...</div>;
  if (!fetchedUser) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-black uppercase text-[var(--accent-danger-text)] mb-4 tracking-tight">Innovator Not Found</h1>
        <Link 
          to="/projects" 
          className="button-gradient inline-flex items-center text-white font-black uppercase text-xs tracking-widest py-3 px-8 rounded-full shadow-lg"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Assign to user variable
  const user = fetchedUser;
  
  const userProjects = startupIdeas.filter(idea => idea.founderId === user.id && !idea.askingPrice);
  const userAssets = startupIdeas.filter(idea => idea.founderId === user.id && idea.askingPrice);
  const userTalks = startalks.filter(talk => talk.authorId === user.id);

  const initials = user.name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || 'U';
  const countryFlag = getFlagEmoji(user.country);

  const isOwnProfile = currentUser?.id === user.id;
  const requestIsPending = !isOwnProfile && isRequestPending(user.id);
  const usersAreConnected = !isOwnProfile && isUserConnected(user.id);

  const handleConnectionAction = () => {
    if (isOwnProfile) {
        navigate('/profile/edit'); 
        return;
    }
    if (usersAreConnected) {
      navigate(`/messages?chatWith=${user.id}`);
    } else if (!requestIsPending) {
      sendConnectionRequest(user.id);
    }
  };
  
  const getButtonContent = () => {
    if (isOwnProfile) return <span>Edit Profile</span>;
    // ✅ Updated to use local CheckCircleIcon
    if (usersAreConnected) return <><CheckCircleIcon className="w-4 h-4" /><span>Message Connection</span></>;
    if (requestIsPending) return <><ClockIcon className="w-4 h-4" /><span>Invite Sent</span></>;
    return <><PaperAirplaneIcon className="w-4 h-4 -rotate-45" /><span>Send Invite</span></>;
  };

  const getButtonClasses = () => {
    let base = "inline-flex items-center space-x-2 font-black uppercase tracking-widest py-2.5 px-6 rounded-full transition-all duration-300 text-[10px] transform hover:scale-105 active:scale-95";
    if (isOwnProfile || (!requestIsPending && !usersAreConnected)) base += " button-gradient text-white";
    else if (usersAreConnected) base += " bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30";
    else if (requestIsPending) base += " bg-neutral-100 dark:bg-neutral-800 text-[var(--text-muted)] border border-[var(--border-primary)] cursor-not-allowed";
    return base;
  };

  const connectionCount = isOwnProfile ? connectedUserIds.length : ((user.id.length * 7 + 12) % 300 + 40);

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-1">
          <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 group rounded-full px-5 py-2 bg-[var(--background-tertiary)] border border-[var(--border-primary)]">
            <ChevronLeftIcon className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>
          
          <button onClick={handleConnectionAction} className={getButtonClasses()} disabled={requestIsPending}>
            {getButtonContent()}
          </button>
      </div>

      <section className="bg-white dark:bg-black border border-[var(--border-primary)] rounded-[3rem] p-8 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 dot-pattern-bg opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-red-500/10 to-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-neutral-100 dark:bg-neutral-800 border-4 border-white dark:border-neutral-900 shadow-2xl flex-shrink-0 flex items-center justify-center overflow-hidden relative z-10">
                    {user.profilePictureUrl ? (
                        <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-5xl font-black text-neutral-300 dark:text-neutral-700">{initials}</span>
                    )}
                </div>
            </div>

            <div className="flex-grow text-center md:text-left space-y-5 pt-2">
                <div>
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-[var(--text-primary)] leading-none">{user.name}</h1>
                        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded-full border border-[var(--border-primary)]">
                            <span className="text-xl">{countryFlag}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{user.country}</span>
                        </div>
                    </div>
                    <p className="text-xl text-purple-600 dark:text-purple-400 font-medium mt-3 italic">{user.headline || "Innovator & Builder"}</p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <div className="flex items-center gap-2 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-primary)] shadow-sm">
                        <GlobeAltIcon className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Projects</span>
                        <span className="text-xs font-black text-[var(--text-primary)] ml-1">{userProjects.length}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-primary)] shadow-sm">
                        <ShoppingBagIcon className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Assets</span>
                        <span className="text-xs font-black text-[var(--text-primary)] ml-1">{userAssets.length}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-primary)] shadow-sm">
                        <UsersIcon className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Connections</span>
                        <span className="text-xs font-black text-[var(--text-primary)] ml-1">{connectionCount}</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 border-t border-[var(--border-primary)] pt-5">
                    {isOwnProfile && (
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium">
                            <EnvelopeOpenIcon className="w-4 h-4 opacity-50 text-purple-500" />
                            <span>{user.email}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <IdentificationIcon className="w-3 h-3" />
                    </div>
                    Professional Bio
                </h3>
                <section className="bg-white dark:bg-neutral-950 p-8 rounded-[2.5rem] border border-[var(--border-primary)] shadow-sm">
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium opacity-90 whitespace-pre-wrap">
                        {user.bio || "This innovator prefers to let their work speak for itself. Connect to learn more about their journey."}
                    </p>
                </section>
            </div>

             <section className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <BoltIcon className="w-3 h-3" />
                    </div>
                    Feed Activity
                </h3>
                {userTalks.length > 0 ? (
                    <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory px-2">
                        {userTalks.map(talk => (
                            <StartalkCard key={talk.id} talk={talk} className="flex-shrink-0 w-[320px] sm:w-[480px] snap-start shadow-none" />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-900/50 rounded-[2.5rem] border-2 border-dashed border-[var(--border-primary)]">
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase italic tracking-widest">No public activity recently</p>
                    </div>
                )}
            </section>

            <section className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <GlobeAltIcon className="w-3 h-3" />
                    </div>
                    Projects Spearheaded
                </h3>
                {userProjects.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory px-2">
                        {userProjects.map(idea => (
                            <ProfilePillCard 
                                key={idea.id}
                                title={idea.title}
                                subtitle={idea.tagline}
                                imageUrl={idea.imageUrl}
                                link={`/idea/${idea.id}`}
                                badge={idea.stage}
                                badgeColor="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-900/50 rounded-[2.5rem] border-2 border-dashed border-[var(--border-primary)]">
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase italic tracking-widest">No active public projects</p>
                    </div>
                )}
            </section>

             <section className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <ShoppingBagIcon className="w-3 h-3" />
                    </div>
                    Verified Assets
                </h3>
                {userAssets.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory px-2">
                        {userAssets.map(asset => (
                            <ProfilePillCard 
                                key={asset.id}
                                title={asset.title}
                                subtitle={asset.askingPrice || 'Pricing TBD'}
                                imageUrl={asset.imageUrl}
                                link={`/asset/${asset.id}`}
                                badge="Verified"
                                badgeColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-900/50 rounded-[2.5rem] border-2 border-dashed border-[var(--border-primary)]">
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase italic tracking-widest">No vetted assets available</p>
                    </div>
                )}
            </section>
        </div>

        <div className="lg:col-span-1 space-y-10">
            <div className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <LinkIconHero className="w-3 h-3" />
                    </div>
                    Connectivity
                </h3>
                <section className="bg-white dark:bg-neutral-950 p-6 rounded-[2.5rem] border border-[var(--border-primary)] shadow-sm">
                    {user.socialLinks && Object.values(user.socialLinks).some(link => link) ? (
                        <div className="space-y-3">
                            {user.socialLinks.linkedin && (
                                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-full hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-colors group border border-[var(--border-primary)] hover:border-sky-200 dark:hover:border-sky-900/30 shadow-sm px-5">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">LinkedIn</span>
                                    <LinkedInLogoIcon className="w-4 h-4 text-sky-600" />
                                </a>
                            )}
                            {user.socialLinks.github && (
                                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group border border-[var(--border-primary)] hover:border-neutral-200 dark:hover:border-neutral-700 shadow-sm px-5">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">GitHub</span>
                                    <GithubLogoIcon className="w-4 h-4 text-[var(--text-primary)]" />
                                </a>
                            )}
                            {user.socialLinks.twitter && (
                                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-colors group border border-[var(--border-primary)] hover:border-pink-200 dark:hover:border-pink-900/30 shadow-sm px-5">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">X (Twitter)</span>
                                    <TwitterXIcon className="w-4 h-4 text-pink-600" />
                                </a>
                            )}
                            {user.socialLinks.instagram && (
                                <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-full hover:bg-gradient-to-tr hover:from-purple-500/10 hover:to-orange-500/10 transition-colors group border border-[var(--border-primary)] hover:border-purple-200 dark:hover:border-purple-900/30 shadow-sm px-5">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary)]">Instagram</span>
                                    <InstagramIcon className="w-4 h-4 text-purple-600" />
                                </a>
                            )}
                        </div>
                    ) : <p className="text-[10px] font-medium text-[var(--text-muted)] italic text-center">No social links provided.</p>}
                </section>
            </div>

            <div className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <HeartIcon className="w-3 h-3" />
                    </div>
                    Interests
                </h3>
                <section className="bg-white dark:bg-neutral-950 p-6 rounded-[2.5rem] border border-[var(--border-primary)] shadow-sm">
                    <div className="flex flex-wrap gap-2">
                        {user.interests && user.interests.length > 0 ? (
                            user.interests.map(interest => (
                                <span key={interest} className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-[var(--border-primary)] rounded-full text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-tight shadow-inner">
                                    {interest}
                                </span>
                            ))
                        ) : <p className="text-[10px] italic text-[var(--text-muted)] text-center w-full">No interests listed.</p>}
                    </div>
                </section>
            </div>

            <div className="space-y-4">
                <h3 className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white">
                        <AcademicCapIcon className="w-3 h-3" />
                    </div>
                    Expertise
                </h3>
                <section className="bg-white dark:bg-neutral-950 p-6 rounded-[2.5rem] border border-[var(--border-primary)] shadow-sm">
                    <div className="flex flex-wrap gap-2">
                        {user.skills && user.skills.length > 0 ? (
                            user.skills.map(skill => (
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

export default PublicProfilePage;