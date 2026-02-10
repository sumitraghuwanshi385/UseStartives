

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ActivityItem as AppActivityItem, StartupIdea } from '../types';
import { PageTitle } from '../App';
// FIX: Import APP_NAME from constants instead of trying to get it from context.
import { APP_NAME } from '../constants';

// Icons (can be reused or copied from DashboardPage or other relevant files)
const IdeaStarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2l-2.81 6.63-7.19.61L7.46 13.97l-1.64 7.03L12 17.27z" />
  </svg>
);
const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
);
const ClockIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ArrowLeftCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);


const ActivityLogPage: React.FC = () => {
    const { currentUser, startupIdeas, applications } = useAppContext();
    const navigate = useNavigate();

    // Reconstruct all activities (can be expanded later with more activity types)
    const allActivities: AppActivityItem[] = [
        ...(startupIdeas
            .filter(idea => idea.founderEmail === currentUser?.email)
            .map(idea => ({
                id: `project-${idea.id}`, type: 'project_created', title: `Created Project: ${idea.title}`,
                description: idea.tagline, timestamp: idea.postedDate, 
                icon: <IdeaStarIcon className="w-4 h-4" />, link: `/idea/${idea.id}`
            }))),
        ...(applications
            .filter(app => app.applicantEmail === currentUser?.email)
            .map(app => {
                const idea = startupIdeas.find(i => i.id === app.ideaId);
                const position = idea?.positions.find(p => p.id === app.positionId);
                return {
                    id: `app-${app.id}`, type: 'application_sent', title: `Applied to: ${idea?.title || 'Unknown Project'}`,
                    description: `For position: ${position?.title || 'Unknown Position'} (Status: ${app.status})`,
                    timestamp: app.submittedDate, 
                    icon: <PaperAirplaneIcon className="w-4 h-4 -rotate-12" />, link: `/idea/${app.ideaId}`
                };
            }))
        // Add more activity types here in the future (e.g., profile updates, connections made)
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const formatFullTimestamp = (isoString: string): string => {
        return new Date(isoString).toLocaleString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    };

    return (
        <div className="text-[var(--text-primary)]">
            <PageTitle title="Full Activity Log" description={`A complete history of your actions and updates on ${APP_NAME}.`} />

            {allActivities.length > 0 ? (
                <div className="bg-[var(--component-background)] backdrop-blur-md rounded-xl shadow-2xl border border-[var(--border-primary)] overflow-hidden">
                    <ul className="divide-y divide-[var(--border-primary)]">
                        {allActivities.map(activity => (
                            <li key={activity.id} className="p-4 sm:p-6 hover:bg-[var(--component-secondary-background)] transition-colors duration-150 group">
                                <div className="flex items-start space-x-4">
                                    <span className={`flex-shrink-0 mt-1 p-2 rounded-full shadow-inner ${activity.type === 'project_created' ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'}`}>
                                        {React.cloneElement(activity.icon, { className: "w-5 h-5"})}
                                    </span>
                                    <div className="flex-grow">
                                        <Link to={activity.link || '#'} className="text-base font-semibold text-[var(--text-primary)] hover:text-purple-600 dark:hover:text-purple-300 hover:underline line-clamp-2">
                                            {activity.title}
                                        </Link>
                                        <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed line-clamp-3">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)] mt-2">{formatFullTimestamp(activity.timestamp)}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center py-16 bg-[var(--component-background)] rounded-xl border border-[var(--border-primary)] p-8 shadow-xl">
                    <ClockIcon className="text-[var(--text-muted)] w-20 h-20 mx-auto mb-6 opacity-70" />
                    <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">No Activities Yet</h2>
                    <p className="text-[var(--text-muted)]">Your activity log is currently empty. Start interacting with projects or update your profile!</p>
                </div>
            )}

            <div className="mt-12 text-center">
                <button 
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-colors duration-300 group"
                >
                    <ArrowLeftCircleIcon className="w-5 h-5 mr-1.5 opacity-80 group-hover:opacity-100 transition-opacity" />
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default ActivityLogPage;
