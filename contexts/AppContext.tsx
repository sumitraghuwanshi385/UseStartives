import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
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
  Position,
} from '../types';

import { MOCK_USERS_RAW, EnvelopeOpenIcon } from '../constants';

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

  // NOTE: Abhi mock users fallback; baad me real users endpoint se replace kar dena
  const [users, setUsers] = useState<User[]>(MOCK_USERS_RAW);

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

  const getAuthToken = () => token || localStorage.getItem('authToken');

  // ✅ optional: connections sync (agar aapka backend /api/connections GET deta hai)
  const fetchConnections = useCallback(async () => {
    const t = getAuthToken();
    if (!t) return;

    try {
      const res = await axios.get('/api/connections', {
        headers: { Authorization: `Bearer ${t}` },
      });

      if (res.data?.success) {
        const backendUsers = res.data.connections || [];
        const ids = backendUsers.map((u: any) => u.id || u._id).filter(Boolean);
        setConnectedUserIds(ids);

        // merge real users into users list (id mapping)
        setUsers((prev) => {
          const existing = new Set(prev.map((u) => u.id));
          const mapped: User[] = backendUsers.map((u: any) => ({
            id: u.id || u._id,
            name: u.name || '',
            email: u.email || '',
            headline: u.headline,
            country: u.country,
            bio: u.bio,
            profilePictureUrl: u.profilePictureUrl || '',
            skills: u.skills || [],
            interests: u.interests || [],
            socialLinks: u.socialLinks || {},
            savedProjectIds: u.savedProjectIds || [],
            connections: u.connections || [],
            connectionRequests: u.connectionRequests || [],
            sentRequests: u.sentRequests || [],
          }));
          const add = mapped.filter((u) => !existing.has(u.id));
          return [...prev, ...add];
        });
      }
    } catch (err) {
      console.error('fetchConnections failed', err);
    }
  }, [token]);

  // ---------------- AUTH ----------------

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

      if (user?.connections) setConnectedUserIds(user.connections);
      if (user?.sentRequests) setSentConnectionRequests(user.sentRequests);

      // optional sync
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
  };

  // ---------------- PROFILE ----------------

  const updateUser: AppContextType['updateUser'] = async (updates: UserProfileUpdate) => {
    if (!currentUser) return false;

    const t = getAuthToken();
    if (!t) {
      addNotificationCallBack('You are not logged in.', 'error');
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
      setUsers((prev) => prev.map((u) => (u.id === updatedUserData.id ? updatedUserData : u)));
      return true;
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      addNotificationCallBack(error?.response?.data?.message || 'Something went wrong.', 'error');
      return false;
    } finally {
      setAuthLoadingState({ isLoading: false, messages: [] });
    }
  };

  // ---------------- IDEAS (minimal placeholders) ----------------
  const addIdea: AppContextType['addIdea'] = () => {};
  const updateIdea: AppContextType['updateIdea'] = () => {};
  const deleteIdea: AppContextType['deleteIdea'] = () => {};

  // ---------------- STARTALKS (keep your existing if needed) ----------------
  const addStartalk: AppContextType['addStartalk'] = () => {};
  const deleteStartalk: AppContextType['deleteStartalk'] = () => {};
  const reactToStartalk: AppContextType['reactToStartalk'] = () => {};

  // ---------------- APPLICATIONS placeholders ----------------
  const addApplication: AppContextType['addApplication'] = () => {};
  const updateApplicationStatus: AppContextType['updateApplicationStatus'] = () => {};
  const removeApplication: AppContextType['removeApplication'] = () => {};

  // ---------------- Notifications ----------------
  const markNotificationAsRead: AppContextType['markNotificationAsRead'] = (id) => {
    setAppNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead: AppContextType['markAllNotificationsAsRead'] = (cat) => {
    if (cat) setAppNotifications((prev) => prev.map((n) => (n.category === cat ? { ...n, isRead: true } : n)));
    else setAppNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // ---------------- Connections ----------------
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

  // ---------------- Saved projects placeholders ----------------
  const saveProject: AppContextType['saveProject'] = () => {};
  const unsaveProject: AppContextType['unsaveProject'] = () => {};
  const isProjectSaved: AppContextType['isProjectSaved'] = () => false;

  // ---------------- Helpers ----------------
  const getIdeaById: AppContextType['getIdeaById'] = (id) => startupIdeas.find((x) => x.id === id);

  const getPositionById: AppContextType['getPositionById'] = (ideaId, positionId) =>
    startupIdeas.find((x) => x.id === ideaId)?.positions.find((p: Position) => p.id === positionId);

  const getUserById = useCallback<AppContextType['getUserById']>(
    (identifier, by = 'id') => {
      const all = [...users];
      if (currentUser && !all.find((u) => u.id === currentUser.id)) all.push(currentUser);
      return by === 'id' ? all.find((u) => u.id === identifier) : all.find((u) => u.email === identifier);
    },
    [users, currentUser]
  );

  const fetchUserProfile: AppContextType['fetchUserProfile'] = useCallback(async (userId) => {
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
  }, []);

  // ---------------- INITIALIZATION ----------------
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      // load startalks/ideas if needed (optional)
      try {
        const response = await axios.get('/api/startalks');
        if (response.data?.success) setStartalks(response.data.startalks || []);
      } catch {}

      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setCurrentUser(parsedUser);

          if (parsedUser?.sentRequests) setSentConnectionRequests(parsedUser.sentRequests);
          if (parsedUser?.connections) setConnectedUserIds(parsedUser.connections);

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

    loadInitialData();
  }, [fetchConnections]);

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
      isLoading,
      authLoadingState,
      showOnboardingModal,
      setShowOnboardingModal,

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
      isLoading,
      authLoadingState,
      showOnboardingModal,
      sentConnectionRequests,
      connectedUserIds,
      addNotificationCallBack,
      getIdeaById,
      getPositionById,
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