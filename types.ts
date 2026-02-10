
// FIX: Import React to use React types like React.ReactElement and React.Dispatch.
import React from 'react';

export interface Position {
  id: string;
  title: string;
  description: string;
  type: 'Paid' | 'Unpaid' | 'Equity' | 'Part-time' | 'Flexible'; // Updated position types
  skills: string[];
  isOpen: boolean;
  equityOffered?: string;
  salaryRange?: string;
  questions?: string[]; // Added custom questions for the position
}

export type StartupCategory = 'AI/ML' | 'SaaS' | 'FinTech' | 'HealthTech' | 'EdTech' | 'E-commerce & Retail' | 'Marketplace' | 'Creator Economy' | 'Social Media & Networking' | 'Gaming & eSports' | 'Sustainability & Climate Tech' | 'Clean Energy' | 'AgriTech' | 'FoodTech' | 'Biotechnology' | 'Cybersecurity' | 'DevTools' | 'No-Code/Low-Code' | 'AR/VR' | 'IoT' | 'Robotics & Drones' | '3D Printing' | 'Blockchain & Web3' | 'Future of Work' | 'HR Tech' | 'PropTech' | 'LegalTech' | 'GovTech' | 'InsurTech' | 'Travel & Hospitality' | 'Media & Entertainment' | 'Logistics & Supply Chain' | 'Transportation & Mobility' | 'Wellness & Fitness' | 'Mental Health' | 'FemTech' | 'Hardware' | 'SpaceTech' | 'Non-Profit' | 'Other';

export type BusinessModel = 'B2B' | 'B2C' | 'B2B2C' | 'C2C' | 'D2C' | 'Other';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export interface Startalk {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorHeadline?: string;
  content: string;
  imageUrl?: string; // Optional image attached to the talk
  timestamp: string;
  reactions: Record<string, number>;
  currentUserReaction?: string; // Tracks which emoji the current user used
}

export interface StartupIdea {
  id: string;
  title: string;
  tagline: string;
  description: string;
  founderId: string; 
  founderName: string; 
  founderEmail: string; 
  contactEmail?: string;
  tags: string[];
  imageUrl: string;
  postedDate: string; 
  positions: Position[];
  stage: 'Idea Stage' | 'Validation Stage' | 'MVP Stage' | 'Pre-Seed Stage' | 'Fundraising Stage' | 'Scaling Stage' | 'Launched' | 'Acquired';
  websiteUrl?: string;
  teamSize?: number;
  location?: string; 
  targetDate?: string;
  lookingForSummary: string[]; 
  requirementsSummary: string[];
  category?: StartupCategory;
  businessModel?: BusinessModel;
  workMode?: WorkMode;
  // Venture Exchange Fields
  problem?: string;
  spark?: string;
  buildingNow?: string;
  missionProgress?: number; // 0 to 100
  founderQuote?: string;
  techStack?: string[];
  revenueModel?: string;
  mrr?: string; 
  users?: string; 
  growth?: string; 
  upvotes?: number;
  askingPrice?: string; // e.g., "$150,000"
  ttmRevenue?: string; // e.g., "$45k"
  multiplier?: string; // e.g., "3.5x"
  isVerified?: boolean;
  // FIX: Added missing fields used in AssetDetailsPage and SubmitAssetPage
  siteAge?: string;
  directTraffic?: string;
  retention?: string;
  trafficDetails?: string;
  handoverNotes?: string;
  reasonForSale?: string;
  sellerInsightsDetails?: string;
  netProfit?: string;
  churnRate?: string;
  paymentMethods?: string;
  additionalContactDetails?: string;
  // Added missing fields used in AssetDetailsPage
  growthPulse?: string;
  teamDetails?: string;
  competitorInfo?: string;
  reactions?: { 
    inspired: number;
    rocket: number;
    heart: number;
  };
}

export interface Application {
  id: string;
  ideaId: string;
  positionId: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
  resumeUrl?: string;
  status: 'Pending' | 'Reviewed' | 'Rejected' | 'Accepted';
  submittedDate: string; 
  answers?: { question: string; answer: string }[]; // Added answers to screening questions
}

export interface AppSystemNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type NotificationCategory = 'applications_to_my_project' | 'messages' | 'projects' | 'connections';

export type AppNotificationStatus = 'pending' | 'accepted' | 'rejected' | 'read';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  icon: React.ReactElement<{ className?: string }>; 
  title: string;
  description: string;
  timestamp: string; 
  isRead: boolean;
  status?: AppNotificationStatus; 
  link?: string; 
  actionText?: string; 
  onActionClick?: () => void; 
  relatedUserId?: string; 
  relatedProjectId?: string; 
  relatedApplicationId?: string;
}

