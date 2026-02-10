
import React from 'react';
import { User, StartupIdea, Position, StartupCategory, BusinessModel, WorkMode, Startalk } from './types'; 

export const APP_NAME = "Startives";

// --- BUSINESS MODELS ---
export const BUSINESS_MODELS: BusinessModel[] = ['B2B', 'B2C', 'B2B2C', 'C2C', 'D2C', 'Other'];

// --- WORK MODES ---
export const WORK_MODES: WorkMode[] = ['Remote', 'Hybrid', 'On-site'];

// --- STARTUP CATEGORIES ---
export const STARTUP_CATEGORIES: StartupCategory[] = [
  'AI/ML', 'SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce & Retail', 'Marketplace', 'Creator Economy', 
  'Social Media & Networking', 'Gaming & eSports', 'Sustainability & Climate Tech', 'Clean Energy', 'AgriTech', 
  'FoodTech', 'Biotechnology', 'Cybersecurity', 'DevTools', 'No-Code/Low-Code', 'AR/VR', 'IoT', 'Robotics & Drones', 
  '3D Printing', 'Blockchain & Web3', 'Future of Work', 'HR Tech', 'PropTech', 'LegalTech', 'GovTech', 'InsurTech', 
  'Travel & Hospitality', 'Media & Entertainment', 'Logistics & Supply Chain', 'Transportation & Mobility', 
  'Wellness & Fitness', 'Mental Health', 'FemTech', 'Hardware', 'SpaceTech', 'Non-Profit', 'Other'
];

// --- COUNTRIES ---
export const COUNTRIES = [
  { name: 'United States', code: 'US' }, { name: 'United Kingdom', code: 'GB' }, { name: 'Canada', code: 'CA' }, { name: 'Germany', code: 'DE' }, { name: 'France', code: 'FR' }, { name: 'Japan', code: 'JP' }, { name: 'China', code: 'CN' }, { name: 'India', code: 'IN' }, { name: 'Brazil', code: 'BR' }, { name: 'Australia', code: 'AU' }, { name: 'Netherlands', code: 'NL' }, { name: 'Spain', code: 'ES' }, { name: 'Italy', code: 'IT' }, { name: 'Switzerland', code: 'CH' }, { name: 'Sweden', code: 'SE' }, { name: 'Norway', code: 'NO' }, { name: 'Denmark', code: 'DK' }, { name: 'Finland', code: 'FI' }, { name: 'Ireland', code: 'IE' }, { name: 'Singapore', code: 'SG' }, { name: 'South Korea', code: 'KR' }, { name: 'Israel', code: 'IL' }, { name: 'United Arab Emirates', code: 'AE' }, { name: 'South Africa', code: 'ZA' }, { name: 'Mexico', code: 'MX' }, { name: 'Argentina', code: 'AR' }, { name: 'Portugal', code: 'PT' }, { name: 'Belgium', code: 'BE' }, { name: 'Austria', code: 'AT' }, { name: 'Poland', code: 'PL' }
];

export const getFlagEmoji = (countryName?: string) => {
  if (!countryName) return '🌐';
  const country = COUNTRIES.find(c => c.name === countryName);
  if (!country) return '🌐';
  const codePoints = country.code.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export const timeAgo = (date: string | number | Date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
};

// --- ICONS ---
const h = React.createElement;

export const CurrencyDollarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
    )
);

export const ChartBarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" })
    )
);

export const EnvelopeOpenIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 9V19.5A2.25 2.25 0 0119.5 21.75H4.5A2.25 2.25 0 012.25 19.5V9m0 0V6.75A2.25 2.25 0 014.5 4.5h15A2.25 2.25 0 0121.75 6.75v2.25m0 0l-7.5 4.615L2.25 9.002" })
  )
);

export const AppContextLinkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" })
    )
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 19.5L8.25 12l7.5-7.5" })
  )
);

export const BoltIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" })
    )
);

export const IdentificationIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0z" })
    )
);

export const UserPlusIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" })
    )
);

export const PhotoIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" })
    )
);

export const IdeaStarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( 
    h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: className },
        h("path", { d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2l-2.81 6.63-7.19.61L7.46 13.97l-1.64 7.03L12 17.27z" })
    )
);

