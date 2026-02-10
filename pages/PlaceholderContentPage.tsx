import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageTitle } from '../App';
import { APP_NAME, ChevronLeftIcon, BoltIcon, UsersIcon, GlobeAltIcon, EyeIcon, HeartIcon, ShoppingBagIcon, PaperAirplaneIcon } from '../constants';

// --- Icons for new design ---
const RocketLaunchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
    </svg>
);
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.567L16.5 21.75l-.398-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.398a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

const ContentCard: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactElement }> = ({ title, children, icon }) => (
    <div className="bg-[var(--component-background)] p-6 rounded-2xl border border-[var(--border-primary)] font-poppins text-left">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4 flex items-center uppercase tracking-tight">
            {icon && React.cloneElement(icon, { className: 'w-6 h-6 mr-3 text-purple-500' })}
            {title}
        </h2>
        <div className="text-[var(--text-secondary)] space-y-4 prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            {children}
        </div>
    </div>
);

const AccordionItem: React.FC<{ title: React.ReactNode; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-[var(--border-primary)] last:border-b-0 font-poppins">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-5" aria-expanded={isOpen}>
                <div className="text-lg font-medium text-[var(--text-primary)]">{title}</div>
                <svg className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div className={`grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : ''}`}>
                <div className="overflow-hidden">
                    <div className="pb-5 text-[var(--text-secondary)] prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PrivacyPolicyContent: React.FC = () => (
    <div className="bg-[var(--component-background)] p-6 rounded-2xl border border-[var(--border-primary)] font-poppins text-left">
        <p className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
        <p className="mb-6 text-sm font-medium">We believe privacy should be simple. Here is how we handle your stuff.</p>
        
        <div className="space-y-1">
            <AccordionItem title={<span className="flex items-center gap-3">What we collect</span>}>
                <p>We collect information that you provide directly to us, such as your name, email address, and the profile details you choose to share, including your professional skills, bio, and social links. Additionally, when you create a project or list an asset, we store the specific details regarding those entries to facilitate the marketplace functionality. We also automatically collect certain technical data when you visit our platform, including your IP address, browser type, and device information, which helps us ensure the security of your account and optimize the performance of our services for your specific environment.</p>
            </AccordionItem>
            <AccordionItem title={<span className="flex items-center gap-3">How we use it</span>}>
                <p>The primary purpose of collecting your data is to provide and improve the Startives ecosystem. We use your information to facilitate meaningful connections between co-founders, recommend relevant projects that match your skills, and ensure a secure environment for all transactions. Your data allows us to personalize your dashboard, send important account notifications, and analyze platform usage trends to develop new features. We are committed to using your information solely for delivering the service you signed up for and do not sell your personal data to third-party advertisers.</p>
            </AccordionItem>
            <AccordionItem title={<span className="flex items-center gap-3">Keeping your data</span>}>
                <p>We retain your personal information only for as long as your account remains active and is necessary to provide you with our services. If you choose to delete your account, your profile and associated personal data will be removed from our active databases immediately. However, we may retain certain information in our secure backups for a limited period or as required by law to comply with legal obligations, resolve disputes, and enforce our agreements. Once these requirements are met, your data is permanently deleted from our systems.</p>
            </AccordionItem>
            <AccordionItem title={<span className="flex items-center gap-3">Your rights</span>}>
                <p>You maintain full control over your personal data. You have the right to access the information we hold about you, request corrections to any inaccuracies, or ask for the complete deletion of your account and data at any time through your profile settings. You may also object to certain processing activities or request a copy of your data in a portable format. If we rely on your consent to process your data, you have the right to withdraw that consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.</p>
            </AccordionItem>
            <AccordionItem title={<span className="flex items-center gap-3">Updates</span>}>
                <p>We may update this privacy policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make significant changes, we will notify you through a prominent notice on our platform or by sending an email to the address associated with your account. We encourage you to review this policy periodically to stay informed about how we are protecting your information. Your continued use of Startives after any changes constitutes your acceptance of the new terms.</p>
            </AccordionItem>
        </div>
    </div>
);

