import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
    APP_NAME, 
    LinkedInLogoIcon,
    GithubLogoIcon,
    XLogoIcon,
    FacebookLogoIcon,
    CurrencyDollarIcon,
    ChevronRightIcon,
    BoltIcon,
    UsersIcon,
    IdeaStarIcon
} from '../constants';

const GradientButton: React.FC<{ to?: string; href?: string; children: React.ReactNode; className?: string; icon?: React.ReactNode, type?: "button" | "submit" | "reset", onClick?: () => void, "data-animate-delay"?: string }> = ({ to, href, children, className, icon, type="button", onClick, "data-animate-delay": dataAnimateDelay }) => {
  const commonClasses = `button-gradient inline-flex items-center justify-center text-white font-semibold py-3 px-8 rounded-full text-base transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50 ${className}`;
  
  const content = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  if (to) {
    return <Link to={to} className={commonClasses} onClick={onClick} data-Animate-delay={dataAnimateDelay}>{content}</Link>;
  }
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={commonClasses} onClick={onClick} data-Animate-delay={dataAnimateDelay}>{content}</a>;
  }
  return <button type={type} className={commonClasses} onClick={onClick} data-Animate-delay={dataAnimateDelay}>{content}</button>;
};

const ArrowRightIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  </svg>
);

const GlobeIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8 text-blue-400" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
    </svg>
);

const CubeIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8 text-blue-400" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const CheckBadgeIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8 text-blue-400" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SparklesIcon: React.FC<{className?: string}> = ({className = "w-10 h-10 text-blue-400"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.567L16.5 21.75l-.398-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.398a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const useCountUp = (endValue: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const totalFrames = Math.round(duration / (1000 / 60));
        const counter = setInterval(() => {
            start++;
            const progress = start / totalFrames;
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(endValue * easedProgress));
            if (start === totalFrames) {
                clearInterval(counter);
                setCount(endValue); 
            }
        }, 1000 / 60);
        return () => clearInterval(counter);
    }, [endValue, duration]);
    return count;
};

const ChartBarSquareIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>);
const LightningBoltIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>);