export const UsersIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" })
    )
);

export const TwitterXIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: className },
        h("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
    )
);

export const AppContextBriefcaseIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25v-4.073M15.75 8.108V6.75a2.25 2.25 0 00-2.25-2.25h-3.75a2.25 2.25 0 00-2.25 2.25v1.358M17.25 8.108a2.25 2.25 0 01-2.25 2.25h-5.25a2.25 2.25 0 01-2.25-2.25" })
    )
);

export const AppContextChatBubbleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.861 8.25-8.625 8.25S3.75 16.556 3.75 12C3.75 7.444 7.361 3.75 12.375 3.75S21 7.444 21 12zM12 18.75v.008" })
    )
);

export const AppContextLinkIconHero: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" })
    )
);

export const GlobeAltIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" }),
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 12h19.5" }),
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 2.25c2.4 2.8 3.75 6.4 3.75 9.75s-1.35 6.95-3.75 9.75M12 2.25c-2.4 2.8-3.75 6.4-3.75 9.75s1.35 6.95 3.75 9.75" })
  )
);

export const MAP_PIN_ICON_HERO: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" }),
        h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" })
    )
);

// Map pin alias
export const MapPinIconHero = MAP_PIN_ICON_HERO;

export const LinkedInLogoIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { fill: "currentColor", viewBox: "0 0 24 24", className: className },
    h("path", { d: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" })
  )
);

export const GithubLogoIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { fill: "currentColor", viewBox: "0 0 24 24", className: className },
    h("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" })
  )
);

export const XLogoIcon = TwitterXIcon;
export const FacebookLogoIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { fill: "currentColor", viewBox: "0 0 24 24", className: className },
    h("path", { d: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" })
  )
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.25 4.5l7.5 7.5-7.5 7.5" })
  )
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.567L16.5 21.75l-.398-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.398a2.25 2.25 0 00-1.423 1.423z" })
  )
);

export const ShoppingBagIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" })
  )
);

export const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" })
  )
);

export const ChatBubbleBottomCenterTextIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" })
  )
);

export const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" })
  )
);

export const UserCircleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 016 0z" })
  )
);

export const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" })
  )
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { fill: "currentColor", viewBox: "0 0 24 24", className: className },
    h("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" })
  )
);

export const BookmarkSquareIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 3.75V16.5L12 14.25L7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" })
  )
);

export const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" })
  )
);

export const ClipboardDocumentListIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 18 4.5h-1.125m-10.5 0h-1.5A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5h1.125m10.5-15v-.375a3.375 3.375 0 0 0-3.375-3.375h-1.5a3.375 3.375 0 00-3.375 3.375v.375m10.5 0H5.625" })
  )
);

export const BookmarkIcon: React.FC<{ className?: string; solid?: boolean }> = ({ className = "w-5 h-5", solid }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: solid ? "currentColor" : "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" })
  )
);

export const PencilSquareIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" })
  )
);

export const LinkIconHero = AppContextLinkIconHero;
export const AcademicCapIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" })
  )
);

export const HeartIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" })
  )
);

export const PlusCircleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" })
  )
);

export const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" })
  )
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" }),
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
  )
);

export const InboxStackIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25-3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" })
  )
);

export const UsersIconHero = UsersIcon;
export const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 3h.008v.008H12V18zm-3-6h.008v.008H9v-.008zM9 15h.008v.008H9V15zm0 3h.008v.008H9V18zm6-6h.008v.008H15v-.008zM15 15h.008v.008H15V15zm0 3h.008v.008H15V18z" })
  )
);

export const PhoneIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.125-5.125-3.426-6.25-6.25l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" })
  )
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  h("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: className },
    h("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" })
  )
);

// Correct Export of MOCK_STARTALKS to avoid SyntaxError
export const MOCK_STARTALKS: Startalk[] = [
  {
    id: 'talk1',
    authorId: 'user-julian-marks',
    authorName: 'Julian Marks',
    authorAvatar: 'https://i.pravatar.cc/150?u=julianmarks',
    authorHeadline: 'Product @ Stealth',
    content: 'Just validated our MVP landing page with 100 beta signups. The momentum is real! 🚀',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    reactions: { '🚀': 12, '💯': 5 },
    currentUserReaction: undefined
  }
];

