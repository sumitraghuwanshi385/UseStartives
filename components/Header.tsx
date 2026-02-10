import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { APP_NAME } from '../constants'; 
import { useTheme } from '../contexts/ThemeContext';

// --- Icons ---
const ArrowRightOnRectangleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
);
const HamburgerIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

const ThemeIconButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--component-background-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-neutral-500/60"
            aria-label="Toggle theme"
        >
            {isDark ? 
                <MoonIcon className="w-5 h-5 text-sky-400" /> : 
                <SunIcon className="w-5 h-5 text-yellow-500" />
            }
        </button>
    );
};

const Header: React.FC = () => {
  const { currentUser, logout } = useAppContext(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const [isMenuAnimating, setIsMenuAnimating] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  useEffect(() => {
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };
  
  const handleMenuClick = () => {
    setIsMenuAnimating(true);
    setTimeout(() => setIsMenuAnimating(false), 300);
    setProfileDropdownOpen(prev => !prev);
  };
  
  // Desktop Nav Links
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
     { name: 'Search', path: '/search' }, 
    { name: 'Startalks', path: '/startalks' },
    { name: 'Messenger', path: '/messages' },
  ];

  // Mobile Menu Links (Dropdown)
  const mobileMenuLinks = [
    { name: 'Dashboard', path: '/dashboard' },
      { name: 'Search', path: '/search' },  
    { name: 'Discover Projects', path: '/projects' },
    { name: 'Asset Shop', path: '/blueprint' },
    { name: 'Startalks', path: '/startalks' },
    { name: 'Messenger', path: '/messages' },
  ];

  const getInitials = (name?: string): string => {
    if (!name || name.trim() === '') return 'U';
    const parts = name.match(/\b\w/g) || [];
    return (parts.map(part => part.toUpperCase()).join('') || 'U').substring(0, 2);
  };
  
  const commonIconButtonClasses = "relative p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--component-background-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-neutral-500/60";

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--background-primary)] border-b border-[var(--border-primary)]">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center space-x-8">
          <Link to={currentUser ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center space-x-2 focus:outline-none ml-0">
            <img 
              src="https://i.postimg.cc/pLTtqf3Q/Picsart-25-09-19-20-29-01-019.png" 
              alt="Startives Logo" 
              className="h-9" 
            />
             <span className="font-startives-brand tracking-tighter gradient-text bg-gradient-to-r from-red-500 to-blue-500 text-2xl">
                {APP_NAME}
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-1">
          {currentUser ? (
            <>
              <ThemeIconButton />
              
              <div ref={profileDropdownRef} className="relative">
                <button onClick={handleMenuClick} className={commonIconButtonClasses} aria-label="Open menu">
                    <HamburgerIcon className={`w-6 h-6 ${isMenuAnimating ? 'animate-icon-click' : ''}`} />
                </button>
                <div className={`origin-top-right absolute right-0 mt-3 w-64 rounded-xl bg-[var(--component-background)] ring-1 ring-black ring-opacity-5 focus:outline-none border border-[var(--border-primary)] shadow-2xl transition ease-out duration-200 ${profileDropdownOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'}`}>
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link to="/profile" className="block px-4 py-3 border-b border-[var(--border-primary)] hover:bg-[var(--component-background-hover)]" role="menuitem">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 rounded-full icon-bg-gradient flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white/20">
                            {currentUser.profilePictureUrl ? (
                              <img src={currentUser.profilePictureUrl} alt={currentUser.name} className="w-full h-full object-cover rounded-full" />
                            ) : ( getInitials(currentUser.name) )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{currentUser.name}</p>
                            <p className="text-xs text-[var(--text-muted)] truncate">{currentUser.email}</p>
                          </div>
                        </div>
                    </Link>
                    <div className="py-1">
                        {mobileMenuLinks.map(link => (
                          <Link key={link.name} to={link.path} className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--component-background-hover)] hover:text-[var(--text-primary)] focus:outline-none" role="menuitem">
                            {link.name}
                          </Link>
                        ))}
                    </div>
                    <div className="border-t border-[var(--border-primary)]">
                        <button onClick={handleLogout} className="w-full text-left flex items-center space-x-2 px-4 py-3 text-sm text-[var(--accent-danger-text)] hover:bg-[var(--accent-danger-background)] hover:text-[var(--accent-danger-hover)] focus:outline-none" role="menuitem">
                          <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                          <span>Logout</span>
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <ThemeIconButton />
              <button onClick={() => navigate('/signup')} className="button-gradient text-white font-semibold rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/50 py-1.5 px-4 text-xs">
                Join Now
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;