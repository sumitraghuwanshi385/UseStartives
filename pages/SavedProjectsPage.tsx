import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { StartupIdea } from '../types';
import { ChevronLeftIcon, BookmarkIcon, timeAgo, GlobeAltIcon, ShoppingBagIcon } from '../constants';

const CompactWhitelistCard: React.FC<{ idea: StartupIdea }> = ({ idea }) => {
  const navigate = useNavigate();
  const { unsaveProject, getUserById } = useAppContext();
  const founder = useMemo(() => getUserById(idea.founderId), [idea.founderId, getUserById]);

  return (
    <article className="group relative bg-[var(--component-background)] rounded-2xl border border-[var(--border-primary)] transition-all duration-300 hover:border-purple-500/30 overflow-hidden cursor-pointer flex flex-col font-poppins shadow-none" onClick={() => navigate(idea.askingPrice ? `/asset/${idea.id}` : `/idea/${idea.id}`)}>
      <div className="absolute top-0 right-0 z-20">
        <button onClick={(e) => { e.stopPropagation(); unsaveProject(idea.id); }} className="w-10 h-10 rounded-bl-xl flex items-center justify-center bg-red-500 text-white border-l border-b border-red-600 transition-all hover:bg-red-600 shadow-none">
            <BookmarkIcon className="w-4 h-4" solid={true} />
        </button>
      </div>
      <div className="p-4 flex-grow flex flex-col text-left">
        <div className="flex gap-3 items-center mb-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[var(--border-primary)] bg-neutral-100 shadow-none">
                <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
                <h3 className="text-sm font-bold text-[var(--text-primary)] truncate tracking-tight group-hover:text-purple-500 transition-colors uppercase">{idea.title}</h3>
                <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">{idea.askingPrice ? 'Verified asset' : idea.stage}</p>
            </div>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4 font-medium opacity-80">{idea.tagline}</p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-primary)]">
            <div className="flex items-center gap-1.5">
                {founder && <img src={founder.profilePictureUrl} className="w-4 h-4 rounded-full object-cover border border-[var(--border-primary)] shadow-none" />}
                <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase">{timeAgo(idea.postedDate)}</span>
            </div>
            <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Details</span>
        </div>
      </div>
    </article>
  );
};

const SavedProjectsPage: React.FC = () => {
  const { startupIdeas, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ventures' | 'assets'>('ventures');

  if (!currentUser) return null;
  const savedProjects = startupIdeas.filter(idea => currentUser.savedProjectIds?.includes(idea.id) && !idea.askingPrice);
  const savedAssets = startupIdeas.filter(idea => currentUser.savedProjectIds?.includes(idea.id) && idea.askingPrice);

  return (
    <div className="max-w-6xl mx-auto pb-20 font-poppins">
      <div className="flex justify-start mb-8">
          <Link to="/dashboard" className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full px-5 py-2 shadow-none font-poppins">
            <ChevronLeftIcon className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
      </div>

      <div className="text-left mb-6 px-1">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tighter">Whitelist</h1>
        <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5 uppercase tracking-widest">Your curated collection of high-potential ventures.</p>
      </div>

      <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full overflow-hidden shadow-none">
              <button onClick={() => setActiveTab('ventures')} className={`px-12 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ventures' ? 'button-gradient text-white shadow-none' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Ventures</button>
              <button onClick={() => setActiveTab('assets')} className={`px-12 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assets' ? 'button-gradient text-white shadow-none' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Assets</button>
          </div>
      </div>

      {activeTab === 'ventures' ? (
          savedProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1">
                {savedProjects.map(idea => <CompactWhitelistCard key={idea.id} idea={idea} />)}
            </div>
          ) : (
            <div className="py-20 bg-[var(--component-background)] rounded-[3rem] border-2 border-dashed border-[var(--border-primary)] flex flex-col items-center font-poppins shadow-none">
                <GlobeAltIcon className="w-16 h-16 text-neutral-300 mb-4 shadow-none"/><p className="text-xs font-bold text-[var(--text-muted)] uppercase italic tracking-widest">Whitelist is empty</p>
            </div>
          )
      ) : (
          savedAssets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1">
                {savedAssets.map(asset => <CompactWhitelistCard key={asset.id} idea={asset} />)}
            </div>
          ) : (
            <div className="py-20 bg-[var(--component-background)] rounded-[3rem] border-2 border-dashed border-[var(--border-primary)] flex flex-col items-center font-poppins shadow-none">
                <ShoppingBagIcon className="w-16 h-16 text-neutral-300 mb-4 shadow-none"/><p className="text-xs font-bold text-[var(--text-muted)] uppercase italic tracking-widest">Asset list empty</p>
            </div>
          )
      )}
    </div>
  );
};

export default SavedProjectsPage;