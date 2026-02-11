import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAppContext } from '../contexts/AppContext';
import { StartupIdea } from '../types';
import {
  timeAgo,
  STARTUP_CATEGORIES,
  BookmarkSquareIcon,
  WORK_MODES,
  COUNTRIES,
  MagnifyingGlassIcon as SearchIcon,
} from '../constants';

// --- Icons ---
const BookmarkIcon: React.FC<{ className?: string; solid?: boolean }> = ({ className = "w-5 h-5", solid }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={solid ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
);
const ChevronDownIconUI: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);
const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// Custom Filter Icons
const GrowthIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);
const TagIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);
const MapPinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-full transition-all duration-300 border shadow-none
          ${isOpen ? 'bg-white dark:bg-neutral-800 border-purple-500' : 'bg-gray-100 dark:bg-neutral-800 border-transparent hover:border-purple-500/50'}
          text-[var(--text-primary)] focus:outline-none min-w-[100px] font-poppins`}
      >
        <span className="flex-shrink-0 text-purple-600 dark:text-purple-400">{icon}</span>
        <span className="truncate max-w-[80px]">
          {selectedOption && selectedOption.value !== 'All' ? selectedOption.label : label}
        </span>
        <ChevronDownIconUI className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 max-h-80 bg-[var(--component-background)] backdrop-blur-xl border border-[var(--border-primary)] rounded-2xl shadow-2xl z-[100] overflow-hidden font-poppins">
          <div className="overflow-y-auto max-h-80 p-2 custom-scrollable">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all duration-200 flex items-center justify-between group
                  ${value === option.value ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold' : 'text-[var(--text-secondary)] hover:bg-[var(--component-background-hover)] hover:text-[var(--text-primary)]'}`}
              >
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

