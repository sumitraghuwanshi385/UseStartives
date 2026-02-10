import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { StartupIdea } from '../types';
import {
  PencilSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  ChevronLeftIcon,
  GlobeAltIcon,
  timeAgo,
  BookmarkSquareIcon
} from '../constants';

// --- Empty State Graphics ---
const NoProjectsGraphic: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mb-4">
        <defs>
            <linearGradient id="projectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        <rect x="20" y="20" width="60" height="60" rx="12" fill="none" stroke="url(#projectGrad)" strokeWidth="2" strokeDasharray="5 5" />
        <path d="M50 35 V 65 M 35 50 H 65" stroke="url(#projectGrad)" strokeWidth="4" strokeLinecap="round">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
        </path>
    </svg>
);

const NoAssetsGraphic: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mb-4">
        <defs>
            <linearGradient id="assetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="35" fill="none" stroke="url(#assetGrad)" strokeWidth="2" strokeDasharray="6 4" />
        <path d="M40 50 L 48 58 L 65 42" stroke="url(#assetGrad)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <animateTransform attributeName="transform" type="scale" values="0.9;1.1;0.9" dur="4s" repeatCount="indefinite" additive="sum" />
        </path>
    </svg>
);

// --- Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-poppins" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-[var(--component-background)] p-8 rounded-[2.5rem] shadow-none w-full max-w-sm border border-[var(--border-primary)]" onClick={e => e.stopPropagation()}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <ExclamationTriangleIcon className="h-7 w-7 text-red-600 dark:text-red-400" />
        </div>
        <div className="text-center">
            <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight">{title}</h2>
            <div className="mt-2 text-[var(--text-muted)] text-sm font-medium leading-relaxed">{children}</div>
        </div>
        <div className="mt-8 flex flex-col gap-3">
           <button onClick={onConfirm} className="w-full py-4 text-xs font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 rounded-full transition-all">Confirm delete</button>
           <button onClick={onClose} className="w-full py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] rounded-full transition-all border border-[var(--border-primary)]">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const MyProjectListItem: React.FC<{ idea: StartupIdea; onDelete: (projectId: string) => void; }> = ({ idea, onDelete }) => {
    const navigate = useNavigate();
    const { applications } = useAppContext();
    const pendingApplications = applications.filter(app => app.ideaId === idea.id && app.status === 'Pending').length;
    const openPositions = idea.positions.filter(p => p.isOpen).length;

    return (
        <div className="bg-[var(--component-background)] rounded-[2rem] border border-[var(--border-primary)] p-5 transition-all duration-300 transform hover:border-purple-500/30 group font-poppins shadow-none">
            <div className="flex-grow w-full text-left">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[var(--border-primary)] shadow-none bg-neutral-100 shrink-0">
                             <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full inline-block mb-1">{idea.stage}</p>
                            <h3 onClick={() => navigate(`/idea/${idea.id}`)} className="text-xl font-bold tracking-tight text-[var(--text-primary)] hover:text-purple-500 cursor-pointer leading-tight">{idea.title}</h3>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/project/${idea.id}/edit`); }} className="p-2.5 rounded-full text-[var(--text-muted)] hover:text-purple-600 bg-[var(--background-tertiary)] border border-[var(--border-primary)] transition-all shadow-none"><PencilSquareIcon className="w-5 h-5" /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(idea.id); }} className="p-2.5 rounded-full text-[var(--text-muted)] hover:text-red-600 bg-[var(--background-tertiary)] border border-[var(--border-primary)] transition-all shadow-none"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 my-4 font-medium italic opacity-80">{idea.tagline}</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-[var(--border-primary)] pt-4 gap-4">
                    <div className="flex items-center space-x-8">
                        <div>
                            <p className="font-black text-2xl text-purple-600">{pendingApplications}</p>
                            <p className="text-[8px] font-black tracking-widest text-[var(--text-muted)] uppercase">New applications</p>
                        </div>
                        <div>
                            <p className="font-black text-2xl text-sky-500">{openPositions}</p>
                            <p className="text-[8px] font-black tracking-widest text-[var(--text-muted)] uppercase">Open roles</p>
                        </div>
                    </div>
                    <Link to="/my-applications?tab=received" className="bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-300 text-[10px] font-black uppercase tracking-widest py-2 px-5 rounded-full hover:bg-purple-200 transition-all border border-purple-200 dark:border-purple-800/30">Manage applicants</Link>
                </div>
            </div>
        </div>
    );
};

const MyAssetListItem: React.FC<{ idea: StartupIdea; onDelete: (projectId: string) => void; }> = ({ idea, onDelete }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-[var(--component-background)] rounded-[2rem] border border-[var(--border-primary)] p-5 transition-all duration-300 transform hover:border-orange-500/30 group font-poppins shadow-none">
            <div className="flex-grow w-full text-left">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[var(--border-primary)] shadow-none bg-neutral-100 shrink-0">
                             <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full inline-block mb-1">Asset</p>
                            <h3 onClick={() => navigate(`/asset/${idea.id}`)} className="text-xl font-bold tracking-tight text-[var(--text-primary)] hover:text-orange-500 cursor-pointer leading-tight">{idea.title}</h3>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/asset/${idea.id}/edit`); }} className="p-2.5 rounded-full text-[var(--text-muted)] hover:text-orange-600 bg-[var(--background-tertiary)] border border-[var(--border-primary)] transition-all shadow-none"><PencilSquareIcon className="w-5 h-5" /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(idea.id); }} className="p-2.5 rounded-full text-[var(--text-muted)] hover:text-red-600 bg-[var(--background-tertiary)] border border-[var(--border-primary)] transition-all shadow-none"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 my-4 font-medium italic opacity-80">{idea.tagline}</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-[var(--border-primary)] pt-4 gap-4">
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <p className="font-black text-xl text-emerald-600">{idea.askingPrice}</p>
                            <p className="text-[8px] font-black tracking-widest text-[var(--text-muted)] uppercase">Asking</p>
                        </div>
                        <div>
                            <p className="font-black text-xl text-purple-600">{idea.mrr || '$0'}</p>
                            <p className="text-[8px] font-black tracking-widest text-[var(--text-muted)] uppercase">Mrr</p>
                        </div>
                        <div>
                            <p className="font-black text-xl text-sky-500">{idea.multiplier || 'N/A'}</p>
                            <p className="text-[8px] font-black tracking-widest text-[var(--text-muted)] uppercase">Multiple</p>
                        </div>
                    </div>
                    <Link to={`/asset/${idea.id}`} className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 text-[10px] font-black uppercase tracking-widest py-2 px-5 rounded-full hover:bg-orange-200 transition-all border border-orange-200 dark:border-orange-800/30">View listing</Link>
                </div>
            </div>
        </div>
    );
};

