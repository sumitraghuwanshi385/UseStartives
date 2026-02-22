// src/pages/EditProfilePage.tsx
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { COUNTRIES, TwitterXIcon, ChevronLeftIcon } from '../constants';
import axios from 'axios';

// --- Icons ---
const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
);
const AcademicCapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
);
const LinkChainIcon: React.FC<{ className?: string }> = ({ className }) => ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
);
const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className || "w-5 h-5"} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>);
const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className || "w-5 h-5"} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.201 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>);
const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg className={className || "w-5 h-5"} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>);
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
);
const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
);

const CustomCountrySelect: React.FC<{ 
    value: string; 
    onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-2xl shadow-inner text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
      >
        <span>{value || 'Choose Location'}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--component-background)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollable">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => { onChange(c.name); setIsOpen(false); }}
              className={`w-full text-left px-5 py-3 text-sm transition-colors flex items-center justify-between ${value === c.name ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold' : 'text-[var(--text-secondary)] hover:bg-[var(--component-background-hover)]'}`}
            >
              <span className="flex items-center gap-3">
                  <span>{c.name}</span>
              </span>
              {value === c.name && <CheckIcon className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface FormCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  description?: string;
}

const FormCard: React.FC<FormCardProps> = ({ title, icon, children, description }) => (
  <div className="bg-white dark:bg-black border border-[var(--border-primary)] rounded-[2.5rem] shadow-sm overflow-hidden mb-6">
    <div className="px-8 pt-8 pb-6 border-b border-[var(--border-primary)] bg-gray-50/50 dark:bg-neutral-900/10">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-black tracking-tight uppercase">{title}</h3>
                {description && <p className="text-xs text-[var(--text-muted)] font-medium mt-1 uppercase tracking-widest">{description}</p>}
            </div>
        </div>
    </div>
    <div className="p-8">
        {children}
    </div>
  </div>
);


const EditProfilePage: React.FC = () => {
  const { currentUser, updateUser, addNotification } = useAppContext();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Initialize state only once when currentUser is available
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setHeadline(currentUser.headline || '');
      setBio(currentUser.bio || '');
      setCountry(currentUser.country || '');
      setProfilePicturePreview(currentUser.profilePictureUrl || null);
      setSkills(currentUser.skills?.join(', ') || '');
      setInterests(currentUser.interests?.join(', ') || '');
      setLinkedin(currentUser.socialLinks?.linkedin || '');
      setGithub(currentUser.socialLinks?.github || '');
      setTwitter(currentUser.socialLinks?.twitter || '');
      setInstagram(currentUser.socialLinks?.instagram || '');
    } else {
        navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      // ✅ Upload image to backend
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data?.filePath) {
        const fullPath = `${res.data.filePath}`; // Ensure full URL
        setProfilePicturePreview(fullPath);
        addNotification('Image uploaded!', 'success');
      } else {
        addNotification('Image upload failed.', 'error');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      addNotification(err?.response?.data?.message || 'Image upload failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name.trim()) {
        addNotification("Full Name is required.", "error");
        setIsLoading(false);
        return;
    }
    
    // ✅ Send the updated picture URL (or keep existing one)
    const success = await updateUser({
      name: name.trim(),
      headline: headline.trim(),
      bio: bio.trim(),
      country: country,
      profilePictureUrl: profilePicturePreview || currentUser?.profilePictureUrl || '',
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: interests.split(',').map(i => i.trim()).filter(Boolean),
      socialLinks: { 
        linkedin: linkedin.trim(), 
        github: github.trim(), 
        twitter: twitter.trim(), 
        instagram: instagram.trim() 
      },
    });

    setIsLoading(false);
    if (success) {
        addNotification("Profile saved!", "success");
        navigate('/profile');
    }
  };

  const inputStyles = "block w-full px-5 py-3.5 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-2xl shadow-inner placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-[var(--text-primary)] text-sm font-medium";
  const labelStyles = "block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2 px-1";

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex flex-col mb-12">
          <div className="flex justify-start">
            <Link to="/profile" className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 group rounded-full px-5 py-2.5 bg-[var(--background-tertiary)] border border-[var(--border-primary)] shadow-sm">
                <ChevronLeftIcon className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                <span>Cancel</span>
            </Link>
          </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
            
            <FormCard title="About You" icon={<UserCircleIcon />} description="Basic Info">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 flex justify-center mb-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-white dark:bg-neutral-900 p-1 border border-[var(--border-primary)] shadow-2xl overflow-hidden">
                                <div className="w-full h-full icon-bg-gradient rounded-full flex items-center justify-center text-4xl text-white font-black overflow-hidden shadow-inner relative">
                                    {profilePicturePreview ? (
                                        <img src={profilePicturePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || 'P'
                                    )}
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()} 
                                className="absolute bottom-1 right-1 p-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95 border-2 border-white dark:border-neutral-900"
                            >
                                <CameraIcon className="w-5 h-5" />
                            </button>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className={labelStyles}>Your Name*</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className={inputStyles} placeholder="First and last name" />
                    </div>
                    <div>
                        <label htmlFor="country" className={labelStyles}>Where you are*</label>
                        <CustomCountrySelect value={country} onChange={setCountry} />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="headline" className={labelStyles}>Headline*</label>
                        <input type="text" id="headline" value={headline} onChange={e => setHeadline(e.target.value)} required placeholder="e.g. Developer or Designer" className={inputStyles} />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="bio" className={labelStyles}>Bio</label>
                        <textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={5} placeholder="Tell us about yourself..." className={`${inputStyles} resize-none`} />
                    </div>
                </div>
            </FormCard>

            <FormCard title="Skills" icon={<AcademicCapIcon />} description="Expertise">
                <div className="space-y-8">
                    <div>
                        <label htmlFor="skills" className={labelStyles}>Skills (Comma separated)</label>
                        <input type="text" id="skills" value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Node.js..." className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="interests" className={labelStyles}>Interests (Comma separated)</label>
                        <input type="text" id="interests" value={interests} onChange={e => setInterests(e.target.value)} placeholder="AI, SaaS..." className={inputStyles} />
                    </div>
                </div>
            </FormCard>

            <FormCard title="Social Media" icon={<LinkChainIcon />} description="Links">
                <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="linkedin" className={`${labelStyles} flex items-center`}><LinkedInIcon className="w-4 h-4 mr-2 text-sky-600"/> LinkedIn</label>
                            <input type="url" id="linkedin" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://..." className={inputStyles} />
                        </div>
                        <div>
                            <label htmlFor="github" className={`${labelStyles} flex items-center`}><GitHubIcon className="w-4 h-4 mr-2 text-neutral-800 dark:text-white"/> GitHub</label>
                            <input type="url" id="github" value={github} onChange={e => setGithub(e.target.value)} placeholder="https://..." className={inputStyles} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="twitter" className={`${labelStyles} flex items-center`}><TwitterXIcon className="w-4 h-4 mr-2 text-neutral-900 dark:text-white"/> X / Twitter</label>
                            <input type="url" id="twitter" value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="https://..." className={inputStyles} />
                        </div>
                        <div>
                            <label htmlFor="instagram" className={`${labelStyles} flex items-center`}><InstagramIcon className="w-4 h-4 mr-2 text-pink-600"/> Instagram</label>
                            <input type="url" id="instagram" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://..." className={inputStyles} />
                        </div>
                    </div>
                </div>
            </FormCard>

        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
          <Link 
            to="/profile"
            className="w-full sm:w-auto px-12 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] rounded-full transition-all border border-[var(--border-primary)] text-center shadow-sm"
          >
             Go Back
          </Link>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto button-gradient px-14 py-4 text-xs font-black uppercase tracking-widest text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center min-w-[240px]"
          >
            {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> 
            ) : (
                "Save Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;