export interface ActivityItem {
  id: string;
  type: 'project_created' | 'application_submitted' | 'profile_updated' | string; 
  title: string;
  description: string;
  timestamp: string; 
  icon: React.ReactElement<{ className?: string }>; 
  link?: string;
  iconBgColor?: string; 
  iconTextColor?: string; 
}


export interface User {
  id: string; 
  name: string;
  email: string;
  bio?: string;
  skills?: string[];
  headline?: string;
  country?: string; 
  interests?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
  };
  profilePictureUrl?: string; 
  savedProjectIds?: string[]; 
    connections?: string[];        
    connectionRequests?: string[]; 
    sentRequests?: string[];  
}

export type UserProfileUpdate = {
  name?: string;
  email?: string; 
  bio?: string;
  skills?: string[];
  headline?: string;
  country?: string;
  interests?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
  };
  profilePictureUrl?: string; 
  savedProjectIds?: string[];
};

export type AppContextType = {
  startupIdeas: StartupIdea[];
  startalks: Startalk[];
  applications: Application[];
  notifications: AppSystemNotification[]; 
  currentUser: User | null;
  users: User[]; 
  token: string | null;
  appNotifications: AppNotification[]; 
  addIdea: (ideaData: Omit<StartupIdea, 'id' | 'postedDate' | 'imageUrl' | 'positions' | 'lookingForSummary' | 'requirementsSummary' | 'founderId' | 'founderEmail'> & { positionsData: Omit<Position, 'id' | 'isOpen'>[]; imageDataUrl?: string; businessModel?: BusinessModel; workMode?: WorkMode; location?: string; }) => void;
  updateIdea: (ideaId: string, updates: Partial<Omit<StartupIdea, 'id'>>) => void;
  deleteIdea: (projectId: string) => void;
  addStartalk: (content: string, imageUrl?: string) => void;
  deleteStartalk: (talkId: string) => void;
  reactToStartalk: (talkId: string, emoji: string) => void;
  addApplication: (application: Omit<Application, 'id' | 'status' | 'submittedDate'>) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  removeApplication: (applicationId: string) => void;
  addNotification: (message: string, type: AppSystemNotification['type']) => void;
  removeNotification: (id: string) => void; 
  getIdeaById: (id: string) => StartupIdea | undefined;
  getPositionById: (ideaId: string, positionId: string) => Position | undefined;
  login: (credential: string, password?: string, fromSignup?: boolean) => Promise<boolean>; 
  signup: (email: string, password?: string) => Promise<boolean>; 
  verifyAndLogin: (code: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: UserProfileUpdate) => Promise<boolean>;
  isLoading: boolean;
  authLoadingState: {
    isLoading: boolean;
    messages: string[];
  };
  
  saveProject: (projectId: string) => void;
  unsaveProject: (projectId: string) => void;
  isProjectSaved: (projectId: string) => boolean;
  getUserById: (identifier: string, by?: 'id' | 'email') => User | undefined;
 fetchUserProfile: (userId: string) => Promise<User | null>;
  markNotificationAsRead: (notificationId: string) => void; 
  markAllNotificationsAsRead: (category?: NotificationCategory) => void; 

  sentConnectionRequests: string[]; 
  connectedUserIds: string[]; 
  sendConnectionRequest: (targetUserId: string) => void;
  isRequestPending: (targetUserId: string) => boolean;
  isUserConnected: (targetUserId: string) => boolean;
  acceptConnectionRequest: (notificationId: string) => void; 
  declineConnectionRequest: (notificationId: string) => void; 
  removeConnection: (targetUserId: string) => void; 

  showOnboardingModal: boolean;
  setShowOnboardingModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export type MessageType = 'text' | 'image' | 'document' | 'system';

export interface FileAttachment {
  name: string;
  url: string; 
  mimeType: string;
  size?: number; 
}

export interface DetailedMessage {
  id: string;
  senderId: string; 
  text?: string; 
  timestamp: string;
  type: MessageType;
  file?: FileAttachment; 
  isRead?: boolean; 
}

export interface ChatContact {
  id: string;
  name: string;
  avatarUrl?: string; 
  isOnline?: boolean; 
}

export interface ChatConversation {
  id: string;
  contact: ChatContact; 
  messages: DetailedMessage[];
  lastMessagePreview?: string;
  lastMessageTimestamp?: string;
  unreadCount?: number;
  isTeam?: boolean; 
  memberIds?: string[]; 
  adminId?: string; 
  members?: User[]; 
  description?: string; 
}
