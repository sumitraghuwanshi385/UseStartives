import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { APP_NAME, ChevronLeftIcon } from '../constants';

const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-2.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);

const LoginPage: React.FC = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [isFormLoading, setIsFormLoading] = useState(false); 
  const { login, addNotification, currentUser } = useAppContext(); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);
    if (!credential || !password) {
      addNotification('Please enter both your email and password.', 'error');
      setIsFormLoading(false);
      return;
    }
    const success = await login(credential, password);
    setIsFormLoading(false);
    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    setIsFormLoading(true);
    const success = await login('google.testuser@example.com', undefined, false); 
    setIsFormLoading(false);
    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };
  
  const inputBaseClasses = "block w-full px-6 py-3.5 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-full placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm text-[var(--text-primary)] font-medium h-12";

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center relative p-12 text-center overflow-hidden animated-auth-bg">
          <div className="relative z-10">
              <Link to="/" className="flex items-center justify-center mb-8">
                  <img src="https://i.postimg.cc/pLTtqf3Q/Picsart-25-09-19-20-29-01-019.png" alt="Startives Logo" className="h-24 animate-logo-pulse" />
              </Link>
              <h1 className="text-5xl font-extrabold tracking-tight gradient-text bg-gradient-to-r from-red-500 to-blue-500">Welcome Back!</h1>
              <p className="mt-4 text-lg text-white">Sign in to continue your journey of innovation and collaboration.</p>
          </div>
      </div>
      <div className="flex min-h-screen lg:min-h-0 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--background-secondary)] relative">
        <div className="absolute top-6 left-6">
           <Link to="/" className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full px-5 py-2.5" aria-label="Back Home">
              <ChevronLeftIcon className="w-3.5 h-3.5" />
              <span>Back Home</span>
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-8">
            <div className="fade-in-up text-center">
              <Link to="/" className="lg:hidden flex items-center justify-center mb-6">
                  <img src="https://i.postimg.cc/pLTtqf3Q/Picsart-25-09-19-20-29-01-019.png" alt="Startives Logo" className="h-16 animate-logo-pulse" />
              </Link>
              {location.state?.resetSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Password reset successful. Sign in below.</p>
                </div>
              )}
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] uppercase tracking-tighter">Sign In</h2>
              <p className="mt-2 text-sm text-[var(--text-muted)] font-medium">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-bold text-purple-600 hover:underline">Sign up</Link>
              </p>
            </div>
        
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="fade-in-up">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1">Email Address</label>
                  <input type="email" required value={credential} onChange={(e) => setCredential(e.target.value)} className={inputBaseClasses} placeholder="you@example.com"/>
                </div>
                <div className="fade-in-up">
                  <div className="flex justify-between items-center mb-2 px-1">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Password</label>
                      <Link to="/forgot-password" disabled={isFormLoading} className="text-[10px] font-black uppercase tracking-widest text-purple-500 hover:text-purple-600 transition-colors">
                          Forgot?
                      </Link>
                  </div>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputBaseClasses} placeholder="••••••••" />
                  <div className={`mt-2 overflow-hidden transition-all duration-300 ${password && password.length < 6 ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}>
                      <p className="text-[10px] font-black uppercase text-red-500 flex items-center gap-1.5 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          At least 6 characters required
                      </p>
                  </div>
                </div>
              </div>

              <div className="fade-in-up">
                <button type="submit" disabled={isFormLoading} className="w-full flex justify-center py-4 px-6 button-gradient text-white font-black uppercase tracking-widest text-[10px] rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-70 h-14 items-center">
                  {isFormLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : ( 'Sign In' )}
                </button>
              </div>
            </form>

            <div className="relative flex items-center justify-center fade-in-up">
              <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-[var(--border-secondary)]" /></div>
              <div className="relative flex justify-center"><span className="bg-[var(--background-secondary)] px-4 text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Authorized Access</span></div>
            </div>

            <button type="button" onClick={handleGoogleLogin} disabled={isFormLoading} className="w-full flex items-center justify-center py-4 px-6 border border-[var(--border-secondary)] rounded-full text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--component-background)] hover:bg-[var(--component-background-hover)] transition-all h-14 shadow-none">
              <GoogleIcon className="w-4 h-4 mr-3" />
              Continue with Google
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;