const AboutContent: React.FC = () => (
    <div className="space-y-8 font-poppins">
        <div className="bg-[var(--component-background)] p-8 sm:p-12 rounded-[2.5rem] border border-[var(--border-primary)] text-center shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 dot-pattern-bg opacity-[0.03] pointer-events-none"></div>
            <div className="mx-auto mb-6 relative z-10">
                 <img src="https://i.postimg.cc/pLTtqf3Q/Picsart-25-09-19-20-29-01-019.png" alt="Logo" className="w-20 h-20 mx-auto drop-shadow-xl animate-logo-pulse" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight relative z-10">We Are <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">Startives</span></h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-8 leading-relaxed max-w-2xl mx-auto font-medium relative z-10">
                The operating system for the next generation of startups. We are a decentralized ecosystem where ambition meets opportunity.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[var(--component-background)] p-8 rounded-3xl border border-[var(--border-primary)] shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-6">
                    <EyeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Our Vision</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    To create a borderless world where the only limit to building a unicorn is ambition, not access. We believe that the next big thing can come from anywhere, and we are building the infrastructure to support it.
                </p>
            </div>
            <div className="bg-[var(--component-background)] p-8 rounded-3xl border border-[var(--border-primary)] shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-6">
                    <BoltIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">What We Do</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    We bridge the gap between "I have an idea" and "I have a product". Through our Venture Exchange, Talent Network, and Asset Shop, we facilitate thousands of high-impact connections daily, reducing the friction of starting up.
                </p>
            </div>
        </div>

        <div className="bg-[var(--component-background)] p-8 rounded-3xl border border-[var(--border-primary)] shadow-sm">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                <BoltIcon className="w-5 h-5 text-sky-500"/>
                Our Ecosystem
            </h3>
            <div className="grid sm:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-purple-500" /> Discover Projects
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        An expansive marketplace of innovation where you can explore cutting-edge startups, filter by industry or stage, and find the perfect team to join. Whether you are looking for a technical co-founder or a marketing lead, this is where teams are forged.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                        <GlobeAltIcon className="w-4 h-4 text-pink-500" /> Startalks
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        A dynamic social feed designed for founders. Share real-time updates, celebrate wins, navigate pivots, and get feedback from a community that understands the journey. It's the pulse of our ecosystem.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                        <ShoppingBagIcon className="w-4 h-4 text-emerald-500" /> Asset Shop
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        A trusted exchange for buying and selling verified digital assets. From SaaS codebases to e-commerce stores, we enable founders to exit successfully or acquire turnkey solutions to accelerate their roadmap.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                        <PaperAirplaneIcon className="w-4 h-4 text-blue-500" /> Messenger
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        Your command center for collaboration. A robust real-time communication suite designed for seamless interaction between team members and potential co-founders, featuring direct messaging and team channels.
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-[var(--component-background)] p-8 rounded-3xl border border-[var(--border-primary)] shadow-sm">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-yellow-500"/>
                Our Philosophy
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-bold text-[var(--text-primary)] mb-2">Builder First</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">We prioritize the needs of creators and engineers above all else. Our platform is built by founders, for founders.</p>
                </div>
                <div>
                    <h4 className="font-bold text-[var(--text-primary)] mb-2">Global Access</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Connecting talent from Silicon Valley to Singapore. Innovation knows no borders.</p>
                </div>
                <div>
                    <h4 className="font-bold text-[var(--text-primary)] mb-2">Speed of Execution</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">We provide the tools to move fast. Validate quickly, pivot faster, and scale immediately.</p>
                </div>
            </div>
        </div>

        <div className="text-center pt-8 border-t border-[var(--border-primary)]">
            <p className="text-sm text-[var(--text-muted)] font-medium mb-2">Questions or Partnership Inquiries?</p>
            <a href="mailto:usestartives@gmail.com" className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-80 transition-opacity">
                usestartives@gmail.com
            </a>
        </div>
    </div>
);

const SponsorshipContent: React.FC = () => (
    <div className="bg-[var(--component-background)] p-10 rounded-[2.5rem] border border-[var(--border-primary)] text-center font-poppins shadow-sm">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <RocketLaunchIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-4 uppercase tracking-tighter">Partner with Innovation</h2>
        <p className="text-base text-[var(--text-secondary)] mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
            Unlock unparalleled access to a high-intent audience of startup founders, developers, and angel investors. 
            Partner with {APP_NAME} to amplify your brand presence through strategic placements, dedicated newsletter features, and exclusive hackathon sponsorships. 
            Whether you're launching a dev tool or offering enterprise solutions, our platform delivers the precise visibility you need to drive conversion.
        </p>
        <div className="inline-block p-8 bg-[var(--background-tertiary)] rounded-2xl border border-[var(--border-primary)] shadow-inner">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Contact our partnership team</p>
            <a href="mailto:usestartives@gmail.com" className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 hover:opacity-80 transition-opacity">
                usestartives@gmail.com
            </a>
        </div>
    </div>
);

interface PlaceholderContentPageProps {
  title: string;
}

const PlaceholderContentPage: React.FC<PlaceholderContentPageProps> = ({ title }) => {
  const navigate = useNavigate();
  let pageContent: React.ReactNode;
  
  if (title === "Privacy policy") {
    pageContent = <PrivacyPolicyContent />;
  } else if (title === "Sponsorship") {
    pageContent = <SponsorshipContent />;
  } else if (title === "About us") {
    pageContent = <AboutContent />;
  } else {
    pageContent = (
      <ContentCard title="Detailed Information Coming Soon">
        <p>We are currently updating our official documentation for {title}. Please check back later.</p>
      </ContentCard>
    );
  }

  return (
    <div className="text-[var(--text-primary)] space-y-4 max-w-5xl mx-auto font-poppins">
      <div className="flex justify-start mb-8 px-1">
          <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full px-5 py-2.5 shadow-sm">
                <ChevronLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Go back</span>
          </button>
      </div>
      <div className="px-1 text-left">
          <PageTitle title={title} className="mb-4" />
      </div>
      <div>
        {pageContent}
      </div>
    </div>
  );
};

export default PlaceholderContentPage;