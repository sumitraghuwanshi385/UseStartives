import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import { useAppContext } from '../contexts/AppContext';
import { StartupIdea, User } from '../types';
import { APP_NAME, timeAgo, ChevronLeftIcon } from '../constants';
import { NoResultsAnimatedGraphic } from './ProjectsListPage';

// --- Icons ---
const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const CubeIcon: React.FC<{className?: string}> = ({className = "w-5 h-5"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);
const UsersIcon: React.FC<{className?: string}> = ({className = "w-4 h-4"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);
const TrendingIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);
const HashtagIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
  </svg>
);
const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Helpers ---
const getInitials = (name?: string): string => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
};

const NoResultsFound = () => (
  <div className="text-center py-20 bg-[var(--component-background)] rounded-2xl border border-[var(--border-primary)] shadow-sm max-w-2xl mx-auto overflow-hidden relative">
    <div className="absolute inset-0 dot-pattern-bg opacity-10"></div>
    <NoResultsAnimatedGraphic />
    <h3 className="font-bold text-2xl text-[var(--text-primary)] uppercase tracking-tight relative z-10">No matches found</h3>
    <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto font-medium leading-relaxed relative z-10">
      We couldn't find anything matching your search. Please try using simpler words.
    </p>
  </div>
);

const TrendingCategoryCard: React.FC<{ category: string; onClick: () => void; }> = ({ category, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative group p-2 rounded-full overflow-hidden bg-[var(--component-background)] border border-[var(--border-primary)] text-left shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-purple-500/50"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--background-tertiary)] border border-[var(--border-primary)] text-purple-500 dark:text-purple-400">
          <HashtagIcon className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors pr-3">
          {category}
        </h3>
      </div>
    </button>
  );
};