export const MOCK_USERS_RAW: User[] = [
    {
        id: 'user-john-smith',
        name: 'John Smith',
        email: 'john.smith@example.com',
        headline: 'Full-Stack Developer | Building SaaS',
        country: 'United States',
        profilePictureUrl: 'https://i.pravatar.cc/150?u=johnsmith',
        savedProjectIds: ['idea-1-mock'],
        bio: "Passionate developer with 8 years of experience building scalable web applications. Currently focused on AI-driven products."
    },
    {
        id: 'user-maria-garcia',
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        headline: 'UX Designer | Startup Advisor',
        country: 'Spain',
        profilePictureUrl: 'https://i.pravatar.cc/150?u=mariagarcia',
        savedProjectIds: [],
        bio: "Designing digital experiences that people love. Helping early-stage founders find their product-market fit."
    },
    {
        id: 'user-julian-marks',
        name: 'Julian Marks',
        email: 'julian.marks@example.com',
        headline: 'Product Lead | Ex-Google',
        country: 'United Kingdom',
        profilePictureUrl: 'https://i.pravatar.cc/150?u=julianmarks',
        savedProjectIds: ['idea-2-mock'],
        bio: "Strategic product leader with a track record of launching successful mobile apps. Love mentoring new founders."
    },
    {
        id: 'user-jane-doe',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        headline: 'Marketing Specialist | Growth Hacker',
        country: 'Canada',
        profilePictureUrl: 'https://i.pravatar.cc/150?u=janedoe',
        savedProjectIds: [],
        bio: "Growth-focused marketer specializing in acquisition and retention strategies for early-stage startups."
    }
];

