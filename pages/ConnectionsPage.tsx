import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { User, AppNotification } from '../types'; 
import { UserPlusIcon, ChevronLeftIcon, EnvelopeOpenIcon, PaperAirplaneIcon, UsersIcon as UsersIconSolid } from '../constants';

// --- Icons ---
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ClockIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
);
const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);
const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
);

// --- Empty State Graphics ---
const NoConnectionsGraphic: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="connectGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--accent-primary)' }} />
                <stop offset="100%" style={{ stopColor: 'var(--accent-secondary)' }} />
            </linearGradient>
        </defs>
        <circle cx="25" cy="30" r="10" fill="url(#connectGradient)" opacity="0.8" />
        <circle cx="75" cy="30" r="10" fill="url(#connectGradient)" opacity="0.8" />
        <circle cx="50" cy="70" r="12" fill="url(#connectGradient)" />
        <path d="M 30 38 L 45 60" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-neutral-600" />
        <path d="M 70 38 L 55 60" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-neutral-600" />
        <path d="M 35 30 H 65" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-neutral-600" strokeDasharray="4 4" />
    </svg>
);
const NoReceivedRequestsGraphic: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="receivedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-primary)" />
                <stop offset="100%" stopColor="var(--accent-secondary)" />
            </linearGradient>
        </defs>
        <path d="M15 75 V 40 C 15 35, 20 30, 25 30 H 75 C 80 30, 85 35, 85 40 V 75 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-neutral-600" />
        <path d="M15 75 H 85" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-neutral-600" />
        <g>
            <rect x="25" y="45" width="50" height="30" rx="3" fill="url(#receivedGradient)" />
            <path d="M 35 55 L 50 65 L 65 55" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <animateTransform attributeName="transform" type="translate" values="0 -20; 0 0; 0 0" dur="1.5s" repeatCount="1" />
            <animate attributeName="opacity" from="0" to="1" dur="0.7s" repeatCount="1" />
        </g>
    </svg>
);

const getInitials = (name?: string): string => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
};

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
        <div className="text-center">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4 shadow-none"/>
            <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight mb-2">{title}</h2>
            <div className="text-[var(--text-muted)] text-sm font-medium leading-relaxed mb-8">{children}</div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={onConfirm} className="w-full py-4 text-xs font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 rounded-full transition-all shadow-none">Confirm removal</button>
          <button onClick={onClose} className="w-full py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] rounded-full transition-all border border-[var(--border-primary)] shadow-none">Cancel</button>
        </div>
      </div>
    </div>
  );
};

interface CompactUserCardProps {
    user: User;
    actions: React.ReactNode;
}
const CompactUserCard: React.FC<CompactUserCardProps> = ({ user, actions }) => (
    <div className="bg-[var(--component-background)] p-3 rounded-2xl border border-[var(--border-primary)] flex items-center space-x-4 transition-all duration-300 transform hover:border-purple-500/30 font-poppins text-left shadow-none">
        <Link to={`/user/${user.id}`} className="flex-shrink-0 group">
            {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-[var(--border-secondary)] group-hover:border-purple-500 transition-colors shadow-none" />
            ) : (
                <div className="w-12 h-12 rounded-full icon-bg-gradient flex items-center justify-center text-white font-bold text-xl border border-[var(--border-secondary)] group-hover:border-purple-500 transition-colors shadow-none">
                    {getInitials(user.name)}
                </div>
            )}
        </Link>
        <div className="flex-grow overflow-hidden">
            <Link to={`/user/${user.id}`} className="group">
                <h3 className="font-bold text-[var(--text-primary)] group-hover:text-purple-500 transition-colors truncate tracking-tight uppercase">{user.name}</h3>
                <p className="text-[10px] font-medium text-[var(--text-muted)] truncate uppercase tracking-widest">{user.headline || 'Innovator'}</p>
            </Link>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
            {actions}
        </div>
    </div>
);

const EmptyState: React.FC<{ icon: React.ReactElement; title: string; message: string; ctaLink?: string; ctaLabel?: string }> = ({ icon, title, message, ctaLink, ctaLabel }) => (
    <div className="col-span-full text-center py-16 p-4 bg-[var(--component-background)] rounded-[3rem] border-2 border-dashed border-[var(--border-primary)] flex flex-col items-center font-poppins shadow-none">
        {React.cloneElement(icon, { className: "text-[var(--text-muted)] w-20 h-20 mx-auto mb-4 opacity-70 shadow-none"})}
        <h3 className="text-xl font-bold text-[var(--text-primary)] mt-4 tracking-tight uppercase">{title}</h3>
        <p className="text-xs font-medium text-[var(--text-muted)] mt-2 max-w-xs mx-auto italic">{message}</p>
        {ctaLink && ctaLabel && (
             <Link to={ctaLink} className="mt-6 button-gradient inline-flex items-center text-white font-black uppercase tracking-widest text-[10px] py-3 px-6 rounded-full transition-all hover:scale-105 shadow-none">
                {ctaLabel}
            </Link>
        )}
    </div>
);

