
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostIdeaPage from './pages/PostIdeaPage';
import IdeaDetailPage from './pages/IdeaDetailPage';
import AssetDetailsPage from './pages/AssetDetailsPage';
import SubmitAssetPage from './pages/SubmitAssetPage';
import EditAssetPage from './pages/EditAssetPage';
import ApplyPage from './pages/ApplyPage';
import NotificationArea from './components/NotificationArea';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsListPage from './pages/ProjectsListPage';
import StartalksPage from './pages/StartalksPage';
import StartupStoriesPage from './pages/StartupStoriesPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import MyProjectsPage from './pages/MyProjectsPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import PublicProfilePage from './pages/PublicProfilePage'; 
import SavedProjectsPage from './pages/SavedProjectsPage'; 
import ActivityLogPage from './pages/ActivityLogPage';
import PlaceholderContentPage from './pages/PlaceholderContentPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NewPasswordPage from './pages/NewPasswordPage';
import { TeamDetailPage } from './pages/TeamDetailPage';
import OnboardingPage from './components/OnboardingModal';
import VerifyEmailPage from './pages/VerifyEmailPage';
import EditProjectPage from './pages/EditProjectPage';
import FullScreenLoader from './components/FullScreenLoader';
import ContactUsPage from './pages/ContactUsPage';
import SearchPage from './pages/SearchPage';
import { useAppContext } from './contexts/AppContext';
import FloatingActionMenu from './components/FloatingActionMenu';

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, description, className = "" }) => (
  <div className={`mb-8 ${className}`}>
    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight font-poppins">{title}</h1>
    {description && <p className="text-[var(--text-muted)] mt-2 text-sm sm:text-base font-poppins">{description}</p>}
  </div>
);

const WithPageContainer: React.FC<{ children: React.ReactNode, pageClassName?: string }> = ({ children, pageClassName = "container mx-auto px-4 sm:px-6 lg:px-8 py-8" }) => (
  <div className={pageClassName}>
    {children}
  </div>
);

const App: React.FC = () => {
  const location = useLocation();
  const { currentUser, showOnboardingModal, authLoadingState } = useAppContext(); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const noHeaderRoutes = ['/login', '/signup', '/verify-email', '/forgot-password', '/new-password'];
  const staticPages = ['/about', '/privacy-policy', '/contact-us', '/sponsorship'];
  const showHeader = !noHeaderRoutes.includes(location.pathname);
  
  const hideFABRoutes = [
    '/post-idea', 
    '/submit-asset', 
    '/profile/edit', 
    '/profile',
    '/startalks',
    '/messages',
    ...noHeaderRoutes,
    ...staticPages
  ];
  
  const isEditing = (location.pathname.includes('/edit') && location.pathname.includes('/project/')) || (location.pathname.includes('/edit') && location.pathname.includes('/asset/'));
  const showFAB = currentUser && 
    !hideFABRoutes.includes(location.pathname) && 
    !location.pathname.startsWith('/team/') && 
    !isEditing && 
    !location.pathname.includes('/apply') &&
    !location.pathname.startsWith('/idea/') &&
    !location.pathname.startsWith('/asset/') &&
    !location.pathname.startsWith('/user/');

  const showFooter = location.pathname === '/'; 
  const isFullHeightPage = location.pathname.startsWith('/messages') || location.pathname.startsWith('/team/') || location.pathname === '/blueprint' || location.pathname.startsWith('/asset/');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-secondary)]">
      {authLoadingState.isLoading && <FullScreenLoader messages={authLoadingState.messages} />}
      {currentUser && showOnboardingModal && <OnboardingPage />}
      {showHeader && <Header />}
      <NotificationArea />
      <main key={location.pathname} className={`flex-grow ${isFullHeightPage ? 'flex flex-col' : 'overflow-y-auto'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/user/:userId" element={<WithPageContainer><PublicProfilePage /></WithPageContainer>} />
          <Route path="/about" element={<WithPageContainer><PlaceholderContentPage title="About us" /></WithPageContainer>} />
          <Route path="/privacy-policy" element={<WithPageContainer><PlaceholderContentPage title="Privacy policy" /></WithPageContainer>} />
          <Route path="/sponsorship" element={<WithPageContainer><PlaceholderContentPage title="Sponsorship" /></WithPageContainer>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/new-password" element={<NewPasswordPage />} />
          <Route path="/contact-us" element={<WithPageContainer><ContactUsPage /></WithPageContainer>} />
          <Route path="/search" element={<WithPageContainer><SearchPage /></WithPageContainer>} />

          <Route path="/dashboard" element={<ProtectedRoute><WithPageContainer pageClassName="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8"><DashboardPage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsListPage /></ProtectedRoute>} />
          <Route path="/startalks" element={<ProtectedRoute><StartalksPage /></ProtectedRoute>} />
          <Route path="/blueprint" element={<ProtectedRoute><StartupStoriesPage /></ProtectedRoute>} />
          <Route path="/asset/:assetId" element={<ProtectedRoute><AssetDetailsPage /></ProtectedRoute>} />
          <Route path="/asset/:assetId/edit" element={<ProtectedRoute><WithPageContainer><EditAssetPage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/submit-asset" element={<ProtectedRoute><WithPageContainer><SubmitAssetPage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/post-idea" element={<ProtectedRoute><WithPageContainer><PostIdeaPage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/idea/:ideaId" element={<ProtectedRoute><WithPageContainer><IdeaDetailPage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/idea/:ideaId/position/:positionId/apply" element={<ProtectedRoute><WithPageContainer><ApplyPage /></WithPageContainer></ProtectedRoute>} />
          
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/team/:teamId" element={<ProtectedRoute><TeamDetailPage /></ProtectedRoute>} />
          
          <Route path="/profile" element={<ProtectedRoute><WithPageContainer><ProfilePage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><WithPageContainer><EditProfilePage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/project/:ideaId/edit" element={<ProtectedRoute><WithPageContainer><EditProjectPage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/my-projects" element={<ProtectedRoute><WithPageContainer><MyProjectsPage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute><WithPageContainer><MyApplicationsPage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute><WithPageContainer><ConnectionsPage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/saved-projects" element={<ProtectedRoute><WithPageContainer><SavedProjectsPage /></WithPageContainer></ProtectedRoute>} />
          <Route path="/activity-log" element={<ProtectedRoute><WithPageContainer><ActivityLogPage /></WithPageContainer></ProtectedRoute>} />
          
          <Route path="*" element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
      {showFAB && <FloatingActionMenu />}
    </div>
  );
};

export default App;