export const SAMPLE_STARTUP_IDEAS_RAW: any[] = [
  {
    title: 'EcoRoute Planner',
    tagline: 'Sustainable travel routes at your fingertips.',
    description: 'A map-based application that calculates the lowest carbon footprint routes for multi-modal travel across Europe, factoring in real-time public transit data, bike-sharing availability, and walking paths. Our mission is to make sustainable travel the most convenient option.',
    problem: 'Travelers lack a unified tool to plan journeys that are both efficient and environmentally friendly. Existing map services prioritize speed or cost, but rarely carbon footprint across multiple transport modes.',
    buildingNow: 'We are currently integrating with several major European public transit APIs and refining our proprietary carbon calculation algorithm. Our beta is focused on Berlin, Paris, and Amsterdam.',
    founderQuote: 'As a frequent traveler, I was frustrated by how difficult it was to make eco-conscious travel choices. I started EcoRoute to empower everyone to explore the world more sustainably.',
    founderName: 'Julian Marks',
    tags: ['Sustainability', 'Travel', 'Maps', 'SaaS', 'GreenTech'],
    category: 'Sustainability & Climate Tech',
    stage: 'MVP Stage',
    businessModel: 'B2C',
    workMode: 'Remote',
    location: 'Germany',
    techStack: ['React Native', 'Mapbox', 'Node.js', 'PostgreSQL', 'GCP'],
    positionsData: [
        { 
            title: 'Lead Frontend Developer', 
            description: 'Experience with React and Mapbox is essential. You will lead the development of our core mapping interface and user experience.', 
            type: 'Equity', 
            equityOffered: '2% - 5%',
            skills: ['React', 'Mapbox', 'Tailwind', 'TypeScript'],
            questions: ['Link your portfolio/GitHub.', 'What is your experience with geospatial data?', 'Describe a challenging UI you have built.'] 
        },
        { 
            title: 'Marketing Specialist', 
            description: 'Looking for someone to lead our pre-launch campaign and build our community of sustainable travelers.', 
            type: 'Flexible', 
            skills: ['Growth Hacking', 'SEO', 'Content Marketing', 'Community Management'],
            questions: ['Describe a successful campaign you led for a B2C product.', 'What tools do you use for analytics and user engagement?']
        }
    ]
  },
  {
    title: 'SEOX Automator',
    tagline: 'Automate your technical SEO audits.',
    description: 'An AI-powered dashboard that identifies and fixes technical SEO issues in real-time, integrating directly with CMS platforms like WordPress and Shopify. It provides actionable insights and automated fixes for common problems.',
    problem: 'Technical SEO is complex, time-consuming, and requires specialized knowledge. Small businesses and marketing teams struggle to keep up with constant algorithm changes and site maintenance.',
    buildingNow: 'Our core AI engine is built and can successfully crawl sites up to 10,000 pages. We are currently developing a WordPress plugin for one-click integration and automated fixes.',
    founderQuote: 'I spent years manually auditing websites for clients. I knew there had to be a smarter, faster way, so I built SEOX Automator to put the power of a technical SEO expert into an affordable SaaS.',
    founderName: 'John Smith',
    tags: ['AI', 'SEO', 'Marketing', 'B2B', 'SaaS'],
    category: 'AI/ML',
    stage: 'Idea Stage',
    businessModel: 'B2B',
    workMode: 'Hybrid',
    location: 'United States',
    techStack: ['Python', 'FastAPI', 'Vue.js', 'Celery', 'Redis'],
    positionsData: [
        { 
            title: 'Python Backend Dev', 
            description: 'Work on our core analysis engine, improve crawling capabilities, and develop new AI-driven SEO checks.', 
            type: 'Paid', 
            salaryRange: '$80k - $110k',
            skills: ['Python', 'Django', 'FastAPI', 'Web Scraping', 'NLP'],
            questions: ['Have you built web crawlers before? Describe the architecture.', 'What experience do you have with NLP libraries like spaCy or NLTK?'] 
        }
    ]
  },
  {
    title: 'CodeConnect',
    tagline: 'The mentorship platform for developers.',
    description: 'A dedicated platform connecting junior developers with experienced senior mentors for 1-on-1 guidance, code reviews, and career advice. We aim to bridge the experience gap in the tech industry.',
    problem: 'Junior developers often lack access to quality mentorship, hindering their growth. Senior developers are willing to help but lack a structured platform to connect and manage mentorship sessions.',
    buildingNow: 'We are building our matching algorithm based on skills, career goals, and communication styles. The platform will include integrated video chat and a code-sharing environment.',
    founderQuote: 'I wouldn\'t be where I am today without my mentors. CodeConnect is my way of paying it forward and scaling the impact of mentorship for the next generation of developers.',
    founderName: 'Maria Garcia',
    tags: ['EdTech', 'DevTools', 'Community', 'Marketplace'],
    category: 'EdTech',
    stage: 'Validation Stage',
    businessModel: 'C2C',
    workMode: 'Remote',
    location: 'Spain',
    techStack: ['Next.js', 'TypeScript', 'GraphQL', 'Firebase', 'WebRTC'],
    positionsData: [
        {
            title: 'Founding UX/UI Designer',
            description: 'Shape the entire user journey for both mentors and mentees. Create an intuitive and engaging experience from onboarding to session completion.',
            type: 'Equity',
            equityOffered: '5% - 10%',
            skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
            questions: ['What is your design process for a new platform?', 'Share a link to your portfolio.']
        }
    ]
  },
  {
    title: 'FitTrack Pro',
    tagline: 'Next-gen gym management SaaS.',
    description: 'Cloud-based gym management software featuring automated billing, member retention AI, and integrated workout tracking.',
    founderName: 'Jane Doe',
    tags: ['Fitness', 'SaaS', 'Management'],
    category: 'Wellness & Fitness',
    stage: 'Launched',
    businessModel: 'B2B',
    workMode: 'Remote',
    location: 'Canada',
    askingPrice: '$45,000',
    ttmRevenue: '$12k',
    mrr: '$1.2k',
    multiplier: '3.8x',
    growth: '+15%',
    revenueModel: 'Subscription',
    reasonForSale: "Founder is moving into a new B2B venture in a different industry and can no longer dedicate time to this project.",
    handoverNotes: "Includes full source code, customer list (15 active gyms), social media accounts, and 30 days of post-sale support.",
    positionsData: []
  },
];
