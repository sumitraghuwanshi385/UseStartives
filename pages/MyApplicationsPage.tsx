
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Application, StartupIdea, User } from '../types';
import { EnvelopeOpenIcon, ChevronLeftIcon, IdentificationIcon } from '../constants';

// --- Icons ---
const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
);
const EyeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const CheckCircleIcon: React.FC<{className?: string}> = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon: React.FC<{className?: string}> = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClockIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const InboxIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.12-1.588H6.88a2.25 2.25 0 00-2.12 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" /></svg>
);
const XMarkIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);

const getStatusStyles = (status: Application['status']) => {
  switch (status) {
    case 'Accepted': return { text: 'text-emerald-700 dark:text-emerald-300', iconColor: 'text-emerald-500', iconBg: 'bg-emerald-100 dark:bg-emerald-500/10' };
    case 'Rejected': return { text: 'text-red-700 dark:text-red-300', iconColor: 'text-red-500', iconBg: 'bg-red-100 dark:bg-red-500/10' };
    case 'Reviewed': return { text: 'text-sky-700 dark:text-sky-300', iconColor: 'text-sky-500', iconBg: 'bg-sky-100 dark:bg-sky-500/10' };
    default: return { text: 'text-yellow-700 dark:text-yellow-300', iconColor: 'text-yellow-500', iconBg: 'bg-yellow-100 dark:bg-yellow-500/10' };
  }
};

const Linkify: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/\S+)/g;
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-500 dark:text-sky-400 hover:underline font-semibold break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {part}
            </a>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