const EcosystemStatCard: React.FC<{ endValue: number; label: string; description: string; icon: React.ReactElement<{ className?: string }>; suffix?: string; className?: string; gradient: string }> = ({ endValue, label, description, icon, suffix, className, gradient }) => {
    const { theme } = useTheme();
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const count = useCountUp(isInView ? endValue : 0, 2000);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.5 });
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);
    
    const textGradient = theme === 'dark' ? 'from-white to-neutral-400' : 'from-neutral-900 to-neutral-600';

    return (
        <div 
            ref={ref}
            className={`fade-in-up bg-[var(--component-background)] p-6 rounded-2xl border border-[var(--border-primary)] transition-all duration-300 transform hover:-translate-y-2 hover:border-red-500/50 ${className}`}
        >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br ${gradient}`}>
                {React.cloneElement(icon, { className: "w-7 h-7 text-white"})}
            </div>
            <p className={`text-3xl font-bold bg-gradient-to-r ${textGradient} bg-clip-text text-transparent font-poppins`}>
                {count}{suffix}
            </p>
            <h3 className="text-base font-bold text-[var(--text-primary)] mt-3 font-poppins">{label}</h3>
            <p className="text-[var(--text-secondary)] mt-1 text-xs font-poppins">{description}</p>
        </div>
    );
};

const HomePage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  const features = [
    { icon: <CheckBadgeIcon />, title: "Validate your idea", description: "Get feedback on your startup concept from a diverse community of experts and peers.", gradient: 'from-sky-400 to-cyan-300' },
    { icon: <UsersIcon />, title: "Find a co-founder", description: "Connect with passionate individuals who share your vision and have the skills to help you succeed.", gradient: 'from-red-500 to-rose-400' },
    { icon: <CubeIcon />, title: "Build your mvp", description: "Assemble a talented team to bring your Minimum Viable Product to life and start testing the market.", gradient: 'from-orange-400 to-yellow-300' },
    { icon: <GlobeIcon />, title: "Scale your venture", description: "Access a global network of talent, mentors, and resources to grow your startup beyond its initial stages.", gradient: 'from-emerald-400 to-teal-300' },
  ];
  
  const testimonials = [
      { name: "Kenji Tanaka", role: "Founder, Nexus AI", quote: `Within a week, I connected with two incredible developers on ${APP_NAME}. It's a game-changer for early-stage founders.` },
      { name: "Priya Sharma", role: "UX Designer", quote: `I was looking to join an exciting project and found the perfect fit here. The quality of ideas is amazing.` },
      { name: "Wei Zhang", role: "Full-Stack Developer", quote: `As a developer, this platform is a goldmine. I get to work on innovative projects and build my portfolio.` }
  ];

  const companyLogos = [
    { component: <LinkedInLogoIcon />, alt: 'LinkedIn' },
    { component: <GithubLogoIcon />, alt: 'GitHub' },
    { component: <XLogoIcon />, alt: 'X' },
    { component: <FacebookLogoIcon />, alt: 'Facebook' },
  ];

  const whyChooseFeatures = [
    {
      align: 'left',
      title: 'Forge global alliances.',
      description: 'Break geographical barriers. Connect with a diverse pool of innovators, mentors, and investors from every corner of the globe.',
      gradient: 'from-sky-400 to-cyan-300',
    },
    {
      align: 'right',
      title: 'Assemble your dream team.',
      description: 'Find the missing piece to your puzzle. Our platform is the crucible where visionary founders meet brilliant developers and designers.',
      gradient: 'from-red-500 to-red-400',
    },
    {
      align: 'left',
      title: 'Launchpad for legends.',
      description: 'Go from a spark of genius to a market-ready MVP. We provide the tools and community support to validate your vision.',
      gradient: 'from-orange-400 to-yellow-300',
    }
  ];

  return (
    <div ref={pageRef} className="bg-[var(--background-primary)] text-[var(--text-primary)] overflow-x-hidden font-poppins">
      <div className="relative z-10">
        <section className="hero-animated-bg relative pt-20 pb-20 sm:pt-24 sm:pb-28 text-center px-4">
          <div className="absolute inset-0 z-0 dot-pattern-bg"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background-primary)] to-transparent z-10"></div>
          <div className="relative z-20 max-w-4xl mx-auto">
            <div className="fade-in-up">
              <img src="https://i.postimg.cc/pLTtqf3Q/Picsart-25-09-19-20-29-01-019.png" alt="Startives Logo" className="mx-auto mb-4 h-24 w-24" />
            </div>
             <div className="fade-in">
                <div className="flex items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 flex-wrap mb-8 text-sm text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full icon-bg-gradient flex items-center justify-center">
                            <UsersIcon className="w-2.5 h-2.5 text-white"/>
                        </div> 
                        Find co-founders
                    </span>
                    <span className="hidden sm:inline text-neutral-400 dark:text-neutral-600">&bull;</span>
                    <span className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full icon-bg-gradient flex items-center justify-center">
                            <SparklesIcon className="w-2.5 h-2.5 text-white"/>
                        </div>
                        Validate ideas
                    </span>
                    <span className="hidden sm:inline text-neutral-400 dark:text-neutral-600">&bull;</span>
                    <span className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full icon-bg-gradient flex items-center justify-center">
                            <CubeIcon className="w-2.5 h-2.5 text-white"/>
                        </div>
                        Assemble teams
                    </span>
                </div>
              </div>
            <div className="fade-in-up">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-[var(--text-primary)] font-poppins">
                Where visionaries &<br/>
                <span className="bg-gradient-to-r from-red-500 to-blue-500 gradient-text">builders connect</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-medium font-poppins">
                {APP_NAME} is your launchpad for turning visionary ideas into reality. Connect with co-founders, assemble your dream team, and build the future, together.
              </p>
            </div>
            <div className="mt-10 flex items-center justify-center gap-4 fade-in-up">
              <GradientButton to="/signup" className="font-poppins">Join the future</GradientButton>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-[var(--background-secondary)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 fade-in-up">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight font-poppins">
                        An ecosystem in motion
                    </h2>
                    <p className="text-[var(--text-secondary)] mt-2 max-w-2xl mx-auto text-sm sm:text-base font-medium font-poppins">
                        Witness the pulse of innovation. Our platform is a dynamic network where connections spark, ideas ignite, and ventures take flight every day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <EcosystemStatCard 
                        className="ecosystem-stat-card shadow-none"
                        endValue={50}
                        suffix="+"
                        label="Projects launched"
                        description="From initial spark to successful launch, ventures are taking off."
                        icon={<ChartBarSquareIcon />}
                        gradient="from-sky-500 to-cyan-400"
                    />
                     <EcosystemStatCard 
                        className="ecosystem-stat-card shadow-none"
                        endValue={200}
                        suffix="+"
                        label="Founders connected"
                        description="Building powerful partnerships and lasting co-founder relationships."
                        icon={<UsersIcon />}
                        gradient="from-red-500 to-red-600"
                    />
                     <EcosystemStatCard 
                        className="ecosystem-stat-card shadow-none"
                        endValue={500}
                        suffix="+"
                        label="Innovators"
                        description="A growing community of developers, designers, and strategists."
                        icon={<LightningBoltIcon />}
                        gradient="from-orange-400 to-yellow-300"
                    />
                </div>
            </div>
        </section>
        
        <section className="py-12 bg-[var(--background-primary)]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2 fade-in-up tracking-tight font-poppins">Everything you need to start</h2>
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto fade-in-up text-sm sm:text-base font-medium font-poppins">From idea to launch, {APP_NAME} provides the tools and community to support your journey.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="feature-card-item bg-[var(--component-background)] p-6 rounded-2xl border border-[var(--border-primary)] transition-all duration-300 transform hover:-translate-y-2 hover:border-red-500/50 fade-in-up text-center flex flex-col items-center shadow-none">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br ${feature.gradient}`}>
                      {React.cloneElement(feature.icon, { className: "w-5 h-5 text-white"})}
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-1.5 tracking-tight font-poppins">{feature.title}</h3>
                  <p className="text-[var(--text-secondary)] text-xs font-medium leading-relaxed font-poppins">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 bg-[var(--background-secondary)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-6">
                    <h2 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight font-poppins">The asset exchange</h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto my-3 rounded-full"></div>
                    <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed font-medium opacity-90 font-poppins">
                        A premium ecosystem where validated digital products find new growth. 
                        We facilitate direct introductions between high-level builders and strategic acquirers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-[var(--component-background)] p-6 rounded-3xl border border-[var(--border-primary)] shadow-none flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
                            <CurrencyDollarIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-black text-[var(--text-primary)] mb-2 tracking-tight font-poppins">Vetted inventory</h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium opacity-80 font-poppins">Access startups with proven revenue, verified MRR, and clean codebases. Every listing undergoes an internal audit process.</p>
                    </div>

                    <div className="bg-[var(--component-background)] p-6 rounded-3xl border border-[var(--border-primary)] shadow-none flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 mb-4">
                            <BoltIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-black text-[var(--text-primary)] mb-2 tracking-tight font-poppins">Secured handover</h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium opacity-80 font-poppins">Gain access to standardized migration checklists for code, domains, and documentation to ensure a predictable transfer.</p>
                    </div>

                    <div className="bg-[var(--component-background)] p-6 rounded-3xl border border-[var(--border-primary)] shadow-none flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 mb-4">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-black text-[var(--text-primary)] mb-2 tracking-tight font-poppins">Founder access</h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium opacity-80 font-poppins">Skip the middleman. Chat directly with original builders for due diligence. We provide the room, you finalize the transaction.</p>
                    </div>
                </div>

                <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white dark:bg-black border border-gray-100 dark:border-neutral-900 shadow-none relative overflow-hidden text-neutral-900 dark:text-white max-w-4xl mx-auto">
                    <div className="absolute inset-0 dot-pattern-bg opacity-[0.03] pointer-events-none"></div>
                    <div className="absolute -top-20 -right-20 w-56 h-56 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl opacity-60"></div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                        <div className="text-center sm:text-left max-w-lg">
                            <h3 className="text-xl font-black tracking-tight mb-2 italic font-poppins">Ready to cash out?</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium leading-relaxed font-poppins">
                                List your digital assets in front of thousands of potential acquirers. 
                                High-intent, zero commissions, and founder-focused.
                            </p>
                        </div>
                        <Link to="/submit-asset" className="w-full sm:w-auto px-10 py-3 button-gradient text-white font-black uppercase text-[11px] tracking-widest rounded-full shadow-none hover:scale-105 transition-all active:scale-95 text-center font-poppins">
                            Enroll your asset
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-12 bg-[var(--background-primary)] relative overflow-hidden">
             <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl opacity-40"></div>
             <div className="container mx-auto px-4 relative z-10">
                 <div className="flex flex-col lg:flex-row items-center gap-10 max-w-5xl mx-auto">
                     <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                         <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-[var(--text-primary)] font-poppins uppercase">The pulse of innovation</h2>
                         <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium leading-relaxed font-poppins">
                             Explore real-time thoughts, wins, and pivots from founders building the next big things. Startalks is the social layer where the community breathes.
                         </p>
                         <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                            <Link to="/startalks" className="button-gradient text-white px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-none hover:scale-105 transition-all font-poppins">Enter the feed</Link>
                            <Link to="/signup" className="bg-[var(--background-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)] px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[var(--component-background-hover)] transition-all font-poppins shadow-none">Join the talk</Link>
                         </div>
                     </div>
                     <div className="lg:w-1/2 relative">
                         <div className="grid grid-cols-2 gap-4">
                             {[
                                 { name: 'Sarah J.', content: 'Just secured beta testers! 🚀', delay: '0s', emoji: '🎉' },
                                 { name: 'Mike R.', content: 'Pivot was the best decision.', delay: '0.2s', emoji: '💡' },
                                 { name: 'Elena W.', content: 'Scaling to 10k MRR today.', delay: '0.4s', emoji: '📈' },
                                 { name: 'Liam P.', content: 'Building in public is hard but worth it.', delay: '0.6s', emoji: '🔨' }
                             ].map((talk, idx) => (
                                 <div key={idx} className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-[var(--border-primary)] shadow-none animate-in slide-in-from-bottom-4 duration-700 font-poppins" style={{ animationDelay: talk.delay }}>
                                     <div className="flex items-center gap-2 mb-2">
                                         <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-[10px] text-white font-bold">{talk.name[0]}</div>
                                         <span className="text-[10px] font-bold text-[var(--text-primary)]">{talk.name}</span>
                                     </div>
                                     <p className="text-[11px] text-[var(--text-secondary)] font-medium italic">"{talk.content}"</p>
                                     <div className="mt-2 text-right text-xs">{talk.emoji}</div>
                                 </div>
                             ))}
                         </div>
                         <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-500/10 rounded-full animate-orbit blur-xl"></div>
                         <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-500/10 rounded-full animate-orbit blur-xl" style={{ animationDirection: 'reverse' }}></div>
                     </div>
                 </div>
             </div>
        </section>

        <section className="py-12 sm:py-16 bg-[var(--background-primary)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 fade-in">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight font-poppins uppercase">Why startives exists?</h2>
                    <p className="text-[var(--text-secondary)] mt-2 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium font-poppins">We're more than a platform; we're your strategic partner in innovation.</p>
                </div>
                <div className="max-w-4xl mx-auto space-y-12">
                    {whyChooseFeatures.map((feature, index) => (
                        <div key={index} className={`fade-in-up flex flex-col ${index % 2 === 0 ? 'md:items-start text-center md:text-left' : 'md:items-end text-center md:text-right'}`}>
                            <h3 className={`text-2xl font-bold bg-gradient-to-r ${feature.gradient} gradient-text mb-3 inline-block tracking-tight font-poppins`}>{feature.title}</h3>
                            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-3xl font-medium font-poppins">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        <section className="py-12 sm:py-16 bg-[var(--background-secondary)]">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight font-poppins uppercase">From our community</h2>
              <p className="text-[var(--text-secondary)] mt-2 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium font-poppins">Innovators are building, connecting, and succeeding on {APP_NAME}.</p>
            </div>
            <div className="relative w-full overflow-hidden mask-gradient">
              <div className="flex animate-marquee gap-8">
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <div key={index} className="flex-shrink-0 w-[90vw] sm:w-[420px]">
                    <div className="p-6 bg-[var(--component-background)] rounded-2xl border border-[var(--border-primary)] flex flex-col space-y-4 h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-none hover:border-purple-500/20 relative overflow-hidden font-poppins shadow-none">
                      <img src="https://i.postimg.cc/pLTtqf3Q/Picsart-25-09-19-20-29-01-019.png" alt="Logo" className="absolute -top-4 -right-4 w-24 h-24 opacity-5" />
                      <div className="flex justify-between items-center z-10">
                        <div className="flex space-x-0.5 text-yellow-400">
                          <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                        </div>
                      </div>
                      <p className="text-[var(--text-secondary)] text-sm sm:text-base italic flex-grow z-10 leading-relaxed font-medium">"{testimonial.quote}"</p>
                      <div className="pt-4 border-t border-[var(--border-primary)] z-10">
                        <div>
                          <p className="font-bold text-[var(--text-primary)] text-sm">{testimonial.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-[var(--background-primary)]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 fade-in-up">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight font-poppins uppercase">
                        Powering the next wave of startups
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium font-poppins">
                        We are proud to be the launchpad for innovators from world-class companies and universities.
                    </p>
                </div>
             <div className="flex justify-center items-center gap-x-16 sm:gap-x-24">
                {companyLogos.map((logo, index) => (
                    <div key={index} aria-label={logo.alt}>
                        {React.cloneElement(logo.component, {
                            className: "h-8 w-8 text-[var(--text-muted)] opacity-70 hover:opacity-100 transition-opacity duration-300 shadow-none"
                        })}
                    </div>
                ))}
            </div>
        </div>
        </section>
        <section className="text-center py-12 px-4 bg-[var(--background-secondary)]">
            <div className="container mx-auto max-w-3xl fade-in font-poppins">
              <div className="w-12 h-12 rounded-full icon-bg-gradient flex items-center justify-center mx-auto mb-4 shadow-none">
                <SparklesIcon className="w-6 h-6 text-white"/>
              </div>
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight font-poppins uppercase">Ready to build what's next?</h2>
              <p className="text-[var(--text-secondary)] mt-2 text-xs sm:text-sm leading-relaxed font-medium">
                Your next big opportunity is just a click away. Join a community of forward-thinkers and start building your legacy today.
              </p>
              <div className="mt-8">
                 <GradientButton to="/signup" icon={<ArrowRightIcon />} className="shadow-none !text-xs !py-2.5 !px-6">Launch your vision</GradientButton>
              </div>
            </div>
        </section>
      </div>
    </div>
  );
};

const StarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
  </svg>
);

export default HomePage;