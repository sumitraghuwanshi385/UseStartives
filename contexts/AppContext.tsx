import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import axios from 'axios';

import {
  StartupIdea,
  Application,
  AppSystemNotification,
  AppContextType,
  User,
  UserProfileUpdate,
  AppNotification,
  NotificationCategory,
  Startalk,
} from '../types';

import { EnvelopeOpenIcon } from '../constants';

axios.defaults.withCredentials = true;

// --- Initial Mock Notifications ---
const INITIAL_APP_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'appReceived1',
    category: 'applications_to_my_project' as NotificationCategory,
    icon: React.createElement(EnvelopeOpenIcon, { className: 'w-5 h-5 text-sky-500' }),
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
  const [appNotifications, setAppNotifications] = useState<AppNotification[]>(INITIAL_APP_NOTIFICATIONS);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ✅ production-safe: start empty; fill from backend (connections/users endpoints)
  const [users, setUsers] = useState<User[]>([]);

  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  const [authLoadingState, setAuthLoadingState] = useState({ isLoading: false, messages: [] as string[] });
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [pendingVerificationUser, setPendingVerificationUser] = useState<{ email: string; code: string } | null>(null);

  const [sentConnectionRequests, setSentConnectionRequests] = useState<string[]>([]);
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([]);

  const addNotificationCallBack = useCallback((message: string, type: AppSystemNotification['type']) => {
    const newNotification: AppSystemNotification = {
      id: new Date().toISOString() + Math.random(),
      message,
      type,
    };
    setNotifications((prev) => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ✅ helper: always get latest token
  const getAuthToken = () => token || localStorage.getItem('authToken');

  // ✅ SOURCE OF TRUTH: fetch connected users from backend
  const fetchConnections = useCallback(async () => {
    const t = getAuthToken();
    if (!t) return;

    try {
      const res = await axios.get('/api/connections', {
        headers: { Authorization: `Bearer ${t}` },
      });

      if (res.data?.success) {
        const backendUsers = res.data.connections || [];

        // connected IDs
        const ids = backendUsers.map((u: any) => (u.id ? u.id : u._id)).filter(Boolean);
        setConnectedUserIds(ids);

        // merge users into users[] (map _id -> id)
        setUsers((prev) => {
          const existing = new Set(prev.map((u) => u.id));
          const mapped: User[] = backendUsers.map((u: any) => ({
            id: u.id || u._id,
            name: u.name || '',
            email: u.email || '',
            headline: u.headline,
            country: u.country,
            bio: u.bio,
            skills: u.skills || [],
            interests: u.interests || [],
            socialLinks: u.socialLinks || {},
            profilePictureUrl: u.profilePictureUrl || '',
            connections: u.connections || [],
            connectionRequests: u.connectionRequests || [],
            sentRequests: u.sentRequests || [],
            savedProjectIds: u.savedProjectIds || [],
          }));

          const newOnes = mapped.filter((u) => !existing.has(u.id));
          return [...prev, ...newOnes];
        });
      }
    } catch (err) {
      console.error('fetchConnections failed', err);
    }
  }, [token]);

  // -------------------- AUTH --------------------

  const login: AppContextType['login'] = async (credential, password, fromSignup = false) => {
    setAuthLoadingState({ isLoading: true, messages: ['Authenticating...'] });

    try {
      const response = await axios.post('/api/auth/login', { email: credential, password });

      if (!response.data?.success) {
        addNotificationCallBack(response.data?.message || 'Login failed.', 'error');
        return false;
      }

      const { user, token: newToken } = response.data;

      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(newToken);
      setCurrentUser(user);

      if (user?.sentRequests) setSentConnectionRequests(user.sentRequests);
      if (user?.connections) setConnectedUserIds(user.connections);

      // ✅ sync real connections/users after login
      await fetchConnections();

      setShowOnboardingModal(fromSignup || !user?.headline);
      return true;
    } catch (error: any) {
      console.error('Login API Error:', error);
      addNotificationCallBack(error?.response?.data?.message || 'Something went wrong.', 'error');
      return false;
    } finally {
      setAuthLoadingState({ isLoading: false, messages: [] });
    }
  };

  const signup: AppContextType['signup'] = async (email, password) => {
    setAuthLoadingState({ isLoading: true, messages: ['Creating account...'] });

    try {
      const response = await axios.post('/api/auth/signup', { email, password });

      if (!response.data?.success) {
        addNotificationCallBack(response.data?.message || 'Signup failed.', 'error');
        return false;
      }

      setPendingVerificationUser({ email, code: response.data.verificationCode });
      addNotificationCallBack(`Verification code sent to ${email}.`, 'info');
      return true;
    } catch (error: any) {
      console.error('Signup API Error:', error);
      addNotificationCallBack(error?.response?.data?.message || 'Something went wrong.', 'error');
      return false;
    } finally {
      setAuthLoadingState({ isLoading: false, messages: [] });
    }
  };

  const verifyAndLogin: AppContextType['verifyAndLogin'] = async (code) => {
    setAuthLoadingState({ isLoading: true, messages: ['Verifying...'] });
    try {
      if (pendingVerificationUser && pendingVerificationUser.code === code) {
        await login(pendingVerificationUser.email, 'password123', true);
        setPendingVerificationUser(null);
        return true;
      }
      addNotificationCallBack('Invalid verification code.', 'error');
      return false;
    } finally {
      setAuthLoadingState({ isLoading: false, messages: [] });
    }
  };

  const logout: AppContextType['logout'] = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    setToken(null);
    setCurrentUser(null);

    setConnectedUserIds([]);
    setSentConnectionRequests([]);
    setUsers([]);
  };

  // -------------------- PROFILE --------------------

  const updateUser: AppContextType['updateUser'] = async (updates: UserProfileUpdate) => {
    if (!currentUser) return false;

    const t = getAuthToken();
    if (!t) {
      addNotificationCallBack('You are not logged in. Please refresh.', 'error');
      return false;
    }

    setAuthLoadingState({ isLoading: true, messages: ['Updating profile...'] });

    try {
      const response = await axios.put(
        '/api/auth/profile',
        { id: currentUser.id, ...updates },
        { headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } }
      );

      if (!response.data?.success) {
        addNotificationCallBack(response.data?.message || 'Failed to update profile.', 'error');
        return false;
      }

      const updatedUserData = response.data.user;
      setCurrentUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));

      // update user cache list
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUserData : u)));
      return true;
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      addNotificationCallBack(error?.response?.data?.message || 'Something went wrong.', 'error');
      return false;
    } finally {
      setAuthLoadingState({ isLoading: false, messages: [] });
    }
  };

  // -------------------- IDEAS --------------------

  const addIdea: AppContextType['addIdea'] = (ideaData) => {
    if (!currentUser) return;

    void (async () => {
      const t = getAuthToken();
      try {
        const res = await axios.post('/api/ideas', ideaData, { headers: { Authorization: `Bearer ${t}` } });
        if (res.data?.success) {
          setStartupIdeas((prev) => [res.data.idea, ...prev]);
          addNotificationCallBack('Project launched successfully!', 'success');
        }
      } catch (err: any) {
        console.error('Add Idea Error:', err);
        addNotificationCallBack(err?.response?.data?.message || 'Failed to launch project.', 'error');
      }
    })();
  };

  const updateIdea: AppContextType['updateIdea'] = () => {};
  const deleteIdea: AppContextType['deleteIdea'] = () => {};

  // -------------------- STARTALKS --------------------

  const addStartalk: AppContextType['addStartalk'] = (content, imageUrl) => {
    if (!currentUser) return;

    void (async () => {
      const t = getAuthToken();
      try {
        const res = await axios.post('/api/startalks', { content, imageUrl }, { headers: { Authorization: `Bearer ${t}` } });
        if (res.data?.success) {
          setStartalks((prev) => [res.data.startalk, ...prev]);
          addNotificationCallBack('Post shared!', 'success');
        }
      } catch {
        addNotificationCallBack('Failed to post.', 'error');
      }
    })();
  };

  const deleteStartalk: AppContextType['deleteStartalk'] = (talkId) => {
    void (async () => {
      const t = getAuthToken();
      try {
        await axios.delete(`/api/startalks/${talkId}`, { headers: { Authorization: `Bearer ${t}` } });
        setStartalks((prev) => prev.filter((t) => t.id !== talkId));
        addNotificationCallBack('Post removed.', 'info');
      } catch {
        addNotificationCallBack('Failed to delete post.', 'error');
      }
    })();
  };

  const reactToStartalk: AppContextType['reactToStartalk'] = (talkId, emoji) => {
    if (!currentUser) return;

    // optimistic
    setStartalks((prev) =>
      prev.map((talk: any) => {
        if (talk.id !== talkId) return talk;
        const reactions = { ...(talk.reactions || {}) };
        const userReactions = { ...(talk.userReactions || {}) };
        const oldEmoji = userReactions[currentUser.id];

        if (oldEmoji === emoji) {
          reactions[emoji] = Math.max(0, (reactions[emoji] || 0) - 1);
          if (reactions[emoji] === 0) delete reactions[emoji];
          delete userReactions[currentUser.id];
          return { ...talk, reactions, userReactions, currentUserReaction: undefined };
        }

        if (oldEmoji) {
          reactions[oldEmoji] = Math.max(0, (reactions[oldEmoji] || 0) - 1);
          if (reactions[oldEmoji] === 0) delete reactions[oldEmoji];
        }

        reactions[emoji] = (reactions[emoji] || 0) + 1;
        userReactions[currentUser.id] = emoji;
        return { ...talk, reactions, userReactions, currentUserReaction: emoji };
      })
    );

    void (async () => {
      const t = getAuthToken();
      try {
        const res = await axios.post(`/api/startalks/${talkId}/react`, { emoji }, { headers: { Authorization: `Bearer ${t}` } });
        if (res.data?.success) {
          const updatedTalk = res.data.startalk;
          const myReaction = updatedTalk.userReactions ? updatedTalk.userReactions[currentUser.id] : undefined;
          setStartalks((prev) => prev.map((x) => (x.id === talkId ? { ...updatedTalk, currentUserReaction: myReaction } : x)));
        }
      } catch (err) {
        console.error('Reaction failed:', err);
      }
    })();
  };

  // -------------------- USERS HELPERS --------------------

  const getIdeaById: AppContextType['getIdeaById'] = (id) => startupIdeas.find((x) => x.id === id);
  const getPositionById: AppContextType['getPositionById'] = (ideaId, positionId) =>
    startupIdeas.find((x) => x.id === ideaId)?.positions.find((p: any) => p.id === positionId);

  const getUserById = useCallback<AppContextType['getUserById']>(
    (identifier, by = 'id') => {
      const all = [...users];
      if (currentUser && !all.find((u) => u.id === currentUser.id)) all.push(currentUser);
      return by === 'id' ? all.find((u) => u.id === identifier) : all.find((u) => u.email === identifier);
    },
    [users, currentUser]
  );

  const fetchUserProfile: AppContextType['fetchUserProfile'] = useCallback(
    async (userId) => {
      const existing = users.find((u) => u.id === userId);
      if (existing) return existing;

      try {
        const res = await axios.get(`/api/auth/users/${userId}`);
        if (res.data?.success) {
          const fetchedUser = res.data.user;
          setUsers((prev) => (prev.find((u) => u.id === fetchedUser.id) ? prev : [...prev, fetchedUser]));
          return fetchedUser;
        }
      } catch (err) {
        console.error('Fetch User Error:', err);
      }
      return null;
    },
    [users]
  );

  // -------------------- NOTIFICATIONS --------------------

  const markNotificationAsRead: AppContextType['markNotificationAsRead'] = (id) => {
    setAppNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead: AppContextType['markAllNotificationsAsRead'] = (cat) => {
    if (cat) setAppNotifications((prev) => prev.map((n) => (n.category === cat ? { ...n, isRead: true } : n)));
    else setAppNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // -------------------- CONNECTIONS --------------------

  const sendConnectionRequest: AppContextType['sendConnectionRequest'] = (targetUserId) => {
    if (!currentUser) return;

    void (async () => {
      const t = getAuthToken();
      try {
        const res = await axios.post(`/api/connections/request/${targetUserId}`, {}, { headers: { Authorization: `Bearer ${t}` } });
        if (res.data?.success) {
          setSentConnectionRequests((prev) => [...prev, targetUserId]);
          addNotificationCallBack('Connection request sent!', 'success');
        }
      } catch (err: any) {
        console.error('Connection Error:', err);
        addNotificationCallBack(err?.response?.data?.message || 'Failed to send request.', 'error');
      }
    })();
  };

  const acceptConnectionRequest: AppContextType['acceptConnectionRequest'] = (requesterId) => {
    if (!currentUser) return;

    void (async () => {
      const t = getAuthToken();
      try {
        const res = await axios.post(`/api/connections/accept/${requesterId}`, {}, { headers: { Authorization: `Bearer ${t}` } });
        if (res.data?.success) {
          addNotificationCallBack('You are now connected!', 'success');
          await fetchConnections();
        }
      } catch {
        addNotificationCallBack('Failed to accept request.', 'error');
      }
    })();
  };

  const declineConnectionRequest: AppContextType['declineConnectionRequest'] = () => {};
  const removeConnection: AppContextType['removeConnection'] = () => {};

  const isRequestPending: AppContextType['isRequestPending'] = (id) => sentConnectionRequests.includes(id);
  const isUserConnected: AppContextType['isUserConnected'] = (id) => connectedUserIds.includes(id);

  // -------------------- APPLICATIONS (placeholders) --------------------
  const addApplication: AppContextType['addApplication'] = () => {};
  const updateApplicationStatus: AppContextType['updateApplicationStatus'] = () => {};
  const removeApplication: AppContextType['removeApplication'] = () => {};

  // -------------------- SAVE PROJECT --------------------
  const saveProject: AppContextType['saveProject'] = () => {};
  const unsaveProject: AppContextType['unsaveProject'] = () => {};
  const isProjectSaved: AppContextType['isProjectSaved'] = () => false;

  // -------------------- INITIAL LOAD --------------------
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      try {
        const ideasRes = await axios.get('/api/ideas');
        if (ideasRes.data?.success) setStartupIdeas(ideasRes.data.ideas || []);
      } catch (e) {
        console.error('Failed to fetch ideas', e);
      }

      try {
        const talksRes = await axios.get('/api/startalks');
        if (talksRes.data?.success) setStartalks(talksRes.data.startalks || []);
      } catch (e) {
        console.error('Failed to fetch startalks', e);
      }

      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setCurrentUser(parsedUser);

          if (parsedUser?.sentRequests) setSentConnectionRequests(parsedUser.sentRequests);
          if (parsedUser?.connections) setConnectedUserIds(parsedUser.connections);

          // ✅ sync from backend
          setTimeout(() => {
            fetchConnections();
          }, 0);
        } catch {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }

      setIsLoading(false);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = useMemo<AppContextType>(
    () => ({
      startupIdeas,
      startalks,
      applications,
      notifications,
      currentUser,
      users,
      token,
      appNotifications,
      addIdea,
      updateIdea,
      deleteIdea,
      addStartalk,
      deleteStartalk,
      reactToStartalk,
      addApplication,
      updateApplicationStatus,
      removeApplication,
      addNotification: addNotificationCallBack,
      removeNotification,
      getIdeaById,
      getPositionById,
      login,
      signup,
      verifyAndLogin,
      logout,
      updateUser,
      isLoading,
      authLoadingState,
      saveProject,
      unsaveProject,
      isProjectSaved,
      getUserById,
      fetchUserProfile,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      sentConnectionRequests,
      connectedUserIds,
      sendConnectionRequest,
      acceptConnectionRequest,
      declineConnectionRequest,
      removeConnection,
      isRequestPending,
      isUserConnected,
      showOnboardingModal,
      setShowOnboardingModal,
    }),
    [
      startupIdeas,
      startalks,
      applications,
      notifications,
      currentUser,
      users,
      token,
      appNotifications,
      addNotificationCallBack,
      isLoading,
      authLoadingState,
      showOnboardingModal,
      sentConnectionRequests,
      connectedUserIds,
      getUserById,
      fetchUserProfile,
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};