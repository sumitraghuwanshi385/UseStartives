import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';
import { User, ChatConversation, MessageType, FileAttachment } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = ' ';

// --- Icons ---
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const EllipsisVerticalIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const NoSymbolIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserCircleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0z" />
  </svg>
);

const UserGroupIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197" />
  </svg>
);

const PhotoIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
  </svg>
);

const DocumentIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" />
  </svg>
);

const ChatBubbleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1.865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

// --- Confirmation Dialog ---
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--component-background)] border border-[var(--border-primary)] rounded-[2rem] w-full max-w-sm overflow-hidden">
        <div className="p-8 text-center">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{title}</h3>
          <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">{message}</p>
        </div>
        <div className="flex border-t border-[var(--border-primary)]">
          <button onClick={onClose} className="flex-1 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] border-r border-[var(--border-primary)]">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-red-500">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Create Team Modal ---
interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (name: string, description: string, image: string | undefined, members: User[]) => void;
}
const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { users, currentUser } = useAppContext();
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [teamImage, setTeamImage] = useState<string | undefined>(undefined);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!teamName.trim()) return;
    const members = users.filter(u => selectedMembers.includes(u.id));
    onCreated(teamName, teamDescription, teamImage, members);
    setTeamName('');
    setTeamDescription('');
    setTeamImage(undefined);
    setSelectedMembers([]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data?.filePath) {
        setTeamImage(`${API_BASE}${res.data.filePath}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--component-background)] border border-[var(--border-primary)] rounded-[2.5rem] w-full max-w-md overflow-hidden">
        <div className="p-8 border-b border-[var(--border-primary)]">
          <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">Create New Team</h3>
        </div>

        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="flex flex-col items-center">
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full bg-[var(--background-tertiary)] border-2 border-dashed border-[var(--border-secondary)] flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {teamImage ? (
                <img src={teamImage} alt="Team" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <PhotoIcon className="w-6 h-6 mx-auto text-[var(--text-muted)]" />
                  <span className="text-[8px] font-bold uppercase text-[var(--text-muted)] mt-1 block">{isUploading ? 'Uploading...' : 'Add Logo'}</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Team Name *</label>
            <input value={teamName} onChange={e => setTeamName(e.target.value)} className="w-full px-5 py-3 bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-2xl" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Description</label>
            <textarea value={teamDescription} onChange={e => setTeamDescription(e.target.value)} rows={3} className="w-full px-5 py-3 bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-2xl resize-none" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">Add Members</label>
            <div className="space-y-2">
              {users.filter(u => u.id !== currentUser?.id).map(user => (
                <button
                  type="button"
                  key={user.id}
                  onClick={() => setSelectedMembers(prev => (prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]))}
                  className={`flex items-center gap-3 w-full p-3 rounded-2xl border ${
                    selectedMembers.includes(user.id) ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500' : 'bg-[var(--background-tertiary)] border-transparent'
                  }`}
                >
                  <img src={user.profilePictureUrl || ''} className="w-8 h-8 rounded-full object-cover" />
                  <span className="flex-grow text-left text-sm font-bold text-[var(--text-primary)]">{user.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--border-primary)] flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest border border-[var(--border-primary)] rounded-full">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={!teamName.trim() || isUploading} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white button-gradient rounded-full disabled:opacity-50">
            Launch Team
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---
export const MessagesPage: React.FC = () => {
  const { currentUser, getUserById, markAllNotificationsAsRead, addNotification, token } = useAppContext();
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [activeType, setActiveType] = useState<'direct' | 'teams'>('direct');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [chatToAction, setChatToAction] = useState<string | null>(null);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMenuRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const selectedChat = useMemo(() => chats.find(c => c.id === selectedChatId), [chats, selectedChatId]);
  const filteredChats = useMemo(() => chats.filter(c => (activeType === 'teams' ? c.isTeam : !c.isTeam)), [chats, activeType]);

  const authHeaders = useMemo(() => {
    const t = token || localStorage.getItem('authToken');
    return { Authorization: `Bearer ${t}` };
  }, [token]);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/chat`, { headers: authHeaders });
      if (data?.success) {
        const processed = (data.chats || []).map((c: any) => ({ ...c, messages: c.messages || [] }));
        setChats(processed);
      }
    } catch (e: any) {
      console.error('fetchChats error:', e?.response?.data || e?.message || e);
    }
  };

  useEffect(() => {
    if (token) fetchChats();
  }, [token]);

  useEffect(() => {
    if (!selectedChatId || !token) return;

    const loadMessages = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/chat/${selectedChatId}/messages`, { headers: authHeaders });
        if (data?.success) {
          setChats(prev => prev.map(c => (c.id === selectedChatId ? { ...c, messages: data.messages || [] } : c)));
        }
      } catch (e: any) {
        console.error('loadMessages error:', e?.response?.data || e?.message || e);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedChatId, token, authHeaders]);

  // /messages?chatWith=<userId>
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const chatWith = queryParams.get('chatWith');
    if (!chatWith || !token) return;

    const initChat = async () => {
      try {
        const { data } = await axios.post(`${API_BASE}/api/chat`, { userId: chatWith }, { headers: authHeaders });
        if (data?.success) {
          const newChat = { ...data.chat, messages: [] };
          setChats(prev => (prev.find(c => c.id === newChat.id) ? prev : [newChat, ...prev]));
          setSelectedChatId(newChat.id);
        }
      } catch (e: any) {
        console.error('initChat error:', e?.response?.data || e?.message || e);
      }
    };

    initChat();
  }, [location.search, token, authHeaders]);

  useEffect(() => {
    if (!selectedChatId) return;
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    markAllNotificationsAsRead('messages');
  }, [selectedChatId, selectedChat?.messages?.length, markAllNotificationsAsRead]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target as Node)) setIsChatMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessage = async (text?: string, file?: FileAttachment, type: MessageType = 'text') => {
    if (!selectedChatId || !currentUser || !token) return;
    if (!text?.trim() && !file) return;

    try {
      const payload = { text: text?.trim(), file, type };
      const { data } = await axios.post(`${API_BASE}/api/chat/${selectedChatId}/messages`, payload, { headers: authHeaders });

      if (data?.success) {
        const newMessage = data.message;
        setChats(prev =>
          prev.map(chat =>
            chat.id === selectedChatId
              ? {
                  ...chat,
                  messages: [...(chat.messages || []), newMessage],
                  lastMessagePreview: text?.trim() || (type === 'image' ? 'Sent an image' : 'Sent a file'),
                  lastMessageTimestamp: newMessage.timestamp,
                }
              : chat
          )
        );
        setMessageText('');
      }
    } catch (e: any) {
      console.error('sendMessage error:', e?.response?.data || e?.message || e);
      addNotification('Failed to send message', 'error');
    }
  };

  const uploadFile = async (file: File): Promise<FileAttachment | null> => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await axios.post(`${API_BASE}/api/upload`, formData, {
      headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' },
    });

    if (!data?.success) return null;

    return {
      name: file.name,
      url: `${API_BASE}${data.filePath}`,
      mimeType: file.type,
      size: file.size,
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      const attachment = await uploadFile(file);
      if (!attachment) throw new Error('Upload failed');
      await handleSendMessage(undefined, attachment, type);
    } catch (err) {
      console.error(err);
      addNotification('Upload failed', 'error');
    } finally {
      // allow reselect same file
      e.target.value = '';
    }
  };

  const handleTeamCreated = async (name: string, description: string, image: string | undefined, members: User[]) => {
    if (!token) return;
    try {
      const payload = { name, description, users: members.map(m => m.id), image };
      const { data } = await axios.post(`${API_BASE}/api/chat/team`, payload, { headers: authHeaders });

      if (data?.success) {
        const newTeam = { ...data.chat, messages: [] };
        setChats(prev => [newTeam, ...prev]);
        setSelectedChatId(newTeam.id);
        setIsCreateTeamOpen(false);
        addNotification('Team created successfully!', 'success');
      }
    } catch (e: any) {
      console.error('createTeam error:', e?.response?.data || e?.message || e);
      addNotification('Failed to create team', 'error');
    }
  };

  const confirmClearChat = () => {
    if (selectedChatId) {
      setChats(prev => prev.map(c => (c.id === selectedChatId ? { ...c, messages: [], lastMessagePreview: undefined } : c)));
      setIsChatMenuOpen(false);
      addNotification('Chat cleared locally', 'info');
    }
    setIsConfirmClearOpen(false);
  };

  const confirmDeleteChat = () => {
    if (chatToAction) {
      setChats(prev => prev.filter(c => c.id !== chatToAction));
      if (selectedChatId === chatToAction) setSelectedChatId(null);
      setChatToAction(null);
      addNotification('Conversation removed locally', 'info');
    }
    setIsConfirmDeleteOpen(false);
    setIsChatMenuOpen(false);
  };

  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!selectedChat) return;

    if (selectedChat.isTeam) navigate(`/team/${selectedChat.id}`);
    else if (selectedChat.contact?.id) navigate(`/user/${selectedChat.contact.id}`);
  };

  // --- prevent white screen if not logged in ---
  if (!token || !currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-black uppercase">Please login</h2>
          <p className="text-sm opacity-70 mt-2">Messenger requires authentication.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-[calc(100vh-68px)] bg-[var(--component-background)] overflow-hidden font-poppins relative z-0">
      {/* Sidebar */}
      <aside className={`w-full md:w-80 border-r border-[var(--border-primary)] flex-col bg-white dark:bg-black/20 ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 pb-2 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">Messenger</h2>
            <p className="text-xs font-bold text-[var(--text-muted)] tracking-widest mt-1">Your command center.</p>
          </div>
          <button onClick={() => setIsCreateTeamOpen(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 text-[10px] font-bold transition-all active:scale-95">
            <UserGroupIcon className="w-3.5 h-3.5" />
            New Team
          </button>
        </div>

        <div className="px-6 py-4 shrink-0">
          <div className="bg-[var(--background-tertiary)] p-1 rounded-full flex relative border border-[var(--border-primary)]">
            <button onClick={() => setActiveType('direct')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all z-10 flex items-center justify-center gap-2 ${activeType === 'direct' ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg' : 'text-[var(--text-muted)]'}`}>
              <UserCircleIcon className="w-4 h-4" /> Direct
            </button>
            <button onClick={() => setActiveType('teams')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all z-10 flex items-center justify-center gap-2 ${activeType === 'teams' ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg' : 'text-[var(--text-muted)]'}`}>
              <UsersIcon className="w-4 h-4" /> Teams
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollable px-3 space-y-1">
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`flex items-center p-4 rounded-[1.5rem] cursor-pointer transition-all border ${
                  selectedChatId === chat.id ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/30' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40 border-transparent'
                }`}
              >
                <div className="relative">
                  {chat.contact?.avatarUrl ? (
                    <img src={chat.contact.avatarUrl} className="w-11 h-11 rounded-full object-cover border border-[var(--border-primary)]" alt="" />
                  ) : (
                    <div className="w-11 h-11 rounded-full icon-bg-gradient flex items-center justify-center text-white font-bold text-xs">
                      {chat.contact?.name?.[0] || 'U'}
                    </div>
                  )}
                </div>

                <div className="ml-4 flex-grow overflow-hidden">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-bold text-sm text-[var(--text-primary)] truncate uppercase">{chat.contact?.name}</h3>
                    {chat.lastMessageTimestamp && (
                      <span className="text-[9px] text-[var(--text-muted)] font-black">
                        {new Date(chat.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] truncate font-medium">{chat.lastMessagePreview || 'No messages yet'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4 opacity-40">
              <ChatBubbleIcon className="w-10 h-10 text-[var(--text-muted)] mb-3" />
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">No conversations</p>
            </div>
          )}
        </div>
      </aside>

      {/* Chat View */}
      <main className={`flex-1 flex flex-col h-full relative ${selectedChatId ? 'flex' : 'hidden md:flex'}`}>
        {selectedChat ? (
          <>
            <header className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between bg-white/80 dark:bg-black/40 backdrop-blur-md shrink-0 z-10">
              <div className="flex items-center">
                <button onClick={() => setSelectedChatId(null)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-full mr-2 bg-[var(--background-tertiary)] hover:bg-neutral-200 transition-colors">
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>

                <button className="flex items-center cursor-pointer group text-left focus:outline-none appearance-none bg-transparent border-none p-0" onClick={handleHeaderClick}>
                  {selectedChat.contact?.avatarUrl ? (
                    <img src={selectedChat.contact.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-[var(--border-primary)] transition-transform group-hover:scale-105" alt="" />
                  ) : (
                    <div className="w-10 h-10 rounded-full icon-bg-gradient flex items-center justify-center text-white font-bold text-xs">
                      {selectedChat.contact?.name?.[0] || 'U'}
                    </div>
                  )}

                  <div className="ml-3">
                    <h3 className="font-bold text-sm text-[var(--text-primary)] leading-none uppercase group-hover:text-purple-600 transition-colors">{selectedChat.contact?.name}</h3>
                    <p className="text-[9px] font-black uppercase text-[var(--text-muted)] mt-1 tracking-widest">
                      {selectedChat.isTeam ? `${selectedChat.memberIds?.length || 0} members` : 'Direct message'}
                    </p>
                  </div>
                </button>
              </div>

              <div className="relative" ref={chatMenuRef}>
                <button onClick={() => setIsChatMenuOpen(!isChatMenuOpen)} className="p-2.5 rounded-full hover:bg-[var(--background-tertiary)] transition-colors border border-[var(--border-primary)] shadow-none">
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>

                {isChatMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--component-background)] border border-[var(--border-primary)] rounded-2xl shadow-xl z-50 overflow-hidden">
                    <button onClick={() => setIsConfirmClearOpen(true)} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors flex items-center gap-2 border-b border-[var(--border-primary)]">
                      <NoSymbolIcon /> Clear chat
                    </button>
                    <button onClick={() => { setChatToAction(selectedChat.id); setIsConfirmDeleteOpen(true); }} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-2">
                      <TrashIcon /> Delete chat
                    </button>
                  </div>
                )}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 chat-bg-pattern custom-scrollable">
              {selectedChat.messages && selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((msg: any, i: number) => {
                  const isMe = msg.senderId === currentUser.id;
                  const other = !isMe ? getUserById(msg.senderId) : undefined;

                  const senderName = isMe ? currentUser.name : (selectedChat.isTeam ? (other?.name || 'User') : selectedChat.contact?.name);
                  const senderAvatar = isMe ? currentUser.profilePictureUrl : (selectedChat.isTeam ? other?.profilePictureUrl : selectedChat.contact?.avatarUrl);

                  return (
                    <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                      <div className={`flex max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                        <div className="shrink-0 mb-1 cursor-pointer" onClick={() => !isMe && navigate(`/user/${msg.senderId}`)}>
                          {senderAvatar ? (
                            <img src={senderAvatar} className="w-6 h-6 rounded-full object-cover border border-[var(--border-primary)]" alt="" />
                          ) : (
                            <div className="w-6 h-6 rounded-full icon-bg-gradient flex items-center justify-center text-white text-[8px] font-bold">
                              {(senderName || 'U')[0]}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col">
                          {!isMe && (
                            <span className="text-[8px] font-black uppercase text-[var(--text-muted)] ml-2 mb-0.5 cursor-pointer hover:text-purple-600 transition-colors" onClick={() => navigate(`/user/${msg.senderId}`)}>
                              {senderName}
                            </span>
                          )}

                          <div className={`p-4 rounded-[1.5rem] shadow-none ${isMe ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white dark:bg-neutral-800 text-[var(--text-primary)] rounded-bl-none border border-[var(--border-primary)]'}`}>
                            {msg.type === 'text' && <p className="text-sm font-medium leading-relaxed">{msg.text}</p>}

                            {msg.type === 'image' && msg.file && (
                              <img src={msg.file.url} className="rounded-xl max-h-60 w-full object-cover border border-white/20" alt="Sent media" />
                            )}

                            {msg.type === 'document' && msg.file && (
                              <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-white/10">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                  <DocumentIcon className="w-6 h-6" />
                                </div>
                                <div className="overflow-hidden">
                                  <p className="text-xs font-bold truncate">{msg.file.name}</p>
                                  <p className="text-[8px] opacity-70 uppercase font-black tracking-widest">{Math.round((msg.file.size || 0) / 1024)} KB</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <span className={`text-[8px] font-bold text-[var(--text-muted)] mt-1 px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                  <ChatBubbleIcon className="w-16 h-16 text-[var(--text-muted)] mb-3" />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Start the discussion</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-[var(--border-primary)] bg-white dark:bg-black backdrop-blur-md shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(messageText); }}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => imageInputRef.current?.click()} className="p-3 bg-[var(--background-tertiary)] text-[var(--text-muted)] rounded-full border border-[var(--border-primary)]">
                      <PhotoIcon className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={() => docInputRef.current?.click()} className="p-3 bg-[var(--background-tertiary)] text-[var(--text-muted)] rounded-full border border-[var(--border-primary)]">
                      <DocumentIcon className="w-5 h-5" />
                    </button>
                    <input type="file" ref={imageInputRef} onChange={e => handleFileUpload(e, 'image')} accept="image/*" className="hidden" />
                    <input type="file" ref={docInputRef} onChange={e => handleFileUpload(e, 'document')} className="hidden" />
                  </div>

                  <input
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full px-6 py-3.5 text-sm font-medium"
                  />

                  <button type="submit" disabled={!messageText.trim()} className="p-3.5 button-gradient text-white rounded-full disabled:opacity-50">
                    <PaperAirplaneIcon className="w-6 h-6" />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center chat-bg-pattern p-8">
            <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-900 border-2 border-[var(--border-primary)] flex items-center justify-center mb-6">
              <ChatBubbleIcon className="w-12 h-12 text-[var(--text-muted)] opacity-50" />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Select a conversation</h2>
            <p className="text-sm text-[var(--text-muted)] mt-2 max-w-xs mx-auto font-medium">Choose from your existing conversations or start a new one to begin chatting.</p>
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => { setIsConfirmDeleteOpen(false); setChatToAction(null); }}
        onConfirm={confirmDeleteChat}
        title="Delete conversation?"
        message="This will permanently remove the chat history and the contact from your inbox list. This action cannot be reversed."
      />

      <ConfirmDialog
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        onConfirm={confirmClearChat}
        title="Clear chat history?"
        message="This will remove all messages in this chat for you. The conversation will remain in your list."
      />

      <CreateTeamModal isOpen={isCreateTeamOpen} onClose={() => setIsCreateTeamOpen(false)} onCreated={handleTeamCreated} />
    </div>
  );
};

export default MessagesPage;