// --- Project Card Component (same as you had, unchanged) ---
const ProjectCard: React.FC<{ idea: StartupIdea }> = ({ idea }) => {
  const navigate = useNavigate();
  const { saveProject, unsaveProject, isProjectSaved, currentUser, getUserById } = useAppContext();
  const isSaved = currentUser ? isProjectSaved(idea.id) : false;
  const founder = useMemo(() => getUserById(idea.founderId), [idea.founderId, getUserById]);

  return (
    <article
      className="group relative bg-[var(--component-background)] rounded-2xl border border-[var(--border-primary)] transition-all duration-500 hover:border-purple-500/30 overflow-hidden cursor-pointer flex flex-col h-full shadow-none font-poppins"
      onClick={() => navigate(`/idea/${idea.id}`)}
    >
      <div className="absolute top-0 left-0 z-20">
        <span className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-br-2xl border-r border-b border-[var(--border-primary)] bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300 shadow-none inline-block">
          {idea.stage}
        </span>
      </div>

      <div className="absolute top-0 right-0 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!currentUser) { navigate('/login'); return; }
            isSaved ? unsaveProject(idea.id) : saveProject(idea.id);
          }}
          className={`w-12 h-12 rounded-bl-2xl flex items-center justify-center transition-all duration-300 border-l border-b border-[var(--border-primary)]
            ${isSaved ? 'bg-red-500 text-white border-red-600' : 'bg-white dark:bg-neutral-950 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10'}`}
        >
          <BookmarkIcon className="w-5 h-5" solid={isSaved} />
        </button>
      </div>

      <div className="px-5 pt-14 pb-5 flex-grow flex flex-col">
        <div className="flex gap-4 items-center mb-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-[var(--border-primary)] shadow-none group-hover:scale-105 transition-transform duration-500 bg-neutral-100 dark:bg-neutral-800">
            {idea.imageUrl ? (
              <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] bg-neutral-200 dark:bg-neutral-700">
                <BookmarkSquareIcon className="w-8 h-8 opacity-40" />
              </div>
            )}
          </div>

          <div className="flex-grow overflow-hidden">
            <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight group-hover:text-purple-600 transition-colors line-clamp-1 tracking-tight uppercase">
              {idea.title}
            </h3>
            <p className="text-xs text-[var(--text-muted)] italic line-clamp-1 mt-0.5">{idea.tagline}</p>
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)] line-clamp-4 leading-relaxed mb-6 font-medium opacity-80 flex-grow">
          {idea.description}
        </p>

        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {[
            { label: 'Category', val: idea.category || 'Venture' },
            { label: 'Model', val: idea.businessModel || 'Other' },
            { label: 'Mode', val: idea.workMode || 'N/A' },
            { label: 'Base', val: idea.location ? idea.location.split(',')[0] : 'Global' }
          ].map(item => (
            <div key={item.label} className="flex items-center justify-center bg-gray-50 dark:bg-neutral-900 rounded-xl border border-[var(--border-primary)] shadow-none group-hover:border-purple-500/30 transition-all text-center py-1.5 px-1 overflow-hidden">
              <div className="flex flex-col items-center w-full">
                <span className="text-[7px] text-[var(--text-muted)] uppercase font-black tracking-widest leading-none mb-1">{item.label}</span>
                <span className="text-[9px] font-bold text-[var(--text-primary)] leading-none truncate w-full">{item.val}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2.5 mt-auto border-t border-[var(--border-primary)] pt-4">
          <h4 className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">Open Positions</h4>
          <div className="flex flex-wrap gap-1.5">
            {idea.positions.slice(0, 2).map(pos => (
              <span key={pos.id} className="text-[9px] font-black tracking-tight bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-3 py-1 rounded-full border border-[var(--border-primary)] shadow-none uppercase">
                {pos.title}
              </span>
            ))}
            {idea.positions.length > 2 && (
              <span className="text-[9px] font-black text-purple-600 dark:text-purple-400 py-1 px-1">
                +{idea.positions.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-5 py-4 bg-gray-50/50 dark:bg-neutral-900/30 border-t border-[var(--border-primary)] transition-colors group-hover:bg-purple-50/20 dark:group-hover:bg-purple-900/5">
        <div className="flex items-center gap-2">
          {founder && (
            <div className="flex items-center space-x-2 group/founder hover:opacity-80 transition-opacity" onClick={(e) => { e.stopPropagation(); navigate(`/user/${idea.founderId}`); }}>
              <img
                src={founder.profilePictureUrl || `https://i.pravatar.cc/150?u=${founder.id}`}
                className="w-5 h-5 rounded-full object-cover ring-2 ring-white dark:ring-neutral-800 shadow-none"
              />
              <span className="text-xs font-black text-[var(--text-secondary)]">{founder.name.split(' ')[0]}</span>
            </div>
          )}
          <span className="text-[10px] text-[var(--text-muted)] font-bold flex items-center gap-1.5">
            <span className="opacity-30">•</span>
            {timeAgo(idea.postedDate)}
          </span>
        </div>

        <div className="flex items-center text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest gap-1 group-hover:translate-x-1 transition-transform">
          Details
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </article>
  );
};

// keep your exported graphic
export const NoResultsAnimatedGraphic: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 relative overflow-hidden h-64 mx-auto w-full">
    <svg width="240" height="240" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="no-res-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <g transform="translate(100, 95)">
        <circle cx="0" cy="0" r="35" stroke="url(#no-res-grad)" strokeWidth="3" opacity="0.1" />
        <circle cx="0" cy="0" r="28" stroke="url(#no-res-grad)" strokeWidth="4" strokeDasharray="5 10">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="12s" repeatCount="indefinite" />
        </circle>
        <g transform="translate(-15, -15)">
          <path d="M22 22 L35 35" stroke="url(#no-res-grad)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
          <circle cx="12" cy="12" r="12" stroke="url(#no-res-grad)" strokeWidth="4" />
        </g>
      </g>
    </svg>
  </div>
);

const ProjectsListPage: React.FC = () => {
  const { startupIdeas, isLoading: appLoading } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ stage: 'All', category: 'All', location: 'All' });

  // ✅ NEW: backend results
  const [results, setResults] = useState<StartupIdea[]>([]);
  const [isFetching, setIsFetching] = useState(false);

// ✅ ADD THIS
const displayIdeas =
  searchTerm ||
  filters.stage !== 'All' ||
  filters.category !== 'All' ||
  filters.location !== 'All'
    ? results
    : startupIdeas;

  // ✅ Fetch from backend whenever search/filters change (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setIsFetching(true);

        const params: any = {};
        if (searchTerm.trim()) params.q = searchTerm.trim();
        if (filters.category !== 'All') params.category = filters.category;
        if (filters.stage !== 'All') params.stage = filters.stage;
        if (filters.location !== 'All') params.location = filters.location;

        const res = await axios.get('/api/ideas', { params });
        if (res.data?.success) setResults(res.data.ideas || []);
        else setResults([]);
      } catch (e) {
        console.error('Fetch filtered ideas failed', e);
        setResults([]);
      } finally {
        setIsFetching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  const totalProjects = startupIdeas.length;
  const newThisWeek = startupIdeas.filter(
    (i) => new Date(i.postedDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).length;

  if (appLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background-secondary)] min-h-screen font-poppins">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        <div className="text-left mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-startives-brand tracking-tighter text-[var(--text-primary)]">Discover Projects</h1>
              <p className="text-lg text-[var(--text-secondary)] font-medium mt-1">Find your next challenge and build something incredible.</p>
              {isFetching && <p className="text-xs text-[var(--text-muted)] mt-2">Loading filtered results…</p>}
            </div>

            <div className="flex items-center gap-6 button-gradient text-white px-6 py-2.5 rounded-full border border-white/10 inline-flex shadow-none overflow-hidden relative">
              <div className="flex items-center gap-2 relative z-10">
                <p className="text-[8px] font-black uppercase text-white/70 tracking-widest">Total Projects</p>
                <p className="text-sm font-black">{totalProjects}</p>
              </div>
              <div className="w-px h-4 bg-white/20 relative z-10"></div>
              <div className="flex items-center gap-2 relative z-10">
                <p className="text-[8px] font-black uppercase text-white/70 tracking-widest">New This Week</p>
                <p className="text-sm font-black">{newThisWeek}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex justify-center">
          <div className="relative group max-w-2xl w-full">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-[var(--text-muted)]" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="block w-full pl-12 pr-6 py-4 bg-[var(--component-background)] border border-[var(--border-primary)] rounded-full shadow-none focus:border-purple-500 outline-none transition-all text-base font-medium"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-[68px] z-30 bg-[var(--background-secondary)]/80 backdrop-blur-lg -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-8 border-b border-[var(--border-primary)]">
          <div className="flex flex-wrap justify-center gap-3">
            <CustomDropdown
              label="All stages"
              icon={<GrowthIcon />}
              value={filters.stage}
              onChange={(v) => setFilters((f) => ({ ...f, stage: v }))}
              options={['All', 'Idea Stage', 'Validation Stage', 'MVP Stage', 'Pre-Seed Stage', 'Fundraising Stage', 'Scaling Stage', 'Launched', 'Acquired'].map(s => ({ value: s, label: s }))}
            />

            <CustomDropdown
              label="All categories"
              icon={<TagIcon />}
              value={filters.category}
              onChange={(v) => setFilters((f) => ({ ...f, category: v }))}
              options={['All', ...STARTUP_CATEGORIES].map(s => ({ value: s, label: s }))}
            />

            <CustomDropdown
              label="All locations"
              icon={<MapPinIcon />}
              value={filters.location}
              onChange={(v) => setFilters((f) => ({ ...f, location: v }))}
              options={['All', ...COUNTRIES.map(c => c.name)].map(s => ({ value: s, label: s }))}
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {displayIdeas.length > 0 ? (
  displayIdeas.map((idea) => <ProjectCard key={idea.id} idea={idea} />)
) : (

            <div className="col-span-full text-center py-20 bg-[var(--component-background)] rounded-3xl border-2 border-dashed border-[var(--border-primary)] p-12 overflow-hidden relative shadow-none">
              <div className="absolute inset-0 dot-pattern-bg opacity-10"></div>
              <NoResultsAnimatedGraphic />
              <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4 tracking-tighter uppercase">No matches found</h2>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ stage: 'All', category: 'All', location: 'All' });
                }}
                className="mt-10 px-8 py-3 button-gradient text-white rounded-full text-sm font-black tracking-widest uppercase shadow-none hover:scale-105 transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsListPage;