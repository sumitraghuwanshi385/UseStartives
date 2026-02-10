import axios from 'axios';
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Position, StartupCategory, BusinessModel, WorkMode } from '../types';
import { PageTitle } from '../App';
import {
  IdeaStarIcon,
  STARTUP_CATEGORIES,
  BUSINESS_MODELS,
  WORK_MODES,
  MapPinIconHero,
  COUNTRIES,
  IdentificationIcon,
  ChevronLeftIcon,
  PhotoIcon,
  AppContextLinkIcon as LinkIcon,
  XMarkIcon,
} from '../constants';

// --- Icons ---
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const TagIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

const PencilSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
);

const Bars3BottomLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
  </svg>
);

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const BookmarkSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25L7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
  </svg>
);

const CubeTransparentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

// --- Custom Select Dropdown Component ---
interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, placeholder = 'Select...', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg shadow-sm text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-poppins font-medium h-11"
      >
        <span className={!value ? 'text-[var(--text-muted)]' : ''}>{value || placeholder}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-[var(--component-background)] border border-[var(--border-primary)] rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollable">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors flex items-center justify-between font-poppins ${
                value === opt
                  ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-semibold'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--component-background-hover)]'
              }`}
            >
              {opt}
              {value === opt && <CheckIcon className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Form Helper Components ---
interface FormSectionProps {
  title: string;
  icon?: React.ReactElement<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
  subtext?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, icon, children, className = '', subtext }) => (
  <div className={`space-y-6 ${className}`}>
    <div className="pb-3 border-b border-[var(--border-primary)]">
      <div className="flex items-center space-x-3 mb-1">
        {icon && (
          <div className="w-8 h-8 rounded-full icon-bg-gradient flex items-center justify-center shadow-md">
            {React.cloneElement(icon, { className: 'w-4 h-4 text-white' })}
          </div>
        )}
        <h2 className="text-xl font-bold text-[var(--text-primary)] font-poppins tracking-tight">{title}</h2>
      </div>
      {subtext && <p className="text-[10px] text-[var(--text-muted)] font-bold pl-11 font-poppins">{subtext}</p>}
    </div>
    {children}
  </div>
);

interface FormRowProps {
  label: string;
  htmlFor: string;
  icon?: React.ReactElement<{ className?: string }>;
  subtext?: string;
  children: React.ReactNode;
  isRequired?: boolean;
}

const FormRow: React.FC<FormRowProps> = ({ label, htmlFor, icon, subtext, children, isRequired }) => (
  <div className="grid md:grid-cols-3 gap-3 md:gap-5 items-start">
    <div className="md:col-span-1 pt-1 md:pt-2.5">
      <label htmlFor={htmlFor} className="flex items-center text-sm font-semibold text-[var(--text-secondary)] font-poppins tracking-tight">
        {icon && React.cloneElement(icon, { className: 'w-4 h-4 mr-2 text-[var(--text-muted)]' })}
        {label} {isRequired && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>
      {subtext && <p className="text-[10px] text-[var(--text-muted)] mt-1 font-bold leading-relaxed text-left font-poppins">{subtext}</p>}
    </div>
    <div className="md:col-span-2">{children}</div>
  </div>
);

// --- Main Page Component ---
const PostIdeaPage: React.FC = () => {
  const { addIdea, currentUser, addNotification } = useAppContext();
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [founderQuote, setFounderQuote] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState<StartupCategory>('SaaS');
  const [businessModel, setBusinessModel] = useState<BusinessModel>('B2B');
  const [workMode, setWorkMode] = useState<WorkMode>('Remote');
  const [location, setLocation] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const [nextPositionTempId, setNextPositionTempId] = useState(1);

  const [positions, setPositions] = useState<
    Array<Omit<Position, 'id' | 'isOpen'> & { tempId: number; newQuestion?: string }>
  >([
    { tempId: 0, title: '', description: '', type: 'Paid', skills: [], salaryRange: '', equityOffered: '', questions: [], newQuestion: '' },
  ]);

  // ✅ Image upload -> URL
  const handleProjectImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImageUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data?.url) {
        setImagePreviewUrl(res.data.url); // URL
        addNotification('Image uploaded!', 'success');
      } else {
        addNotification('Image upload failed.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      addNotification(err?.response?.data?.message || 'Image upload failed.', 'error');
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isImageUploading) {
      addNotification('Please wait, image is still uploading.', 'error');
      return;
    }

    setIsLoading(true);

    if (!title || !tagline || !description || !problem || !solution || !founderQuote || !tags || !location || !imagePreviewUrl) {
      addNotification('Please fill in all mandatory fields.', 'error');
      setIsLoading(false);
      return;
    }

    const ideaToSubmit = {
      title,
      tagline,
      description,
      problem,
      buildingNow: solution,
      founderQuote,
      founderName: currentUser?.name || 'User',
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      stage: 'Idea Stage' as const,
      category,
      businessModel,
      workMode,
      location,
      websiteUrl: websiteUrl || undefined,
      positionsData: positions
        .filter((p) => p.title && p.description)
        .map(({ tempId, newQuestion, ...rest }) => rest),

      // ✅ now this is URL (not base64)
      imageDataUrl: imagePreviewUrl,
    };

    try {
      await Promise.resolve(addIdea(ideaToSubmit as any));
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    'block w-full px-3.5 py-2.5 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg shadow-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm text-[var(--text-primary)] font-poppins font-medium transition-colors duration-200';
  const textAreaClasses = `${inputClasses} min-h-[120px] resize-y`;

  return (
    <div className="max-w-3xl mx-auto pb-20 font-poppins">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 group rounded-full px-5 py-2 bg-[var(--background-tertiary)] border border-[var(--border-primary)] shadow-sm"
      >
        <ChevronLeftIcon className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
        <span>Back</span>
      </button>

      <PageTitle title="Launch Your Vision" description="Detail your venture and find the perfect teammates." />

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--component-background)] p-6 sm:p-8 rounded-2xl border border-[var(--border-primary)] shadow-sm space-y-12"
      >
        <FormSection title="Project Core" icon={<IdeaStarIcon />} subtext="Define the identity of your brand.">
          <FormRow label="Idea Title" htmlFor="title" icon={<IdeaStarIcon />} isRequired subtext="Memorable and professional brand name.">
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClasses} placeholder="e.g., EcoRoute Planner" />
          </FormRow>

          <FormRow label="Tagline" htmlFor="tagline" icon={<Bars3BottomLeftIcon />} isRequired subtext="Catchy one-liner summing everything up.">
            <input type="text" id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} required className={inputClasses} placeholder="Navigate the world, sustainably." />
          </FormRow>

          <FormRow label="Description" htmlFor="description" icon={<PencilSquareIcon />} isRequired subtext="Tell the full story of your project.">
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required className={textAreaClasses} placeholder="The full vision..." />
          </FormRow>

          <FormRow label="The Problem" htmlFor="problem" isRequired subtext="Specify the pain point you are solving.">
            <textarea id="problem" value={problem} onChange={(e) => setProblem(e.target.value)} rows={3} required className={textAreaClasses} placeholder="Clearly define the problem..." />
          </FormRow>

          <FormRow label="The Solution" htmlFor="solution" isRequired subtext="How does your idea solve it uniquely?">
            <textarea id="solution" value={solution} onChange={(e) => setSolution(e.target.value)} rows={3} required className={textAreaClasses} placeholder="Describe your solution..." />
          </FormRow>

          <FormRow label="Founder's Spark" htmlFor="founderQuote" isRequired subtext="The personal context behind this venture.">
            <textarea id="founderQuote" value={founderQuote} onChange={(e) => setFounderQuote(e.target.value)} rows={2} required className={textAreaClasses} placeholder="I started this because..." />
          </FormRow>

          <FormRow label="Tags" htmlFor="tags" icon={<TagIcon />} isRequired subtext="Keywords for discoverability (e.g., AI, SaaS)">
            <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} required className={inputClasses} placeholder="AI, Sustainability, B2B" />
          </FormRow>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormRow label="Industry" htmlFor="category" icon={<BookmarkSquareIcon />} isRequired subtext="Select your market sector.">
              <CustomSelect value={category} onChange={(val) => setCategory(val as StartupCategory)} options={STARTUP_CATEGORIES} />
            </FormRow>

            <FormRow label="Business Model" htmlFor="businessModel" icon={<CubeTransparentIcon />} isRequired subtext="How will this scale?">
              <CustomSelect value={businessModel} onChange={(val) => setBusinessModel(val as BusinessModel)} options={BUSINESS_MODELS} />
            </FormRow>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormRow label="Work Mode" htmlFor="workMode" icon={<HomeIcon />} isRequired subtext="Operational preference.">
              <CustomSelect value={workMode} onChange={(val) => setWorkMode(val as WorkMode)} options={WORK_MODES} />
            </FormRow>

            <FormRow label="Location" htmlFor="location" icon={<MapPinIconHero />} isRequired subtext="Primary base of operations.">
              <CustomSelect value={location} onChange={(val) => setLocation(val)} placeholder="Select Country" options={COUNTRIES.map((c) => c.name)} />
            </FormRow>
          </div>
        </FormSection>

        <FormSection title="Visuals & Links" icon={<PhotoIcon />} subtext="Make your listing visually compelling.">
          <FormRow label="Project Image" htmlFor="projectImage" isRequired subtext="Visual identity of your project.">
            <div>
              <input
                type="file"
                id="projectImage"
                accept="image/*"
                ref={imageInputRef}
                onChange={handleProjectImageChange}
                className="hidden"
              />

              <button
                type="button"
                disabled={isImageUploading || isLoading}
                onClick={() => imageInputRef.current?.click()}
                className="text-[10px] font-bold uppercase tracking-widest bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] text-[var(--text-secondary)] py-2.5 px-6 rounded-full border border-[var(--border-secondary)] transition-all font-poppins disabled:opacity-60"
              >
                {isImageUploading ? 'Uploading...' : imagePreviewUrl ? 'Change Image' : 'Select Image *'}
              </button>

              {imagePreviewUrl && (
                <div className="mt-4">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="rounded-lg max-h-48 border border-[var(--border-secondary)] shadow-lg"
                  />
                </div>
              )}
            </div>
          </FormRow>

          <FormRow label="Website" htmlFor="websiteUrl" icon={<LinkIcon />} subtext="External link to your landing page.">
            <input
              type="url"
              id="websiteUrl"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className={inputClasses}
              placeholder="https://... (Optional)"
            />
          </FormRow>
        </FormSection>

        <FormSection title="Opportunities" icon={<IdentificationIcon />} subtext="What talent are you looking to recruit?">
          {positions.map((pos, index) => (
            <div key={pos.tempId} className="space-y-4 p-5 bg-[var(--component-secondary-background)] border border-[var(--border-primary)] rounded-xl relative">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Opening #{index + 1}</h4>
                {positions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setPositions(positions.filter((p) => p.tempId !== pos.tempId))}
                    className="text-red-500 hover:underline text-xs font-bold uppercase font-poppins"
                  >
                    Remove
                  </button>
                )}
              </div>

              <FormRow label="Title" htmlFor={`pos-title-${pos.tempId}`} isRequired subtext="e.g. Lead Designer">
                <input
                  type="text"
                  id={`pos-title-${pos.tempId}`}
                  value={pos.title}
                  onChange={(e) => {
                    const newPositions = [...positions];
                    const idx = newPositions.findIndex((p) => p.tempId === pos.tempId);
                    newPositions[idx].title = e.target.value;
                    setPositions(newPositions);
                  }}
                  required
                  className={inputClasses}
                />
              </FormRow>

              <FormRow label="Commitment" htmlFor={`pos-type-${pos.tempId}`} isRequired subtext="Time or compensation structure.">
                <CustomSelect
                  value={pos.type}
                  onChange={(val) => {
                    const newPositions = [...positions];
                    const idx = newPositions.findIndex((p) => p.tempId === pos.tempId);
                    (newPositions[idx] as any).type = val;
                    setPositions(newPositions);
                  }}
                  options={['Paid', 'Part-time', 'Flexible', 'Equity', 'Unpaid']}
                />
              </FormRow>

              <FormRow label="Details" htmlFor={`pos-desc-${pos.tempId}`} isRequired subtext="Responsibilities and requirements.">
                <textarea
                  id={`pos-desc-${pos.tempId}`}
                  value={pos.description}
                  onChange={(e) => {
                    const newPositions = [...positions];
                    const idx = newPositions.findIndex((p) => p.tempId === pos.tempId);
                    newPositions[idx].description = e.target.value;
                    setPositions(newPositions);
                  }}
                  rows={3}
                  required
                  className={inputClasses}
                />
              </FormRow>

              {/* --- Ask Questions Section --- */}
              <div className="pt-4 border-t border-[var(--border-primary)]">
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Ask Questions (Optional)</label>

                <div className="space-y-2 mb-3">
                  {pos.questions?.map((q, qIndex) => (
                    <div key={`${pos.tempId}-${qIndex}`} className="flex items-center gap-2">
                      <div className="flex-grow text-xs font-medium text-[var(--text-primary)] bg-[var(--background-primary)] px-3 py-2 rounded-lg border border-[var(--border-primary)]">
                        {q}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newPositions = [...positions];
                          const idx = newPositions.findIndex((p) => p.tempId === pos.tempId);
                          newPositions[idx].questions = (newPositions[idx].questions || []).filter((_, i) => i !== qIndex);
                          setPositions(newPositions);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pos.newQuestion || ''}
                    onChange={(e) => {
                      const newPositions = [...positions];
                      const idx = newPositions.findIndex((p) => p.tempId === pos.tempId);
                      newPositions[idx].newQuestion = e.target.value;
                      setPositions(newPositions);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const text = (pos.newQuestion || '').trim();
                        if (!text) return;

                        const newPositions = [...positions];
                        const idx = newPositions.findIndex((p) => p.tempId === pos.tempId);
                        newPositions[idx].questions = [...(newPositions[idx].questions || []), text];
                        newPositions[idx].newQuestion = '';
                        setPositions(newPositions);
                      }
                    }}
                    placeholder="e.g. Link to your portfolio?"
                    className="flex-grow px-3 py-2 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const text = (pos.newQuestion || '').trim();
                      if (!text) return;

                      const newPositions = [...positions];
                      const idx = newPositions.findIndex((p) => p.tempId === pos.tempId);
                      newPositions[idx].questions = [...(newPositions[idx].questions || []), text];
                      newPositions[idx].newQuestion = '';
                      setPositions(newPositions);
                    }}
                    className="bg-[var(--background-tertiary)] hover:bg-[var(--component-background-hover)] text-[var(--text-primary)] text-xs font-bold px-4 py-2 rounded-lg border border-[var(--border-primary)] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setPositions([
                ...positions,
                { tempId: nextPositionTempId, title: '', description: '', type: 'Paid', skills: [], salaryRange: '', equityOffered: '', questions: [], newQuestion: '' },
              ]);
              setNextPositionTempId(nextPositionTempId + 1);
            }}
            className="text-purple-600 hover:underline text-[10px] font-bold uppercase tracking-widest font-poppins"
          >
            + Add Another Opening
          </button>
        </FormSection>

        <div className="pt-8 flex justify-end space-x-4 border-t border-[var(--border-primary)]">
          <Link
            to="/projects"
            className="px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--background-tertiary)] rounded-full border border-[var(--border-secondary)] transition-all font-poppins text-center"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isLoading || isImageUploading}
            className="button-gradient px-10 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white rounded-full transition-all shadow-md transform hover:scale-105 active:scale-95 disabled:opacity-50 font-poppins"
          >
            {isLoading ? 'Launching...' : 'Launch Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostIdeaPage;