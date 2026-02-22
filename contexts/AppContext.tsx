import axios from 'axios';
axios.defaults.baseURL = 'https://jubilant-giggle-jj474x57rxwx3p7pw-5000.app.github.dev/';
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback, useMemo } from 'react';
axios.defaults.withCredentials = true;
import { StartupIdea, Application, AppSystemNotification, AppContextType, User, Position, UserProfileUpdate, AppNotification, NotificationCategory, Startalk } from '../types'; 
import { 
    MOCK_USERS_RAW, 
    EnvelopeOpenIcon, 
} from '../constants'; 

// --- Initial Mock Notifications ---
const INITIAL_APP_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'appReceived1',
    category: 'applications_to_my_project' as NotificationCategory,
    icon: React.createElement(EnvelopeOpenIcon, { className: "w-5 h-5 text-sky-500" }), 
    title: 'New Application: EcoRoute Planner',
    description: 'John Smith applied for "Lead Frontend Developer". View their application.',
    timestamp: new Date(Date.now() - 3600000).toISOString(), 
    isRead: false,
    status: 'pending',
    relatedProjectId: 'idea-1-mock', 
    relatedUserId: 'user-john-smith', 
    relatedApplicationId: 'app-mock-1', 
  },
];

const INITIAL_APPLICATIONS: Application[] = [];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [startupIdeas, setStartupIdeas] = useState<StartupIdea[]>([]);
  const [startalks, setStartalks] = useState<Startalk[]>([]);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [notifications, setNotifications] = useState<AppSystemNotification[]>([]); 
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [users, setUsers] = useState<User[]>(MOCK_USERS_RAW);
  
  // ✅ FIX: Token initialization from localStorage immediately
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  
  const [isLoading, setIsLoading] = useState(true);
  const [authLoadingState, setAuthLoadingState] = useState({ isLoading: false, messages: [] as string[] });
  const [appNotifications, setAppNotifications] = useState<AppNotification[]>(INITIAL_APP_NOTIFICATIONS);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false); 
  const [pendingVerificationUser, setPendingVerificationUser] = useState<{email: string; code: string} | null>(null);
  
  const [sentConnectionRequests, setSentConnectionRequests] = useState<string[]>([]); 
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([]);

// ✅ FETCH CONNECTIONS FROM BACKEND (SOURCE OF TRUTH)
const fetchConnections = async () => {
  const currentToken = token || localStorage.getItem('authToken');
  if (!currentToken) return;

  try {
    const res = await axios.get('/api/connections', {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (res.data?.success) {
      // backend se full user objects aa rahe hain
      const ids = res.data.connections.map((u: any) => u._id || u.id);
      setConnectedUserIds(ids);
    }
  } catch (err) {
    console.error('fetchConnections failed', err);
  }
};
  
  const addNotificationCallBack = useCallback((message: string, type: AppSystemNotification['type']) => {
    const newNotification: AppSystemNotification = {
      id: new Date().toISOString() + Math.random(),
      message,
      type,
    };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // --- REAL BACKEND API: Login ---
  const login = async (credential: string, password?: string, fromSignup: boolean = false): Promise<boolean> => {
    setAuthLoadingState({ isLoading: true, messages: ["Authenticating..."]});
    try {
      const response = await axios.post('/api/auth/login', { email: credential, password });
      if (response.data.success) {
        const { user, token: newToken } = response.data; // Rename to avoid conflict
        
        // ❌ connections yahan se MAT uthao (stale data hota hai)
if (user.sentRequests) 
  setSentConnectionRequests(user.sentRequests);

// ✅ auth data save
localStorage.setItem('authToken', newToken);
localStorage.setItem('user', JSON.stringify(user));

// ✅ State update immediately
setToken(newToken);
setCurrentUser(user);

// ✅ REAL SOURCE: backend se connections lao
setTimeout(() => {
  fetchConnections();
}, 0);

setShowOnboardingModal(fromSignup || !user.headline);
return true;
      } else {
        addNotificationCallBack(response.data.message || 'Login failed.', 'error');
        return false;
      }
    } catch (error: any) {
      console.error("Login API Error:", error);
      addNotificationCallBack(error.response?.data?.message || 'Something went wrong.', 'error');
      return false;
    } finally {
      setAuthLoadingState({ isLoading: false, messages: [] });
    }
  };

  // --- REAL BACKEND API: Signup ---
  const signup = async (email: string, password?: string): Promise<boolean> => {
    setAuthLoadingState({ isLoading: true, messages: ["Creating account..."]});
    try {
      const response = await axios.post('/api/auth/signup', { email, password });
      if (response.data.success) {
        setPendingVerificationUser({ email, code: response.data.verificationCode });
        addNotificationCallBack(`Verification code sent to ${email}.`, 'info');
        return true;
      } else {
        addNotificationCallBack(response.data.message || 'Signup failed.', 'error');
        return false;
      }
    } catch (error: any) {
      console.error("Signup API Error:", error);
      addNotificationCallBack(error.response?.data?.message || 'Something went wrong.', 'error');
      return false;
    } finally {
      setAuthLoadingState({ isLoading: false, messages: [] });
    }
  };
  
  const verifyAndLogin = async (code: string): Promise<boolean> => {
    setAuthLoadingState({ isLoading: true, messages: ["Verifying..."]});
    try {
        if (pendingVerificationUser && pendingVerificationUser.code === code) {
            await login(pendingVerificationUser.email, 'password123', true); 
            setPendingVerificationUser(null);
            return true;
        }
        addNotificationCallBack("Invalid verification code.", "error");
        return false;
    } finally {
        setAuthLoadingState({ isLoading: false, messages: [] });
    }
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setConnectedUserIds([]);
    setSentConnectionRequests([]);
  };
  
  // --- REAL BACKEND API: Update Profile (FIXED TOKEN) ---
  const updateUser = async (updates: UserProfileUpdate): Promise<boolean> => {
    if (!currentUser) return false;
    
    // Check local storage directly if state is lagging
    const currentToken = token || localStorage.getItem('authToken');

    if (!currentToken) {
        addNotificationCallBack("You are not logged in. Please refresh.", "error");
        return false;
    }

    setAuthLoadingState({ isLoading: true, messages: ["Updating profile..."] });
    try {
        // ✅ Create Config with Authorization Header
        const config = {
            headers: {
                Authorization: `Bearer ${currentToken}`, // Ensure "Bearer " prefix
                'Content-Type': 'application/json'
            }
        };

        // Send Request with Config as 3rd argument
        const response = await axios.put('/api/auth/profile', { id: currentUser.id, ...updates }, config);
        
        if (response.data.success) {
            const updatedUserData = response.data.user;
            setCurrentUser(updatedUserData);
            localStorage.setItem('user', JSON.stringify(updatedUserData));
            setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUserData : u));
            return true;
        } else {
            addNotificationCallBack("Failed to update profile.", "error");
            return false;
        }
    } catch (error: any) {
        console.error("Update Profile Error:", error);
        addNotificationCallBack(error.response?.data?.message || "Something went wrong.", "error");
        return false;
    } finally {
        setAuthLoadingState({ isLoading: false, messages: [] });
    }
  };

  // --- REAL BACKEND API: Add Idea ---
  const addIdea = async (ideaData: any) => {
    if (!currentUser) return;
    const currentToken = token || localStorage.getItem('authToken');
    setAuthLoadingState({ isLoading: true, messages: ["Launching project..."] });
    try {
        const config = { headers: { Authorization: `Bearer ${currentToken}` } };
        const response = await axios.post('/api/ideas', ideaData, config);
        if (response.data.success) {
            setStartupIdeas(prev => [response.data.idea, ...prev]);
            addNotificationCallBack("Project launched successfully!", "success");
        }
    } catch (error: any) {
        console.error("Add Idea Error:", error);
        addNotificationCallBack(error.response?.data?.message || "Failed to launch project.", "error");
    } finally {
        setAuthLoadingState({ isLoading: false, messages: [] });
    }
  };

  // --- REAL BACKEND API: Save/Unsave Project ---
  const toggleSaveProjectAPI = async (projectId: string) => {
      if (!currentUser) return;
      const currentToken = token || localStorage.getItem('authToken');
      try {
          const config = { headers: { Authorization: `Bearer ${currentToken}` } };
          const response = await axios.put('/api/auth/save-project', { projectId }, config);
          if (response.data.success) {
              const newSavedIds = response.data.savedProjectIds;
              const updatedUser = { ...currentUser, savedProjectIds: newSavedIds };
              setCurrentUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
              const isSaved = newSavedIds.includes(projectId);
              addNotificationCallBack(isSaved ? "Project saved." : "Project removed.", "success");
          }
      } catch (error) {
          console.error("Save Project Error:", error);
          addNotificationCallBack("Failed to update saved projects.", "error");
      }
  };

  const saveProject = (projectId: string) => toggleSaveProjectAPI(projectId);
  const unsaveProject = (projectId: string) => toggleSaveProjectAPI(projectId);
  
  const isProjectSaved = (projectId: string) => {
    return currentUser?.savedProjectIds?.includes(projectId) ?? false;
  };

  // --- Startalks Logic ---
  const addStartalk = async (content: string, imageUrl?: string) => {
      if (!currentUser) return;
      const currentToken = token || localStorage.getItem('authToken');
        try {
            const config = { headers: { Authorization: `Bearer ${currentToken}` } };
            const response = await axios.post('/api/startalks', { content, imageUrl }, config);
            if (response.data.success) {
                setStartalks(prev => [response.data.startalk, ...prev]);
                addNotificationCallBack("Post shared!", "success");
            }
        } catch (error) { addNotificationCallBack("Failed to post.", "error"); }
  };

  const deleteStartalk = async (talkId: string) => { 
      const currentToken = token || localStorage.getItem('authToken');
      try {
        const config = { headers: { Authorization: `Bearer ${currentToken}` } };
        await axios.delete(`/api/startalks/${talkId}`, config);
        setStartalks(prev => prev.filter(talk => talk.id !== talkId));
        addNotificationCallBack("Post removed.", "info");
    } catch (error) { addNotificationCallBack("Failed to delete post.", "error"); }
  };

  // ✅ FIXED: Connected to Backend API
  const reactToStartalk = async (talkId: string, emoji: string) => {
      if (!currentUser) return;
      const currentToken = token || localStorage.getItem('authToken');

      // 1. Optimistic Update (For Speed)
      setStartalks(prev => prev.map(talk => {
        if (talk.id === talkId) {
          const reactions = { ...talk.reactions };
          // Local logic approximation
          const userReactions = { ...(talk.userReactions || {}) };
          const oldEmoji = userReactions[currentUser.id];
          
          if (oldEmoji === emoji) {
             // Remove
             reactions[emoji] = Math.max(0, (reactions[emoji] || 0) - 1);
             if (reactions[emoji] === 0) delete reactions[emoji];
             delete userReactions[currentUser.id];
             return { ...talk, reactions, userReactions, currentUserReaction: undefined };
          } else {
             // Add/Switch
             if (oldEmoji) {
                reactions[oldEmoji] = Math.max(0, (reactions[oldEmoji] || 0) - 1);
                if (reactions[oldEmoji] === 0) delete reactions[oldEmoji];
             }
             reactions[emoji] = (reactions[emoji] || 0) + 1;
             userReactions[currentUser.id] = emoji;
             return { ...talk, reactions, userReactions, currentUserReaction: emoji };
          }
        }
        return talk;
      }));

      // 2. Real Backend Call
      try {
        const config = { headers: { Authorization: `Bearer ${currentToken}` } };
        const response = await axios.post(`/api/startalks/${talkId}/react`, { emoji }, config);
        
        if (response.data.success) {
            // 3. Sync with exact server data
            const updatedTalk = response.data.startalk;
            // Identify my reaction from server data
            const myReaction = updatedTalk.userReactions ? updatedTalk.userReactions[currentUser.id] : undefined;
            
            setStartalks(prev => prev.map(t => 
                t.id === talkId ? { ...updatedTalk, currentUserReaction: myReaction } : t
            ));
        }
      } catch (error) {
        console.error("Reaction failed:", error);
      }
  };

  // --- Helper Functions ---
  const getIdeaById = (id: string) => startupIdeas.find(idea => idea.id === id);
  const getPositionById = (ideaId: string, positionId: string) => getIdeaById(ideaId)?.positions.find(pos => pos.id === positionId);
  
  const getUserById = useCallback((identifier: string, by: 'id' | 'email' = 'id') => {
    const allUsers = [...users];
    if (currentUser && !allUsers.find(u => u.id === currentUser.id)) allUsers.push(currentUser);
    return by === 'id' ? allUsers.find(u => u.id === identifier) : allUsers.find(u => u.email === identifier);
  }, [users, currentUser]);

  const fetchUserProfile = useCallback(async (userId: string) => {
    const existingUser = users.find(u => u.id === userId);
    if (existingUser) return existingUser;
    try {
        const response = await axios.get(`/api/auth/users/${userId}`);
        if (response.data.success) {
            const fetchedUser = response.data.user;
            setUsers(prev => {
                if (prev.find(u => u.id === fetchedUser.id)) return prev;
                return [...prev, fetchedUser];
            });
            return fetchedUser;
        }
    } catch (error) {
        console.error("Fetch User Error:", error);
        return null;
    }
    return null;
  }, [users]);


  // --- Notifications ---
  const markNotificationAsRead = (id: string) => {
    setAppNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n));
  };
  const markAllNotificationsAsRead = (cat?: NotificationCategory) => {
      if (cat) {
        setAppNotifications(prev => prev.map(n => n.category === cat ? {...n, isRead: true} : n));
    } else {
        setAppNotifications(prev => prev.map(n => ({...n, isRead: true})));
    }
  };

  // --- REAL BACKEND API: Connection Request ---
  const sendConnectionRequest = async (targetUserId: string) => {
    if (!currentUser) return;
    const currentToken = token || localStorage.getItem('authToken');
    try {
        const config = { headers: { Authorization: `Bearer ${currentToken}` } };
        const response = await axios.post(`/api/connections/request/${targetUserId}`, {}, config);
        
        if (response.data.success) {
            setSentConnectionRequests(prev => [...prev, targetUserId]);
            addNotificationCallBack("Connection request sent!", "success");
        }
    } catch (error: any) {
        console.error("Connection Error:", error);
        addNotificationCallBack(error.response?.data?.message || "Failed to send request.", "error");
    }
  };

  const acceptConnectionRequest = async (requesterId: string) => {
    if (!currentUser) return;
    const currentToken = token || localStorage.getItem('authToken');
    try {
        const config = { headers: { Authorization: `Bearer ${currentToken}` } };
        const response = await axios.post(`/api/connections/accept/${requesterId}`, {}, config);
        
        if (response.data.success) {
  addNotificationCallBack("You are now connected!", "success");
  fetchConnections(); // ✅ sync again
}
    } catch (error) {
        addNotificationCallBack("Failed to accept request.", "error");
    }
  };

  // Placeholders
  const updateIdea = (ideaId: string, updates: any) => {};
  const deleteIdea = (projectId: string) => {};
  const addApplication = (appData: any) => {};
  const updateApplicationStatus = (appId: string, status: any) => {};
  const removeApplication = (appId: string) => {};
  const declineConnectionRequest = (id: string) => {};
  const removeConnection = (id: string) => {};

  const isRequestPending = (id: string) => sentConnectionRequests.includes(id);
  const isUserConnected = (id: string) => connectedUserIds.includes(id);

  // --- INITIALIZATION ---
  useEffect(() => {
    setIsLoading(true);
    const loadInitialData = async () => {
      try {
          const response = await axios.get('/api/ideas');
          if (response.data.success) setStartupIdeas(response.data.ideas);
      } catch (error) { console.error("Failed to fetch ideas", error); }

      try {
          // Fetch Startalks and map current user reaction
          const response = await axios.get('/api/startalks');
          if (response.data.success) {
              const fetchedTalks = response.data.startalks.map((t: any) => {
                  let myReaction = undefined;
                  if (t.userReactions && currentUser) {
                      myReaction = t.userReactions[currentUser.id];
                  }
                  return { ...t, currentUserReaction: myReaction };
              });
              setStartalks(fetchedTalks);
          }
      } catch (error) { console.error("Failed to fetch startalks", error); }

      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
          try {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser.id && parsedUser.id.toString().startsWith('user-')) { 
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('user');
                  setToken(null);
                  setCurrentUser(null);
              } else {
                  setToken(storedToken);
                  setCurrentUser(parsedUser);
                  // ❌ connections local se mat uthao
if (parsedUser.sentRequests)
  setSentConnectionRequests(parsedUser.sentRequests);

// ✅ backend se uthao
setTimeout(() => {
  fetchConnections();
}, 0);
              }
          } catch (e) {
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
          }
      }
      setIsLoading(false);
    };
    loadInitialData();
  }, [currentUser?.id]); 

  const contextValue = useMemo(() => ({
    startupIdeas, startalks, applications, notifications, currentUser, users, token, appNotifications, isLoading, authLoadingState, showOnboardingModal,
    addIdea, addStartalk, deleteStartalk, reactToStartalk, updateIdea, deleteIdea, addApplication, addNotification: addNotificationCallBack, removeNotification, getIdeaById, getPositionById,
    login, signup, verifyAndLogin, logout, updateUser, updateApplicationStatus,
    removeApplication,
    saveProject, unsaveProject, isProjectSaved, getUserById, 
    fetchUserProfile,
    markNotificationAsRead, markAllNotificationsAsRead,
    sentConnectionRequests, connectedUserIds,fetchConnections,  sendConnectionRequest,
    acceptConnectionRequest, declineConnectionRequest, removeConnection,
    isRequestPending, isUserConnected,
    setShowOnboardingModal,
  }), [
    startupIdeas, startalks, applications, notifications, currentUser, users, token, appNotifications, isLoading, authLoadingState, showOnboardingModal,
    addNotificationCallBack, getUserById, fetchUserProfile, sentConnectionRequests, connectedUserIds
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};