type ActiveTab = 'connected' | 'received';

export const ConnectionsPage: React.FC = () => {
  const { appNotifications, getUserById, connectedUserIds, acceptConnectionRequest, declineConnectionRequest, removeConnection } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>("connected");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToModify, setUserToModify] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const receivedRequests = useMemo(() => appNotifications
    .filter(n => n.category === 'connections' && n.status === 'pending' && n.relatedUserId)
    .map(n => ({ notification: n, sender: getUserById(n.relatedUserId!) }))
    .filter((item): item is { notification: AppNotification; sender: User } => Boolean(item.sender)),
    [appNotifications, getUserById]
  );
  
  const connections = useMemo(() => connectedUserIds
    .map(userId => getUserById(userId))
    .filter((user): user is User => Boolean(user) && user.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [connectedUserIds, getUserById, searchTerm]
  );
  
  const handleRemoveClick = (user: User) => { setUserToModify(user); setIsModalOpen(true); };
  const confirmAction = () => { if (userToModify) { removeConnection(userToModify.id); setUserToModify(null); } setIsModalOpen(false); };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-poppins">
      <div className="flex justify-start mb-8">
          <Link to="/dashboard" className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full px-5 py-2 shadow-none font-poppins">
            <ChevronLeftIcon className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
      </div>
      
      <div className="text-left mb-6 px-1">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tighter">Connections</h1>
        <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5 uppercase tracking-widest">Manage your active network and inbound requests.</p>
      </div>

      <div className="flex justify-center mt-8">
        <div className="bg-[var(--background-tertiary)] p-1 rounded-full flex space-x-1 max-w-xs w-full border border-[var(--border-primary)] shadow-none">
            <button onClick={() => setActiveTab('connected')} className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'connected' ? 'button-gradient text-white shadow-none' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Network ({connections.length})</button>
            <button onClick={() => setActiveTab('received')} className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'received' ? 'button-gradient text-white shadow-none' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Invites ({receivedRequests.length})</button>
        </div>
      </div>
        
      {activeTab === 'connected' && (
            <div className="relative mt-2 max-w-md mx-auto shadow-none">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5"/>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search connections..." className="w-full bg-[var(--component-background)] border border-[var(--border-secondary)] rounded-full pl-11 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm font-medium shadow-none font-poppins"/>
          </div>
      )}

      <div className="space-y-4 max-w-4xl mx-auto">
          {activeTab === 'connected' && (connections.length > 0 ? connections.map(user => (
              <CompactUserCard key={user.id} user={user} actions={
                  <>
                      <button onClick={() => navigate(`/messages?chatWith=${user.id}`)} className="p-2.5 rounded-full bg-sky-100/50 dark:bg-sky-500/10 border border-sky-200/50 dark:border-sky-500/30 text-sky-600 dark:text-sky-400 hover:scale-110 transition-all shadow-none"><PaperAirplaneIcon className="w-5 h-5 -rotate-12" /></button>
                      <button onClick={() => handleRemoveClick(user)} className="p-2.5 rounded-full bg-red-100/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:scale-110 transition-all shadow-none"><XMarkIcon /></button>
                  </>
              } />
          )) : <EmptyState icon={<NoConnectionsGraphic />} title="No connections" message="Build your network by reaching out to other innovators." ctaLink="/projects" ctaLabel="Find people" /> )}

          {activeTab === 'received' && (receivedRequests.length > 0 ? receivedRequests.map(({ notification, sender }) => (
              <CompactUserCard key={notification.id} user={sender} actions={
                  <>
                      <button onClick={() => declineConnectionRequest(notificatio.id)} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full bg-[var(--background-tertiary)] border border-[var(--border-primary)] hover:bg-neutral-200 transition-colors shadow-none">Decline</button>
                      <button onClick={() => acceptConnectionRequest(sender.id)} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full button-gradient text-white hover:scale-105 transition-all shadow-none">Accept</button>
                  </>
              } />
          )) : <EmptyState icon={<NoReceivedRequestsGraphic />} title="No pending invites" message="You have no inbound connection requests at the moment." /> )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmAction} title="Confirm removal">
          Are you sure you want to remove <strong className="font-bold text-[var(--text-primary)]">{userToModify?.name}</strong> from your network?
      </Modal>
    </div>
  );
};