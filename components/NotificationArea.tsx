import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { User } from '../types';

// --- CHANGE HERE: Added ': React.FC<{ requesterId: string }>' ---
const ConnectionRequestToast: React.FC<{ requesterId: string }> = ({ requesterId }) => {
    const { users, acceptConnectionRequest, fetchUserProfile } = useAppContext();
    const [requester, setRequester] = useState<User | undefined>(users.find(u => u.id === requesterId));
    const [isAccepted, setIsAccepted] = useState(false);

    useEffect(() => {
        if (!requester) {
            fetchUserProfile(requesterId).then((u) => {
                if (u) setRequester(u);
            });
        }
    }, [requesterId, requester, fetchUserProfile]);

    const handleAccept = async () => {
        await acceptConnectionRequest(requesterId);
        setIsAccepted(true);
    };

    if (!requester || isAccepted) return null;

    return (
        <div className="pointer-events-auto bg-white dark:bg-neutral-900 p-3 rounded-2xl shadow-xl border-2 border-purple-500/20 flex flex-col gap-3 w-72 animate-in slide-in-from-right-full duration-300">
            <div className="flex items-center gap-3">
                <img 
                    src={requester.profilePictureUrl || "https://www.gravatar.com/avatar/?d=mp"} 
                    alt={requester.name} 
                    className="w-10 h-10 rounded-full object-cover border border-purple-100" 
                />
                <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-purple-600 mb-0.5">New Request</p>
                    <p className="text-sm font-bold text-[var(--text-primary)] leading-none">{requester.name}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] truncate w-32">{requester.headline || "Innovator"}</p>
                </div>
            </div>
            <div className="flex gap-2 w-full">
                <button
                    onClick={handleAccept}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-full transition-colors shadow-md"
                >
                    Accept
                </button>
                <button
                    onClick={() => setIsAccepted(true)} 
                    className="px-4 bg-gray-100 dark:bg-neutral-800 text-[var(--text-secondary)] hover:text-red-500 text-[10px] font-black uppercase tracking-widest py-2 rounded-full transition-colors"
                >
                    Ignore
                </button>
            </div>
        </div>
    );
};

// --- Main Notification Area ---
const NotificationArea: React.FC = () => {
  const { notifications, removeNotification, currentUser } = useAppContext();

  const pendingRequests = currentUser?.connectionRequests || [];

  if (notifications.length === 0 && pendingRequests.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-6 space-y-3 z-[2000] flex flex-col items-end pointer-events-none">
      
      {/* 1. Pending Connection Requests */}
      {pendingRequests.map((requestId: string) => (
          <ConnectionRequestToast key={requestId} requesterId={requestId} />
      ))}

      {/* 2. System Notifications */}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          role="alert"
          aria-live="assertive"
          className={`pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-lg border backdrop-blur-md animate-in slide-in-from-right-full duration-300 
            ${notification.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : 
              notification.type === 'success' ? 'button-gradient border-white/20 text-white' : 
              'bg-white/90 dark:bg-neutral-800/90 border-gray-200 dark:border-gray-700 text-black dark:text-white'}`}
        >
          {notification.type === 'success' && (
              <span className="text-white bg-white/20 rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
              </span>
          )}
          {notification.type === 'error' && (
              <span className="text-white bg-white/20 rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
              </span>
          )}

          <p className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{notification.message}</p>
          
          <button
            onClick={() => removeNotification(notification.id)}
            className="w-5 h-5 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors ml-2"
            aria-label="Close notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationArea;