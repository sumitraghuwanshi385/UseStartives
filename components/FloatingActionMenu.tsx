import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IdeaStarIcon, PlusCircleIcon, ShoppingBagIcon, BoltIcon } from '../constants';

const FloatingActionMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-[999] pointer-events-none flex flex-col items-end w-max" ref={menuRef}>
            {/* Menu Options */}
            <div className={`flex flex-col gap-3 mb-4 transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-10 opacity-0 pointer-events-none invisible'}`}>
                <Link 
                    to="/startalks?focus=true" 
                    className="flex items-center gap-3 bg-[var(--component-background)] p-3 pr-5 rounded-full border border-[var(--border-primary)] hover:border-blue-500 transition-all hover:-translate-x-2 shadow-xl"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        < BoltIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">Post an Update</span>
                </Link>
                <Link 
                    to="/post-idea" 
                    className="flex items-center gap-3 bg-[var(--component-background)] p-3 pr-5 rounded-full border border-[var(--border-primary)] hover:border-purple-500 transition-all hover:-translate-x-2 shadow-xl"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                        <PlusCircleIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">Post New Project</span>
                </Link>
                <Link 
                    to="/submit-asset" 
                    className="flex items-center gap-3 bg-[var(--component-background)] p-3 pr-5 rounded-full border border-[var(--border-primary)] hover:border-red-500 transition-all hover:-translate-x-2 shadow-xl"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                        <ShoppingBagIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">List Your Asset</span>
                </Link>
            </div>

            {/* Main FAB */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full button-gradient pointer-events-auto flex items-center justify-center text-white transition-all duration-300 transform active:scale-90 shadow-none ${isOpen ? 'rotate-45' : 'hover:scale-110'}`}
                aria-label="Toggle action menu"
            >
                <PlusCircleIcon className="w-7 h-7" />
            </button>
        </div>
    );
};

export default FloatingActionMenu;