const CompactUserCard: React.FC<{ user: User; actions: React.ReactNode; }> = ({ user, actions }) => (
  <div className="bg-[var(--component-background)] p-3 rounded-lg border border-[var(--border-primary)] flex items-center space-x-4 transition-all duration-300 transform hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600/50">
    <div className="w-12 h-12 rounded-full icon-bg-gradient flex items-center justify-center text-white font-bold text-xl border-2 border-[var(--border-secondary)]">
      {user.profilePictureUrl ? (
        <img src={user.profilePictureUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
      ) : (
        getInitials(user.name)
      )}
    </div>

    <div className="flex-grow overflow-hidden">
      <h3 className="font-semibold text-[var(--text-primary)] truncate">{user.name}</h3>
      <p className="text-sm text-[var(--text-muted)] truncate">{user.headline || 'Member on Startives'}</p>
    </div>

    <div className="flex-shrink-0 flex items-center gap-2">{actions}</div>
  </div>
);

const ProjectResultCard: React.FC<{ idea: StartupIdea }> = ({ idea }) => {
  const navigate = useNavigate();

  return (
    <article
      className="bg-[var(--component-background)] rounded-2xl border border-[var(--border-primary)] p-5 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/idea/${idea.id}`)}
    >
      <div className="flex items-center gap-3">
        {idea.imageUrl && (
          <img src={idea.imageUrl} alt={idea.title} className="w-12 h-12 rounded-xl object-cover border" />
        )}
        <div className="min-w-0">
          <h3 className="font-black uppercase truncate text-[var(--text-primary)]">{idea.title}</h3>
          <p className="text-xs text-[var(--text-muted)] italic truncate">{idea.tagline}</p>
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mt-3 line-clamp-3">{idea.description}</p>

      <div className="text-[10px] text-[var(--text-muted)] mt-3">
        {timeAgo(idea.postedDate)}
      </div>
    </article>
  );
};

const SearchPage: React.FC = () => {
  const { startupIdeas, users } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'users'>('projects');

  // NEW: backend project results
  const [projectResults, setProjectResults] = useState<StartupIdea[]>([]);
  const [isSearchingProjects, setIsSearchingProjects] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setQuery(q);
  }, [location.search]);

  const hasSearched = query.trim() !== '';

  useEffect(() => {
    if (!hasSearched) setActiveTab('projects');
  }, [hasSearched]);

  // ✅ Backend search for projects (debounced)
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setProjectResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingProjects(true);
        const res = await axios.get('/api/ideas', { params: { q } });
        if (res.data?.success) setProjectResults(res.data.ideas || []);
        else setProjectResults([]);
      } catch (e) {
        console.error('Search projects failed', e);
        setProjectResults([]);
      } finally {
        setIsSearchingProjects(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Users search remains local for now
  const filteredUsers = useMemo(() => {
    if (!hasSearched) return [];
    const queryLower = query.toLowerCase();

    const scoredUsers = users.map(user => {
      let score = 0;
      const nameLower = user.name.toLowerCase();
      if (nameLower === queryLower) score += 50;
      else if (nameLower.includes(queryLower)) score += 10;

      if ((user.skills || []).some(s => s.toLowerCase() === queryLower)) score += 20;
      else if ((user.skills || []).some(s => s.toLowerCase().includes(queryLower))) score += 5;

      if ((user.headline || '').toLowerCase().includes(queryLower)) score += 3;
      if ((user.bio || '').toLowerCase().includes(queryLower)) score += 1;

      return { user, score };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);

    return scoredUsers.map(item => item.user);
  }, [query, users, hasSearched]);

  const trendingCategories = useMemo(() => {
    const categoryCounts = startupIdeas.reduce((acc, idea) => {
      if (idea.category) acc[idea.category] = (acc[idea.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(entry => entry[0]).slice(0, 8);
  }, [startupIdeas]);

  const tabConfig: { key: 'projects' | 'users', label: string, icon: React.ReactElement, count: number }[] = [
    { key: 'projects', label: 'Projects', icon: <CubeIcon />, count: projectResults.length },
    { key: 'users', label: 'Innovators', icon: <UsersIcon />, count: filteredUsers.length }
  ];

  return (
    <div className="flex flex-col flex-grow bg-[var(--background-secondary)]">
      <div className="bg-[var(--background-secondary)]/80 backdrop-blur-md py-4 border-b border-[var(--border-primary)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {!hasSearched ? (
            <>
              <Link
                to="/dashboard"
                className="mb-4 inline-flex items-center space-x-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 group rounded-full px-2.5 py-1 bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] border border-[var(--border-primary)]"
              >
                <ChevronLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Back to Dashboard</span>
              </Link>

              <div className="max-w-3xl mt-4 mb-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                  Search <span className="bg-gradient-to-r from-red-500 to-blue-500 gradient-text">{APP_NAME}</span>
                </h1>
                <p className="text-[var(--text-muted)] mt-1 font-medium">Find projects, people, and skills.</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight">Search Results</h2>
              {isSearchingProjects && <span className="text-xs text-[var(--text-muted)]">Searching…</span>}
            </div>
          )}

          <div className="max-w-3xl">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5"/>
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search for innovators, projects, skills..."
                  className="w-full bg-[var(--component-background)] border border-[var(--border-secondary)] rounded-full pl-11 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none text-base shadow-sm font-medium"
                />
              </div>
              {hasSearched && (
                <button
                  onClick={() => setQuery('')}
                  className="p-3 rounded-full bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] text-[var(--text-muted)] border border-[var(--border-primary)] shadow-sm"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex-grow p-4 sm:p-6 lg:px-8">
        {hasSearched ? (
          <>
            <div className="mb-6 pb-4 border-b border-[var(--border-primary)] flex justify-start">
              <div className="bg-[var(--background-tertiary)] p-1 rounded-full flex space-x-1">
                {tabConfig.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2 px-3 text-sm rounded-full transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                      activeTab === tab.key
                        ? 'button-gradient text-white font-semibold shadow-md'
                        : 'text-[var(--text-muted)] hover:bg-[var(--component-background-hover)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {React.cloneElement(tab.icon, { className: 'w-4 h-4' })}
                    <span>{tab.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[var(--background-primary)] text-[var(--text-primary)]'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {(projectResults.length > 0 || filteredUsers.length > 0) ? (
              <div className="space-y-10">
                {activeTab === 'projects' && (
                  projectResults.length > 0 ? (
                    <section>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectResults.map(idea => <ProjectResultCard key={idea.id} idea={idea} />)}
                      </div>
                    </section>
                  ) : <NoResultsFound />
                )}

                {activeTab === 'users' && (
                  filteredUsers.length > 0 ? (
                    <section>
                      <div className="space-y-4">
                        {filteredUsers.map(user => (
                          <CompactUserCard
                            key={user.id}
                            user={user}
                            actions={<span className="text-xs text-[var(--text-muted)]">Local</span>}
                          />
                        ))}
                      </div>
                    </section>
                  ) : <NoResultsFound />
                )}
              </div>
            ) : <NoResultsFound />}
          </>
        ) : (
          <div className="space-y-10 max-w-3xl text-left">
            <section>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center uppercase tracking-tight">
                <TrendingIcon className="w-5 h-5 mr-2 text-purple-500" />
                Trending Topics
              </h2>
              <div className="flex flex-wrap justify-start gap-4">
                {trendingCategories.map(category => (
                  <TrendingCategoryCard key={category} category={category} onClick={() => setQuery(category)} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;