const CoverLetterModal: React.FC<{ application: Application; onClose: () => void; applicant?: User; }> = ({ application, onClose, applicant }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-poppins" onClick={onClose}>
        <div className="bg-[var(--component-background)] p-8 rounded-[2.5rem] shadow-none w-full max-w-2xl border border-[var(--border-primary)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight">Application Details</h3>
                <button onClick={onClose} className="p-2.5 rounded-full hover:bg-[var(--component-background-hover)] transition-all border border-[var(--border-primary)] shadow-none"><XMarkIcon /></button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollable space-y-6">
                {applicant && (
                    <div className="flex items-center space-x-4 p-4 bg-[var(--background-tertiary)] rounded-2xl border border-[var(--border-primary)] shadow-none">
                        <img src={applicant.profilePictureUrl} alt={applicant.name} className="w-12 h-12 rounded-full object-cover border border-[var(--border-secondary)]" />
                        <div>
                            <p className="font-bold text-[var(--text-primary)] uppercase text-sm tracking-tight">{applicant.name}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{applicant.headline}</p>
                        </div>
                    </div>
                )}
                
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Cover Letter</h4>
                    <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed font-medium italic opacity-90"><Linkify text={application.coverLetter} /></p>
                </div>

                {application.answers && application.answers.length > 0 && (
                    <div className="pt-6 border-t border-[var(--border-primary)]">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
                            <IdentificationIcon className="w-4 h-4 text-purple-500" />
                            Screening Questions
                        </h4>
                        <div className="space-y-4">
                            {application.answers.map((qa, idx) => (
                                <div key={idx} className="bg-[var(--background-tertiary)] p-4 rounded-xl border border-[var(--border-secondary)]">
                                    <p className="text-xs font-bold text-[var(--text-primary)] mb-1">{qa.question}</p>
                                    <p className="text-sm text-[var(--text-secondary)] font-medium"><Linkify text={qa.answer} /></p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const ReceivedApplicationCard: React.FC<{ application: Application; idea?: StartupIdea; onOpenModal: (app: Application) => void; }> = ({ application, idea, onOpenModal }) => {
    const { updateApplicationStatus, getUserById } = useAppContext();
    const position = idea?.positions.find(p => p.id === application.positionId);
    const applicant = getUserById(application.applicantEmail, 'email');

    return (
        <div className="bg-[var(--component-background)] rounded-2xl border border-[var(--border-primary)] p-5 space-y-4 shadow-none hover:border-purple-500/30 transition-all font-poppins text-left">
            <div className="flex items-start space-x-3">
                <Link to={`/user/${applicant?.id}`} className="shrink-0">
                    <img src={applicant?.profilePictureUrl} alt={applicant?.name} className="w-11 h-11 rounded-full object-cover border border-[var(--border-secondary)]" />
                </Link>
                <div className="flex-grow overflow-hidden">
                    <Link to={`/user/${applicant?.id}`} className="font-bold text-sm text-[var(--text-primary)] hover:text-purple-600 transition-colors truncate block tracking-tight uppercase">{application.applicantName}</Link>
                    <p className="text-[10px] text-[var(--text-muted)] truncate font-medium uppercase tracking-widest">{applicant?.headline}</p>
                    <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-1 uppercase tracking-widest">Role: {position?.title}</p>
                </div>
            </div>
            <div className="space-y-3">
                <button onClick={() => onOpenModal(application)} className="w-full text-left text-xs text-[var(--text-secondary)] bg-[var(--background-tertiary)] p-3 rounded-xl border border-[var(--border-secondary)] line-clamp-2 hover:bg-[var(--component-background-hover)] transition-colors italic shadow-none">"{application.coverLetter}"</button>
                {application.answers && application.answers.length > 0 && (
                    <button onClick={() => onOpenModal(application)} className="w-full flex items-center gap-2 text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-800/30 text-left hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                        <IdentificationIcon className="w-4 h-4 flex-shrink-0"/>
                        <span className="text-xs font-bold uppercase tracking-wider">{application.answers.length} Question(s) Answered</span>
                    </button>
                )}
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
                {application.status === 'Pending' && (
                    <>
                        <button onClick={() => updateApplicationStatus(application.id, 'Rejected')} className="p-2.5 rounded-full text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 shadow-none" title="Reject"><XCircleIcon className="w-5 h-5" /></button>
                        <button onClick={() => updateApplicationStatus(application.id, 'Accepted')} className="p-2.5 rounded-full text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 shadow-none" title="Accept"><CheckCircleIcon className="w-5 h-5" /></button>
                    </>
                )}
                {application.status === 'Accepted' && (
                    <Link to={`/messages?chatWith=${applicant?.id}`} className="p-2.5 rounded-full text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/10 border border-sky-200 dark:border-sky-800/30 shadow-none" title="Message"><PaperAirplaneIcon className="w-5 h-5" /></Link>
                )}
            </div>
        </div>
    );
};

const SentApplicationCard: React.FC<{ application: Application; idea?: StartupIdea; }> = ({ application, idea }) => {
    const position = idea?.positions.find(p => p.id === application.positionId);
    const statusStyles = getStatusStyles(application.status);
    const founder = useAppContext().getUserById(idea?.founderId || '');

    return (
        <div className={`bg-[var(--component-background)] rounded-2xl border border-[var(--border-primary)] border-l-4 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 transition-all hover:border-purple-500/30 font-poppins shadow-none ${statusStyles.iconColor.replace('text-', 'border-l-')}`}>
            <div className="flex items-center gap-4 flex-grow text-left">
                {founder && (
                    <Link to={`/user/${founder.id}`} className="shrink-0"><img src={founder.profilePictureUrl} alt={founder.name} className="w-12 h-12 rounded-full object-cover border border-[var(--border-secondary)]" /></Link>
                )}
                <div className="overflow-hidden">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1">Applied for</p>
                    <h3 className="font-bold text-lg text-[var(--text-primary)] truncate leading-none">{position?.title}</h3>
                    <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-2 uppercase tracking-widest">At {idea?.title}</p>
                </div>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-full ${statusStyles.iconBg} border border-[var(--border-primary)] shadow-none`}>
                        {application.status === 'Accepted' ? <CheckCircleIcon className={statusStyles.iconColor}/> : <ClockIcon className={statusStyles.iconColor}/>}
                    </div>
                    <div>
                        <p className={`text-sm font-black uppercase tracking-tight ${statusStyles.text}`}>{application.status}</p>
                        <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{new Date(application.submittedDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <Link to={`/idea/${idea?.id}`} className="button-gradient text-white font-black uppercase text-[10px] tracking-widest py-2.5 px-6 rounded-full text-center hover:scale-105 active:scale-95 transition-all shadow-none">Review project</Link>
            </div>
        </div>
    );
};

export const MyApplicationsPage: React.FC = () => {
    const { applications, startupIdeas, currentUser, getUserById } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
    const [modalApp, setModalApp] = useState<Application | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab === 'received' || tab === 'sent') setActiveTab(tab);
    }, [location.search]);

    const [sentApplications, receivedApplications] = useMemo(() => {
        if (!currentUser) return [[], []];
        const sent = applications.filter(app => app.applicantEmail === currentUser.email).sort((a,b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
        const myProjectIds = startupIdeas.filter(idea => idea.founderEmail === currentUser.email).map(idea => idea.id);
        const received = applications.filter(app => myProjectIds.includes(app.ideaId)).sort((a,b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
        return [sent, received];
    }, [applications, startupIdeas, currentUser]);
    
    if (!currentUser) return null;

    return (
        <div className="space-y-6 max-w-6xl mx-auto font-poppins">
            <div className="flex justify-start mb-8">
                <Link to="/dashboard" className="inline-flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full px-5 py-2 shadow-none font-poppins">
                    <ChevronLeftIcon className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                </Link>
            </div>
            
            <header className="text-left mb-6 px-1">
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tighter">Applications</h1>
                <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5 uppercase tracking-widest">Track your opportunities and manage active applicants.</p>
            </header>
            
            <div className="flex justify-center mb-10">
                <div className="inline-flex p-1 bg-[var(--background-tertiary)] border border-[var(--border-primary)] rounded-full overflow-hidden shadow-none">
                    <button onClick={() => setActiveTab('sent')} className={`px-12 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'sent' ? 'button-gradient text-white shadow-none' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Sent ({sentApplications.length})</button>
                    <button onClick={() => setActiveTab('received')} className={`px-12 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'received' ? 'button-gradient text-white shadow-none' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Received ({receivedApplications.length})</button>
                </div>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
                {activeTab === 'sent' ? (
                    sentApplications.length > 0 ? sentApplications.map((app) => <SentApplicationCard key={app.id} application={app} idea={startupIdeas.find(i => i.id === app.ideaId)} />) 
                    : <div className="text-center py-16 bg-[var(--component-background)] rounded-[3rem] border-2 border-dashed border-[var(--border-primary)] shadow-none"><p className="text-xs font-bold text-[var(--text-muted)] uppercase italic tracking-widest">No applications sent yet.</p></div>
                ) : (
                    receivedApplications.length > 0 ? receivedApplications.map(app => <ReceivedApplicationCard key={app.id} application={app} idea={startupIdeas.find(i => i.id === app.ideaId)} onOpenModal={setModalApp}/>)
                    : <div className="text-center py-16 bg-[var(--component-background)] rounded-[3rem] border-2 border-dashed border border-[var(--border-primary)] shadow-none"><p className="text-xs font-bold text-[var(--text-muted)] uppercase italic tracking-widest">No applications received yet.</p></div>
                )}
            </div>
            
            {modalApp && <CoverLetterModal application={modalApp} applicant={getUserById(modalApp.applicantEmail, 'email')} onClose={() => setModalApp(null)} />}
        </div>
    );
};