const MyProjectsPage: React.FC = () => {
  const { startupIdeas, currentUser, deleteIdea } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'assets'>('projects');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  if (!currentUser) return null;
  
  const myProjects = useMemo(() => startupIdeas.filter(idea => idea.founderEmail === currentUser.email && !idea.askingPrice), [startupIdeas, currentUser.email]);
  const myAssets = useMemo(() => startupIdeas.filter(idea => idea.founderEmail === currentUser.email && idea.askingPrice), [startupIdeas, currentUser.email]);

  const confirmDelete = () => {
    if(itemToDelete) { deleteIdea(itemToDelete); setItemToDelete(null); }
    setIsModalOpen(false);
  };
  
  return (
    <div className="pb-20 max-w-6xl mx-auto">
      <div className="flex justify-start mb-8">
          <Link to="/dashboard" className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full px-5 py-2 font-poppins shadow-none">
            <ChevronLeftIcon className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
      </div>

      <div className="text-left mb-6 font-poppins px-1">
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tighter">Ventures</h1>
          <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5 uppercase tracking-widest">Manage your ventures and digital assets in one place.</p>
      </div>

      <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full shadow-none font-poppins">
              <button onClick={() => setActiveTab('projects')} className={`px-12 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'projects' ? 'button-gradient text-white shadow-none' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Projects</button>
              <button onClick={() => setActiveTab('assets')} className={`px-12 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'assets' ? 'button-gradient text-white shadow-none' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Assets</button>
          </div>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {activeTab === 'projects' ? (
          myProjects.length > 0 ? (
            myProjects.map(idea => <MyProjectListItem key={idea.id} idea={idea} onDelete={(id) => { setItemToDelete(id); setIsModalOpen(true); }} />)
          ) : (
            <div className="text-center py-20 bg-[var(--component-background)] rounded-[3rem] border-2 border-dashed border-[var(--border-primary)] flex flex-col items-center font-poppins shadow-none">
                <NoProjectsGraphic />
                <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest italic">No active projects listed</p>
                <Link to="/post-idea" className="mt-4 inline-block text-purple-600 font-black uppercase text-[10px] hover:underline">Post your first idea</Link>
            </div>
          )
        ) : (
           myAssets.length > 0 ? (
            myAssets.map(asset => <MyAssetListItem key={asset.id} idea={asset} onDelete={(id) => { setItemToDelete(id); setIsModalOpen(true); }} />)
          ) : (
            <div className="text-center py-20 bg-[var(--component-background)] rounded-[3rem] border-2 border-dashed border-[var(--border-primary)] flex flex-col items-center font-poppins shadow-none">
                <NoAssetsGraphic />
                <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest italic">No assets enrolled</p>
                <Link to="/submit-asset" className="mt-4 inline-block text-orange-500 font-black uppercase text-[10px] hover:underline">List an asset for sale</Link>
            </div>
          )
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmDelete} title="Permanent removal">
        Are you sure? This action will remove all project history and associated data forever.
      </Modal>
    </div>
  );
};

export default MyProjectsPage;