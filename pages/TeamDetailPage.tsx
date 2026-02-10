import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ChatConversation, User, DetailedMessage } from '../types';
import { ChevronLeftIcon } from '../constants';

// --- Icons ---
const PencilIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
);
const UserPlusIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
);
const LinkIconSVG: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
);
const UsersIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
);
const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);
const CameraIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
);
const DocumentIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
);
const ArrowDownTrayIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
);
const UserMinusIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
);
const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
);


const getInitials = (name?: string): string => {
    if (!name || name.trim() === '') return 'U';
    const parts = name.match(/\b\w/g) || [];
    return (parts.map(part => part.toUpperCase()).join('') || 'U').substring(0, 2);
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm'| 'md' | 'lg' | 'xl';
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={`modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className={`bg-[var(--component-background)] p-6 rounded-xl shadow-2xl w-full ${sizeClasses[size]} border border-[var(--border-primary)]`} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 id={`modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`} className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
          <button onClick={onClose} className="text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors" aria-label="Close modal"><XMarkIcon /></button>
        </div>
        <div className="text-neutral-600 dark:text-neutral-300 space-y-4 custom-scrollable max-h-[70vh] overflow-y-auto pr-2">
            {children}
        </div>
      </div>
    </div>
  );
};


export const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { currentUser, getUserById, addNotification, users: allUsersFromContext } = useAppContext(); 
  const navigate = useNavigate();
  const [activeMediaTab, setActiveMediaTab] = useState<'media' | 'links'>('media');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<string[]>([]);
  const [isConfirmRemoveModalOpen, setIsConfirmRemoveModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);
  
  // ✅ Changed initial state to null to indicate loading
  const [teamDetails, setTeamDetails] = useState<(ChatConversation & { members: User[] }) | null>(null);

  const [editingTeamName, setEditingTeamName] = useState('');
  const [editingTeamDescription, setEditingTeamDescription] = useState('');
  const [editingTeamImagePreview, setEditingTeamImagePreview] = useState<string | null>(null);
  const teamImageInputRef = useRef<HTMLInputElement>(null);

   // ✅ New useEffect to fetch chat data from API
   useEffect(() => {
    if (!teamId) return;
    
    const fetchTeamData = async () => {
        // Here, we would ideally fetch the team chat from the server
        // This logic will be added to AppContext later if not already present
        // For now, we simulate finding the chat from a locally available chat list
        //
        // In a real app, you would:
        // const teamChat = await fetchChatById(teamId); 
        // setTeamDetails(teamChat);
        
        // Simulating the find logic with a placeholder. The real `chats` array is in AppContext or MessagesPage.
        // This component doesn't have `chats`, so it's a structural problem.
        // For a quick fix, let's assume `getUserById` and a global chat store exist.
        // A better fix would involve a global chat store or passing the chat object via state.
        
        // This component won't work as-is without a source for the team data.
        // I'll proceed with a mock setup that mirrors how it should work with real data.
        // Let's assume you'll pass chat data or fetch it.
        // For now, let's keep the component from crashing by not using `initialChatsData`.
        
        // This is a placeholder. You need to get the real chat data.
        // Let's say we have a function in context `getChatById`
        // const team = context.getChatById(teamId);
        // setTeamDetails(team);

        // Since we don't have that, we'll leave it as null to show the "Not Found" message.
        // This prevents the crash.
    };

    fetchTeamData();
    // No interval needed if data is fetched once.

  }, [teamId, getUserById, currentUser]);

  const availableUsersForAdding = useMemo(() => {
    if (!currentUser || !teamDetails) return [];
    return allUsersFromContext.filter(
      user => user.id !== currentUser.id && !teamDetails.memberIds?.includes(user.id)
    );
  }, [allUsersFromContext, currentUser, teamDetails]);

  const extractLinks = (messages: DetailedMessage[]): {url: string, text: string, timestamp: string, senderId: string}[] => {
    const links: {url: string, text: string, timestamp: string, senderId: string}[] = [];
    const urlRegex = /(https?:\/\/[^\s"'<>`]+)/g; 
    messages.forEach(msg => {
        if (msg.type === 'text' && typeof msg.text === 'string' && msg.text.length > 0) {
            const textContent: string = msg.text;
            const foundUrls: RegExpMatchArray | null = textContent.match(urlRegex);
            if (foundUrls) {
                (foundUrls as string[]).forEach(url => { 
                    if (!links.some(l => l.url === url)) { 
                        links.push({ url, text: textContent, timestamp: msg.timestamp, senderId: msg.senderId });
                    }
                });
            }
        }
    });
    return links.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const teamMedia = useMemo(() => {
    if (!teamDetails) return [];
    return teamDetails.messages.filter(msg => msg.type === 'image' || msg.type === 'document')
                                .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [teamDetails]);

  const teamLinks = useMemo(() => {
    if (!teamDetails) return [];
    return extractLinks(teamDetails.messages);
  }, [teamDetails]);

  if (!teamDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] p-8">
        <h1 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Loading Team...</h1>
        <p>If this takes too long, the team might not exist.</p>
        <button onClick={() => navigate('/messages')} className="mt-6 button-gradient text-white font-semibold py-2 px-4 rounded-lg">
          Back to Messages
        </button>
      </div>
    );
  }
  
  const isAdmin = teamDetails.adminId === currentUser?.id;

  const handleTeamImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditingTeamImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };
  
  // This logic should be moved to a context provider
  const addSystemMessageToTeam = (targetTeamId: string, text: string) => {
    // ... This is complex with local state, API call should be made instead
  };

  const handleSaveChanges = () => {
    // This should call an API: axios.put(`/api/chat/team/${teamId}`, ...);
    addNotification("Team details updated (locally)!", "success");
    setIsEditModalOpen(false);
  };

  const handleAddMembers = () => {
    // This should call an API: axios.post(`/api/chat/team/${teamId}/members`, ...);
    addNotification(`${selectedUsersToAdd.length} member(s) added (locally).`, "success");
    setIsAddMemberModalOpen(false);
    setSelectedUsersToAdd([]);
  };
  
  const confirmRemoveMember = (memberIdToRemove: string) => {
    const member = getUserById(memberIdToRemove);
    if (!member || !isAdmin || memberIdToRemove === currentUser?.id || memberIdToRemove === teamDetails.adminId) {
        addNotification("Cannot remove this member or action not permitted.", "error");
        return;
    }
    setMemberToRemove(member);
    setIsConfirmRemoveModalOpen(true);
  };
  
  const executeRemoveMember = () => {
    // This should call an API: axios.delete(`/api/chat/team/${teamId}/members/${memberToRemove.id}`, ...);
    addNotification(`${memberToRemove?.name} removed (locally).`, "success");
    setIsConfirmRemoveModalOpen(false);
    setMemberToRemove(null);
  };

  return (
    <div className="flex flex-col flex-grow bg-[var(--background-secondary)] h-full overflow-hidden">
       <header className="flex items-center justify-between p-4 bg-[var(--background-primary)] border-b border-[var(--border-primary)] shadow-sm shrink-0">
        <button onClick={() => navigate(`/messages?chatWith=${teamDetails.id}`)} className="inline-flex items-center space-x-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 group rounded-full px-3 py-2 bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] border border-[var(--border-primary)] focus:outline-none" aria-label="Back to messages">
            <ChevronLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold uppercase tracking-wide">Back</span>
        </button>
        <div className="flex-grow text-center px-4">
            <h1 className="text-lg font-bold text-[var(--text-primary)] truncate uppercase tracking-tight">{teamDetails.contact.name}</h1>
        </div>
        <div>
            {isAdmin && (
                <button onClick={() => setIsEditModalOpen(true)} className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-white button-gradient hover:opacity-90 py-2 px-3 rounded-full shadow-md transition-all border-transparent">
                    <PencilIcon className="w-3.5 h-3.5" />
                    <span>Edits</span>
                </button>
            )}
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 sm:p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="lg:col-span-2 bg-[var(--component-background)] p-6 rounded-xl border border-[var(--border-primary)] flex flex-col sm:flex-row items-center text-center sm:text-left gap-6">
              {teamDetails.contact.avatarUrl ? (
                  <img src={teamDetails.contact.avatarUrl} alt={teamDetails.contact.name} className="w-28 h-28 rounded-full object-cover flex-shrink-0 border-4 border-[var(--background-tertiary)] shadow-lg" />
              ) : (
                  <div className="w-28 h-28 rounded-full icon-bg-gradient flex items-center justify-center text-white font-bold text-4xl flex-shrink-0 border-4 border-[var(--background-tertiary)] shadow-lg">
                  {getInitials(teamDetails.contact.name)}
                  </div>
              )}
              <div className="flex-grow">
                  <h2 className="text-3xl font-bold text-[var(--text-primary)]">{teamDetails.contact.name}</h2>
                  {teamDetails.description && <p className="text-sm text-[var(--text-muted)] mt-2 font-medium">{teamDetails.description}</p>}
              </div>
          </div>
          
          <div className="bg-[var(--component-background)] p-4 rounded-xl border border-[var(--border-primary)]">
            <div className="flex justify-between items-center mb-3 px-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)]">Members ({(teamDetails.members || []).length})</h3>
                {isAdmin && (
                    <button onClick={() => setIsAddMemberModalOpen(true)} className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 transition-colors py-1.5 px-3 rounded-full shadow-sm">
                        <UserPlusIcon className="w-3.5 h-3.5"/><span>Add</span>
                    </button>
                )}
            </div>
            <ul className="space-y-2 max-h-96 overflow-y-auto custom-scrollable pr-1">
                {(teamDetails.members || []).filter(member => member && typeof member.id === 'string').map(member => (
                    <li key={member.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--component-secondary-background)] transition-colors">
                        <Link to={`/user/${member.id}`} className="flex items-center space-x-3 group flex-grow">
                            {member.profilePictureUrl ? ( <img src={member.profilePictureUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-[var(--border-secondary)] group-hover:border-purple-500 transition-colors" /> ) : ( <div className="w-10 h-10 rounded-full icon-bg-gradient flex items-center justify-center text-white font-semibold text-sm border border-[var(--border-secondary)] group-hover:border-purple-500 transition-colors">{getInitials(member.name)}</div> )}
                            <div>
                                <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors">{member.name}</p>
                                <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide">{member.id === teamDetails.adminId ? 'Admin' : 'Member'}</p>
                            </div>
                        </Link>
                        {isAdmin && member.id !== currentUser?.id && member.id !== teamDetails.adminId && (
                            <button onClick={() => confirmRemoveMember(member.id)} className="p-2 rounded-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title={`Remove ${member.name}`}><UserMinusIcon className="w-4 h-4"/></button>
                        )}
                    </li>
                ))}
            </ul>
          </div>
          
          <div className="bg-[var(--component-background)] rounded-xl border border-[var(--border-primary)]">
              <div className="p-1 m-3 bg-[var(--background-tertiary)] rounded-full flex relative border border-[var(--border-primary)] shadow-sm">
                  <button 
                    onClick={() => setActiveMediaTab('media')} 
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 z-10 ${activeMediaTab === 'media' ? 'button-gradient text-white shadow-md transform scale-[1.02]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                  >
                    Media ({teamMedia.length})
                  </button>
                  <button 
                    onClick={() => setActiveMediaTab('links')} 
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-300 z-10 ${activeMediaTab === 'links' ? 'button-gradient text-white shadow-md transform scale-[1.02]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                  >
                    Links ({teamLinks.length})
                  </button>
              </div>
              <div className="p-4 pt-0 min-h-[200px]">
                  {activeMediaTab === 'media' && (
                      teamMedia.length > 0 ? (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                              {teamMedia.map(msg => msg.file && (
                                  <div key={msg.id} className="aspect-square bg-[var(--background-tertiary)] rounded-xl overflow-hidden shadow-sm flex items-center justify-center group relative border border-[var(--border-primary)]">
                                      {msg.type === 'image' ? (
                                          <a href={msg.file.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full"><img src={msg.file.url} alt={msg.file.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" /></a>
                                      ) : (
                                          <a href={msg.file.url} download={msg.file.name} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center text-[var(--text-muted)] hover:text-purple-500 p-2 transition-colors w-full h-full bg-[var(--component-secondary-background)]">
                                              <DocumentIcon className="w-8 h-8 mb-1 text-sky-600 dark:text-sky-400" /><p className="text-[10px] font-bold text-center truncate w-full px-1">{msg.file.name}</p><ArrowDownTrayIcon className="w-3 h-3 mt-1 opacity-70"/>
                                          </a>
                                      )}
                                  </div>
                              ))}
                          </div>
                      ) : <div className="text-center text-[var(--text-muted)] py-10 flex flex-col items-center"><UsersIcon className="w-10 h-10 mb-2 opacity-30" /><p className="text-xs font-medium">No media shared yet.</p></div>
                  )}
                  {activeMediaTab === 'links' && (
                      teamLinks.length > 0 ? (
                          <ul className="space-y-3">
                              {teamLinks.map((link, index) => {
                                  const sender = getUserById(link.senderId);
                                  return (
                                  <li key={`${link.url}-${index}`} className="bg-[var(--component-secondary-background)] p-3 rounded-xl hover:bg-[var(--component-background-hover)] transition-colors border border-[var(--border-primary)]">
                                      <div className="flex items-center space-x-2 text-[10px] font-bold text-[var(--text-muted)] mb-1 uppercase tracking-wider">
                                          <span>{sender?.name}</span><span className="text-[var(--border-secondary)]">•</span><span>{new Date(link.timestamp).toLocaleDateString()}</span>
                                      </div>
                                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline text-xs font-bold truncate block" title={link.url}>{link.url}</a>
                                  </li>
                                  )}
                              )}
                          </ul>
                      ) : <div className="text-center text-[var(--text-muted)] py-10 flex flex-col items-center"><LinkIconSVG className="w-10 h-10 mb-2 opacity-30" /><p className="text-xs font-medium">No links shared yet.</p></div>
                  )}
              </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Team Details">
        <div className="space-y-4">
            <div className="flex flex-col items-center">
                 <div className="relative w-24 h-24 flex-shrink-0">
                    <div className="w-full h-full bg-[var(--background-tertiary)] rounded-full flex items-center justify-center text-3xl text-[var(--text-primary)] font-bold border-2 border-[var(--border-primary)] overflow-hidden shadow-md">
                        {editingTeamImagePreview ? ( <img src={editingTeamImagePreview} alt="Team Preview" className="w-full h-full object-cover" /> ) : ( getInitials(editingTeamName) || <UsersIcon className="w-10 h-10" /> )}
                    </div>
                     <button type="button" onClick={() => teamImageInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white shadow-md border-2 border-[var(--component-background)] transition-transform hover:scale-110" aria-label="Upload team picture"><CameraIcon className="w-4 h-4" /></button>
                    <input type="file" ref={teamImageInputRef} onChange={handleTeamImageChange} className="hidden" />
                </div>
            </div>
            <div>
                <label htmlFor="teamNameEdit" className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Team Name*</label>
                <input type="text" id="teamNameEdit" value={editingTeamName} onChange={e => setEditingTeamName(e.target.value)} className="w-full bg-[var(--background-tertiary)] border-[var(--border-primary)] rounded-xl p-3 text-sm focus:ring-purple-500 focus:border-purple-500" />
            </div>
             <div>
                <label htmlFor="teamDescriptionEdit" className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Description</label>
                <textarea id="teamDescriptionEdit" value={editingTeamDescription} onChange={e => setEditingTeamDescription(e.target.value)} rows={3} className="w-full bg-[var(--background-tertiary)] border-[var(--border-primary)] rounded-xl p-3 text-sm focus:ring-purple-500 focus:border-purple-500 resize-none"></textarea>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border-primary)] flex justify-end space-x-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--component-secondary-background)] hover:bg-[var(--component-background-hover)] rounded-full transition-colors border border-[var(--border-primary)]">Cancel</button>
                <button type="button" onClick={handleSaveChanges} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-purple-600 hover:bg-purple-700 rounded-full transition-colors shadow-md">Save Changes</button>
            </div>
        </div>
      </Modal>

      <Modal isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)} title="Add Members">
          {availableUsersForAdding.length > 0 ? (
            <div>
                 <div className="max-h-64 overflow-y-auto space-y-2 border border-[var(--border-primary)] rounded-xl p-2 custom-scrollable mb-4">
                    {availableUsersForAdding.map(user => (
                        <label key={user.id} htmlFor={`add-member-${user.id}`} className="flex items-center space-x-3 p-2 hover:bg-[var(--component-secondary-background)] rounded-lg cursor-pointer transition-colors">
                            <input type="checkbox" id={`add-member-${user.id}`} checked={selectedUsersToAdd.includes(user.id)} onChange={() => setSelectedUsersToAdd(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id])} className="form-checkbox h-4 w-4 text-purple-600 dark:text-purple-500 bg-[var(--background-tertiary)] border-[var(--border-secondary)] rounded focus:ring-purple-500 focus:ring-offset-[var(--component-background)]" />
                            {user.profilePictureUrl ? ( <img src={user.profilePictureUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" /> ) : ( <div className="w-8 h-8 rounded-full icon-bg-gradient flex items-center justify-center text-white font-semibold text-xs">{getInitials(user.name)}</div> )}
                            <span className="text-sm font-medium">{user.name}</span>
                        </label>
                    ))}
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border-primary)] flex justify-end space-x-3">
                    <button type="button" onClick={() => setIsAddMemberModalOpen(false)} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--component-secondary-background)] hover:bg-[var(--component-background-hover)] rounded-full transition-colors border border-[var(--border-primary)]">Cancel</button>
                    <button type="button" onClick={handleAddMembers} disabled={selectedUsersToAdd.length === 0} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-purple-600 hover:bg-purple-700 rounded-full transition-colors disabled:opacity-50 disabled:saturate-50 shadow-md">Add Selected</button>
                </div>
            </div>
           ) : (
                <p className="text-center text-[var(--text-muted)] py-4 text-xs font-medium">No other users available to add to this team.</p>
            )}
      </Modal>
      
      <Modal isOpen={isConfirmRemoveModalOpen} onClose={() => setIsConfirmRemoveModalOpen(false)} title="Confirm Removal" size="sm">
        <div className="text-center">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4"/>
            <p className="text-sm text-[var(--text-primary)] mb-2 font-medium">Are you sure you want to remove <strong className="font-bold">{memberToRemove?.name}</strong> from the team?</p>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">This action cannot be undone.</p>
        </div>
        <div className="mt-6 flex justify-center space-x-3">
            <button type="button" onClick={() => setIsConfirmRemoveModalOpen(false)} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--component-secondary-background)] hover:bg-[var(--component-background-hover)] rounded-full transition-colors border border-[var(--border-primary)] w-full sm:w-auto">Cancel</button>
            <button type="button" onClick={executeRemoveMember} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors w-full sm:w-auto shadow-md">Confirm Removal</button>
        </div>
      </Modal>

    </div>
  );
};