
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { User } from '../types'; 
import { IdeaStarIcon, ChevronRightIcon, SparklesIcon, ShoppingBagIcon, TwitterXIcon, ChatBubbleLeftRightIcon, GlobeAltIcon, ChatBubbleBottomCenterTextIcon, XMarkIcon, UserCircleIcon, PaperAirplaneIcon, InstagramIcon } from '../constants';

// --- DashboardStatCard Component ---
interface DashboardSummaryStatCardProps {
  title: string;
  value: string | number;
  icon: string | React.ReactElement;
  subtext: string;
  isPrimary?: boolean;
  linkTo?: string;
  animationDelay?: string;
}

const DashboardSummaryStatCard: React.FC<DashboardSummaryStatCardProps> = ({ title, value, icon, subtext, isPrimary = false, linkTo, animationDelay = '0s' }) => {
  const [cardMounted, setCardMounted] = useState(false);
  useEffect(() => {
    const delay = parseFloat(animationDelay.replace('s', '')) * 1000;
    const timer = setTimeout(() => setCardMounted(true), delay + 50);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  const iconIsEmoji = typeof icon === 'string';

  const cardContent = (
    <>
      <div className="flex justify-between items-start">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center animate-logo-pulse transition-transform duration-500 group-hover:scale-110
          ${isPrimary 
            ? 'bg-white/20' 
            : 'bg-gradient-to-br from-red-500/10 to-blue-500/10'
          }`
        }>
          {iconIsEmoji ? (
            <span className={`
              ${isPrimary ? (icon === '🚀' ? 'text-lg' : 'text-2xl') : 'text-xl'}
            `} role="img" aria-label={`${title} icon`}>{icon}</span>
          ) : (
            React.cloneElement(icon as React.ReactElement, { className: `w-4 h-4 ${isPrimary ? 'text-white' : 'text-[var(--text-primary)]'}` })
          )}
        </div>
      </div>
      <div className="mt-2.5">
        <h3 className={`text-2xl font-extrabold tracking-tight font-poppins ${isPrimary ? 'text-white' : 'text-[var(--text-primary)]'}`}>{value}</h3>
        <p className={`text-sm font-bold font-poppins ${isPrimary ? 'text-white/90' : 'text-[var(--text-primary)]'}`}>{title}</p>
      </div>
      <p className={`text-[10px] font-medium tracking-tight mt-1 font-poppins ${isPrimary ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>{subtext}</p>
    </>
  );

  const baseClasses = `p-4 rounded-2xl transition-all duration-500 ease-out transform hover:-translate-y-1.5 group
                      ${cardMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

  const conditionalClasses = isPrimary
    ? "button-gradient"
    : "bg-[var(--component-background)] backdrop-blur-md border border-[var(--border-primary)] hover:border-[var(--border-accent)]/50 dot-pattern-bg";

  if (linkTo) {
    return ( <Link to={linkTo} className={`${baseClasses} ${conditionalClasses} block shadow-none`}>{cardContent}</Link> );
  }
  return ( <div className={`${baseClasses} ${conditionalClasses}`}>{cardContent}</div> );
};

// --- Projects Shortcut ---
const DiscoverProjectsShortcut: React.FC = () => {
    return (
        <Link 
            to="/projects" 
            className="group relative flex items-center justify-between p-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/15 dark:to-pink-500/15 rounded-2xl transition-all duration-300 hover:border-purple-500/30 overflow-hidden"
        >
             <div className="absolute inset-0 dot-pattern-bg opacity-[0.05] dark:opacity-[0.1] pointer-events-none"></div>
            <div className="flex items-center gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm transform transition-all duration-500 border border-purple-500/10">
                    <GlobeAltIcon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-purple-500 transition-colors tracking-tight font-poppins">Discover ideas</h3>
                    <p className="text-xs text-[var(--text-muted)] font-medium font-poppins">Explore trending innovations</p>
                </div>
            </div>
            <div className="relative">
                <span className="bg-purple-600 text-white text-[9px] font-bold px-4 py-1.5 rounded-full shadow-none group-hover:scale-105 transition-transform flex items-center gap-1 tracking-tight font-poppins uppercase">
                    Explore
                    <ChevronRightIcon className="w-2.5 h-2.5" />
                </span>
            </div>
        </Link>
    );
};

// --- Marketplace Shortcut ---
const MarketplaceShortcut: React.FC = () => {
    return (
        <Link 
            to="/blueprint" 
            className="group relative flex items-center justify-between p-4 bg-gradient-to-br from-red-500/5 to-blue-500/5 dark:from-red-500/15 dark:to-blue-500/15 rounded-2xl transition-all duration-300 hover:border-red-500/30 overflow-hidden"
        >
             <div className="absolute inset-0 dot-pattern-bg opacity-[0.05] dark:opacity-[0.1] pointer-events-none"></div>
            <div className="flex items-center gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm transform transition-transform duration-500 border border-red-500/10">
                    <ShoppingBagIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-red-500 transition-colors tracking-tight font-poppins">Asset shop</h3>
                    <p className="text-xs text-[var(--text-muted)] font-medium font-poppins">Browse verified assets</p>
                </div>
            </div>
            <div className="relative">
                <span className="bg-red-500 text-white text-[9px] font-bold px-4 py-1.5 rounded-full shadow-none group-hover:scale-105 transition-transform flex items-center gap-1 tracking-tight font-poppins uppercase">
                    Enter
                    <ChevronRightIcon className="w-2.5 h-2.5" />
                </span>
            </div>
        </Link>
    );
};

// --- Message Center ---
const MessageCenter: React.FC = () => {
    return (
        <Link 
            to="/messages" 
            className="group relative flex items-center justify-between p-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 dark:from-blue-500/15 dark:to-cyan-500/15 rounded-2xl transition-all duration-300 hover:border-blue-500/30 overflow-hidden"
        >
            <div className="absolute inset-0 dot-pattern-bg opacity-[0.05] dark:opacity-[0.1] pointer-events-none"></div>
            <div className="flex items-center gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm transform transition-transform duration-500 border border-blue-500/10">
                    <PaperAirplaneIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 -rotate-12" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-blue-600 transition-colors tracking-tight font-poppins">Messenger</h3>
                    <p className="text-xs text-[var(--text-muted)] font-medium font-poppins">Coordinate with teams</p>
                </div>
            </div>
            
            <div className="relative">
                <span className="bg-blue-600 text-white text-[9px] font-bold px-4 py-1.5 rounded-full shadow-none group-hover:scale-105 transition-transform flex items-center gap-1 tracking-tight font-poppins uppercase">
                    Open
                    <ChevronRightIcon className="w-2.5 h-2.5" />
                </span>
            </div>
        </Link>
    );
};

// --- Redesigned Compact & Rich About Startives Box ---
const AboutStartivesBox: React.FC = () => {
    return (
        <div className="bg-[var(--component-background)] p-5 rounded-2xl border border-[var(--border-primary)] relative overflow-hidden group h-full shadow-none">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <img 
                src="https://i.postimg.cc/pLTtqf3Q/Picsart-25-09-19-20-29-01-019.png" 
                alt="" 
                className="w-56 h-56 opacity-[0.06] dark:opacity-[0.1] group-hover:opacity-[0.08] dark:group-hover:opacity-[0.15] transition-all duration-700 transform group-hover:scale-110 drop-shadow-2xl" 
                />
            </div>
            
            <div className="relative z-10 flex flex-col h-full font-poppins">
                <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">About startives</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 flex-grow">
                    <div>
                        <h4 className="text-[10px] font-bold uppercase text-purple-600 tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                            Help center
                        </h4>
                        <ul className="space-y-2">
                            {[
                                { name: 'About us', path: '/about' },
                                { name: 'Privacy policy', path: '/privacy-policy' },
                                { name: 'Contact us', path: '/contact-us' },
                                { name: 'For Sponsorship', path: '/sponsorship' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        to={link.path} 
                                        className="text-xs font-semibold text-[var(--text-secondary)] hover:text-purple-500 transition-colors flex items-center gap-2 group/item"
                                    >
                                        <ChevronRightIcon className="w-2 h-2 opacity-50 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="flex flex-col">
                        <h4 className="text-[10px] font-bold uppercase text-blue-600 tracking-widest mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            Join us on
                        </h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-start gap-3 mt-1">
                                <a 
                                    href="https://x.com/startives" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)] hover:bg-neutral-900 hover:text-white transition-all transform hover:scale-105 shadow-none"
                                    aria-label="Follow us on X"
                                >
                                    <TwitterXIcon className="w-4 h-4" />
                                </a>
                                <div className="flex-grow pt-0.5">
                                    <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">Twitter/x</p>
                                    <p className="text-[10px] font-medium text-[var(--text-muted)] mt-0.5 leading-tight">Latest updates.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <a 
                                    href="https://instagram.com/startives" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-primary)] hover:bg-gradient-to-tr hover:from-purple-500 hover:to-orange-500 hover:text-white transition-all transform hover:scale-105 shadow-none"
                                    aria-label="Follow us on Instagram"
                                >
                                    <InstagramIcon className="w-4 h-4" />
                                </a>
                                <div className="flex-grow pt-0.5">
                                    <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">Instagram</p>
                                    <p className="text-[10px] font-medium text-[var(--text-muted)] mt-0.5 leading-tight">Visual highlights.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
  const { 
    currentUser, startupIdeas, connectedUserIds, applications 
  } = useAppContext();

  const myProjects = startupIdeas.filter(idea => idea.founderEmail === currentUser?.email);

  const [sentApplicationsCount, receivedApplicationsCount] = useMemo(() => {
    if (!currentUser) return [0, 0];
    const sent = applications.filter(app => app.applicantEmail === currentUser.email).length;
    const myProjectIds = startupIdeas.filter(idea => idea.founderEmail === currentUser.email).map(idea => idea.id);
    const received = applications.filter(app => myProjectIds.includes(app.ideaId)).length;
    return [sent, received];
  }, [applications, startupIdeas, currentUser]);

  const stats = [
    { title: 'Ventures', value: myProjects.length, icon: '🚀', subtext: 'Active ventures', isPrimary: true, linkTo: '/my-projects', animationDelay: '0.1s' },
    { title: 'Connections', value: connectedUserIds.length, icon: '🤝', subtext: 'Your network', linkTo: '/connections', animationDelay: '0.2s' },
    { title: 'Applications', value: sentApplicationsCount + receivedApplicationsCount, icon: '📨', subtext: 'Track opportunities', linkTo: '/my-applications', animationDelay: '0.3s' },
    { title: 'Whitelist', value: currentUser?.savedProjectIds?.length || 0, icon: '⭐', subtext: 'Saved ventures', linkTo: '/saved-projects', animationDelay: '0.4s' },
  ];

  return (
    <div className="w-full lg:max-w-screen-xl xl:max-w-screen-2xl mx-auto space-y-6 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                  <h1 className="text-4xl font-startives-brand text-[var(--text-primary)] tracking-tighter">
                    Dashboard
                  </h1>
                  <p className="text-lg text-[var(--text-secondary)] font-medium font-poppins">
                    Greetings, {currentUser?.name.split(' ')[0]}. What are we building today?
                  </p>
              </div>
              <div className="flex flex-row gap-4 mt-2 w-full md:w-auto">
                  <Link 
                    to="/profile" 
                    className="flex-1 md:flex-none md:min-w-[180px] px-5 py-2.5 bg-white dark:bg-neutral-800/80 backdrop-blur-md border border-[var(--border-primary)] text-[11px] font-bold tracking-tight text-[var(--text-primary)] hover:bg-neutral-100 transition-all flex items-center justify-center h-10 rounded-full font-poppins shadow-none uppercase"
                  >
                      VIEW PROFILE
                  </Link>
                  <Link 
                    to="/startalks" 
                    className="flex-1 md:flex-none md:min-w-[180px] button-gradient text-[11px] font-bold tracking-tight text-white hover:scale-[1.02] transition-all flex items-center justify-center h-10 rounded-full font-poppins shadow-none uppercase"
                  >
                      EXPLORE STARTALKS
                  </Link>
              </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
        {stats.map((stat, idx) => (
          <DashboardSummaryStatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mt-8">
        <div className="flex flex-col gap-4">
            <DiscoverProjectsShortcut />
            <MarketplaceShortcut />
            <MessageCenter />
        </div>
        <div>
            <AboutStartivesBox />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
