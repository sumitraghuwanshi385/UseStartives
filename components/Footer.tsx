
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, TwitterXIcon } from '../constants';

const Footer: React.FC = () => {
  // FIX: Added explicit type to handle both internal 'path' and external 'href' if needed, though currently only using 'path'.
  const helpLinks: { name: string; path?: string; href?: string }[] = [
    { name: 'About Us', path: '/about' }, 
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'For Sponsorship', path: '/sponsorship' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/startives', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg> },
    { name: 'X (Twitter)', href: 'https://x.com/startives', icon: <TwitterXIcon className="w-6 h-6" /> },
  ];

  return (
    <footer className="bg-[var(--background-secondary)] text-[var(--text-muted)] border-t border-[var(--border-primary)] relative z-10">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1 lg:col-span-2">
             <Link to="/" className="flex items-center text-[var(--text-primary)] mb-3">
                <img src="https://i.postimg.cc/pLTtqf3Q/Picsart-25-09-19-20-29-01-019.png" alt="Startives Logo" style={{ height: '32px' }} className="mr-3" />
                <span className="font-startives-brand text-2xl tracking-tighter gradient-text bg-gradient-to-r from-red-500 to-blue-500">{APP_NAME}</span>
            </Link>
            <p className="text-sm max-w-sm">Empowering Startup Founders to Connect & Build.</p>
          </div>
          
          <div>
            <h5 className="font-semibold text-[var(--text-primary)] mb-3">Help Center</h5>
            <ul className="space-y-2">
              {helpLinks.map(link => (
                <li key={link.name}>
                  {link.path ? (
                    <Link to={link.path} className="hover:text-[var(--accent-info-hover)] transition-colors duration-300 text-sm">
                      {link.name}
                    </Link>
                  ) : (
                    // FIX: Checking link.href safely now that the type is defined.
                    <a href={link.href} className="hover:text-[var(--accent-info-hover)] transition-colors duration-300 text-sm" target="_blank" rel="noopener noreferrer">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-[var(--text-primary)] mb-3">Join us on</h5>
            <div className="flex space-x-4">
              {socialLinks.map(social => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="text-[var(--text-muted)] hover:text-[var(--accent-info-hover)] transition-colors duration-300">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-[var(--border-primary)] pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
