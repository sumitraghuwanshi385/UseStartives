import axios from 'axios'; // ✅ Added Axios
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Startalk } from '../types';
import { timeAgo } from '../constants';

const MOOD_EMOJIS = ['🚀', '💡', '❤️', '🔥', '💯', '😂', '😭'];

const isMongoId = (id?: string) => !!id && /^[a-f\d]{24}$/i.test(id);

// --- Icons (Same as before) ---
const SmileIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75s.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
  </svg>
);

const ActivityIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const PhotoIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Confirmation Modal Component ---
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--component-background)] border border-[var(--border-primary)] rounded-[2rem] w-full max-w-[320px] overflow-hidden shadow-none animate-in zoom-in-95 duration-200 flex flex-col font-poppins">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center mx-auto mb-4">
            <TrashIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 tracking-tight">{title}</h3>
          <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">{message}</p>
        </div>
        <div className="flex border-t border-[var(--border-primary)]">
          <button onClick={onClose} className="flex-1 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--background-tertiary)] transition-colors border-r border-[var(--border-primary)]">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
};

// --- Helper to fix Image URLs ---
const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${url}`; // ✅ Fix for local backend uploads
};

export const StartalkCard: React.FC<{ talk: Startalk; onDeleteRequest?: (id: string) => void; className?: string }> = ({
  talk,
  onDeleteRequest,
  className = "",
}) => {
  const { reactToStartalk, currentUser } = useAppContext();
  const [isReactionMenuOpen, setIsReactionMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const initials = talk.authorName ? talk.authorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'UU';

  const handleReaction = (emoji: string) => {
    reactToStartalk(talk.id, emoji);
    setIsReactionMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsReactionMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHoldStart = () => {
    timeoutRef.current = window.setTimeout(() => setIsReactionMenuOpen(true), 300);
  };

  const handleHoldEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // ✅ Object.values works perfectly with the new backend fix
  const totalReactions = Object.values(talk.reactions || {}).reduce<number>((sum, count) => sum + (count as number), 0);
  const userHasReacted = !!talk.currentUserReaction; // or check userReactions from backend logic if available
  const isOwner = currentUser?.id === talk.authorId;

  const profileClickable = isMongoId(talk.authorId);

  return (
    <div className={`bg-[var(--component-background)] rounded-2xl border border-[var(--border-primary)] p-5 md:p-6 transition-all duration-300 hover:shadow-none hover:border-purple-500/30 group flex flex-col gap-4 select-none font-poppins ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {profileClickable ? (
            <Link to={`/user/${talk.authorId}`} className="relative shrink-0">
              {talk.authorAvatar ? (
                <img src={talk.authorAvatar} alt={talk.authorName} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-[var(--border-primary)] shadow-none" />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full icon-bg-gradient flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-none">{initials}</div>
              )}
            </Link>
          ) : (
            <div className="relative shrink-0">
              {talk.authorAvatar ? (
                <img src={talk.authorAvatar} alt={talk.authorName} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-[var(--border-primary)] shadow-none" />
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full icon-bg-gradient flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-none">{initials}</div>
              )}
            </div>
          )}

          <div className="overflow-hidden text-left">
            {profileClickable ? (
              <Link to={`/user/${talk.authorId}`} className="font-bold text-sm md:text-base text-[var(--text-primary)] hover:text-purple-600 transition-colors truncate block tracking-tight uppercase">
                {talk.authorName}
              </Link>
            ) : (
              <span className="font-bold text-sm md:text-base text-[var(--text-primary)] truncate block tracking-tight uppercase" title="Profile not available">
                {talk.authorName}
              </span>
            )}
            <p className="text-[10px] md:text-xs text-[var(--text-muted)] truncate font-medium uppercase tracking-widest">{talk.authorHeadline || "Builder"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--background-tertiary)] border border-[var(--border-primary)] text-[10px] font-black uppercase text-[var(--text-muted)] shadow-none h-fit">
            <ActivityIcon className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-[var(--text-primary)]">{totalReactions}</span>
          </div>
          {isOwner && onDeleteRequest && (
            <button onClick={() => onDeleteRequest(talk.id)} className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 hover:scale-110 transition-transform border border-red-200 dark:border-red-800/30 shadow-none" title="Delete talk">
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 text-left">
        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed font-medium whitespace-pre-wrap">{talk.content}</p>

        {talk.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[var(--background-tertiary)] shadow-none">
            {/* ✅ Fixed Image URL Display */}
            <img 
              src={getImageUrl(talk.imageUrl)} 
              alt="Post attachment" 
              className="w-full h-auto object-cover max-h-[400px]" 
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-2 border-t border-[var(--border-primary)]">
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
              onClick={() => setIsReactionMenuOpen(!isReactionMenuOpen)}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all shadow-none active:scale-95 group/pill select-none touch-none text-[10px] font-black uppercase ${
                userHasReacted
                  ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'bg-[var(--background-tertiary)] border border-[var(--border-primary)] text-[var(--text-muted)] hover:text-purple-600 hover:border-purple-500/50'
              }`}
            >
              {userHasReacted ? <span className="text-base leading-none">{talk.currentUserReaction}</span> : <SmileIcon className="w-4 h-4 transition-colors group-hover/pill:text-purple-600" />}
              <span>{userHasReacted ? 'Reacted' : 'React'}</span>
            </button>

            {isReactionMenuOpen && (
              <div ref={menuRef} className="absolute bottom-full left-0 mb-3 p-1.5 bg-[var(--component-background)] border border-[var(--border-primary)] rounded-full shadow-none flex items-center gap-1 z-50 animate-in slide-in-from-bottom-2 duration-200">
                {MOOD_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReaction(emoji);
                    }}
                    className={`w-9 h-9 flex items-center justify-center text-lg hover:scale-125 transition-transform hover:bg-[var(--background-tertiary)] rounded-full ${
                      talk.currentUserReaction === emoji ? 'bg-purple-100 dark:bg-purple-900/30' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-poppins">{timeAgo(talk.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

const StartalksPage: React.FC = () => {
  const { startalks, addStartalk, deleteStartalk, addNotification } = useAppContext();

  const [newTalkContent, setNewTalkContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Stores URL now
  const [isPosting, setIsPosting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false); // ✅ New state
  const [activeFilter, setActiveFilter] = useState<'Feed' | 'Latest' | 'Most reacted'>('Feed');
  const [talkToDeleteId, setTalkToDeleteId] = useState<string | null>(null);

  const location = useLocation();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('focus') === 'true' && textareaRef.current) textareaRef.current.focus();
  }, [location.search]);

  const handlePost = async () => {
    if (!newTalkContent.trim() || isPosting || isImageUploading) return;

    try {
      setIsPosting(true);
      // imagePreview now contains the backend path like "/uploads/..."
      await addStartalk(newTalkContent.trim(), imagePreview || undefined);
      setNewTalkContent('');
      setImagePreview(null);
    } finally {
      setIsPosting(false);
    }
  };

  // ✅ New Upload Logic: Uploads to backend immediately
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImageUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      // Sending to backend
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data?.filePath) {
        setImagePreview(res.data.filePath); // Store path like "/uploads/img.jpg"
        if(addNotification) addNotification('Image uploaded!', 'success');
      } else {
        if(addNotification) addNotification('Image upload failed.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      if(addNotification) addNotification(err?.response?.data?.message || 'Image upload failed.', 'error');
    } finally {
      setIsImageUploading(false);
      // allow selecting same file again
      if (e.target) e.target.value = '';
    }
  };

  const filteredTalks = useMemo(() => {
    const list = [...startalks];

    if (activeFilter === 'Latest') {
      return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    if (activeFilter === 'Most reacted') {
      return list.sort((a, b) => {
        const aTotal = Object.values(a.reactions || {}).reduce<number>((sum, count) => sum + (count as number), 0);
        const bTotal = Object.values(b.reactions || {}).reduce<number>((sum, count) => sum + (count as number), 0);
        return bTotal - aTotal;
      });
    }

    // Default Feed sort (usually latest first)
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [startalks, activeFilter]);

  return (
    <div className="bg-[var(--background-secondary)] min-h-screen font-poppins">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        <div className="text-left mb-6">
          <h1 className="text-4xl font-startives-brand tracking-tighter text-[var(--text-primary)] leading-tight">Startalks</h1>
          <p className="text-lg text-[var(--text-secondary)] font-medium mt-1 opacity-80 font-poppins">Founders sharing raw thoughts & updates.</p>
        </div>

        <div className="max-w-2xl lg:max-w-3xl mx-auto">
          <div className="bg-[var(--component-background)] rounded-3xl border border-[var(--border-primary)] p-6 md:p-8 mb-6 shadow-none relative overflow-hidden text-left font-poppins">
            <div className="absolute inset-0 dot-pattern-bg opacity-[0.03] pointer-events-none"></div>
            <div className="relative z-10">
              <textarea
                ref={textareaRef}
                value={newTalkContent}
                onChange={(e) => setNewTalkContent(e.target.value)}
                placeholder="What's happening in your venture?"
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-[var(--text-primary)] font-medium text-base md:text-lg resize-none min-h-[120px] md:min-h-[150px] placeholder-[var(--text-muted)] font-poppins"
                maxLength={500}
              />

              {imagePreview && (
                <div className="relative mt-4 mb-2 inline-block shadow-none">
                  {/* ✅ Preview with proper URL */}
                  <img src={getImageUrl(imagePreview)} alt="Preview" className="max-h-48 rounded-xl border border-[var(--border-primary)] shadow-none" />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 p-1 bg-[var(--component-background)] border border-[var(--border-primary)] rounded-full text-red-500 shadow-none hover:scale-110 transition-transform"
                    title="Remove image"
                  >
                    <XMarkIcon />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-primary)]">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isImageUploading || isPosting}
                    className="p-2.5 rounded-full bg-[var(--background-tertiary)] text-[var(--text-muted)] hover:text-purple-600 transition-colors border border-[var(--border-primary)] shadow-none disabled:opacity-60"
                    title="Add image"
                  >
                    <PhotoIcon className="w-5 h-5" />
                  </button>

                  <input type="file" ref={imageInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />

                  <span className={`text-[10px] font-black uppercase tracking-widest ${newTalkContent.length > 450 ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                    {newTalkContent.length} / 500
                  </span>

                  {isImageUploading && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 animate-pulse">Uploading...</span>
                  )}
                </div>

                <button
                  onClick={handlePost}
                  disabled={!newTalkContent.trim() || isPosting || isImageUploading}
                  className="button-gradient px-6 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-none hover:scale-105 transition-all active:scale-95 disabled:opacity-50 font-poppins"
                >
                  {isPosting ? "Posting..." : isImageUploading ? "Wait..." : "Share talk"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-[var(--background-tertiary)] p-1 rounded-full border border-[var(--border-primary)] font-poppins">
              {(['Feed', 'Latest', 'Most reacted'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 md:px-8 md:py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    activeFilter === filter ? 'button-gradient text-white shadow-none' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filteredTalks.length > 0 ? (
              filteredTalks.map((talk) => (
                <StartalkCard
                  key={talk.id}
                  talk={talk}
                  onDeleteRequest={(id) => setTalkToDeleteId(id)}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-[var(--component-background)] rounded-3xl border-2 border-dashed border-[var(--border-primary)] shadow-none">
                <p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-xs font-poppins">
                  No talks shared yet. Be the first!
                </p>
              </div>
            )}
          </div>
        </div>

        <ConfirmModal
          isOpen={!!talkToDeleteId}
          onClose={() => setTalkToDeleteId(null)}
          onConfirm={() => {
            if (talkToDeleteId) {
              deleteStartalk(talkToDeleteId);
              setTalkToDeleteId(null);
            }
          }}
          title="Delete startalk?"
          message="This will permanently remove your raw thought from the ecosystem. This action cannot be undone."
        />
      </div>
    </div>
  );
};

export default StartalksPage;