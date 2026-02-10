

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { AppNotification, NotificationCategory } from '../types';
import { PageTitle } from '../App';
import { UserPlusIcon, AppContextLinkIcon } from '../constants';

// Icons (can be reused or define new ones if needed)
const ArrowLeftCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const CheckBadgeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
);
const BellAlertIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M12 6.75a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5zM12 12.75a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5z" /></svg>
);
// Action icons for connections (if needed, though primary actions are in dropdown or specific pages)
const CheckCircleIcon: React.FC<{className?: string}> = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIconMini: React.FC<{className?: string}> = ({className="w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


type ActiveNotificationsTab = 'applications_to_my_project' | 'connections';

const NotificationsPage: React.FC = () => {
    const { 
        appNotifications, markNotificationAsRead, markAllNotificationsAsRead,
        acceptConnectionRequest, declineConnectionRequest 
    } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ActiveNotificationsTab>('applications_to_my_project');

    const handleNotificationClick = (notification: AppNotification) => {
        markNotificationAsRead(notification.id);
        if (notification.category === 'applications_to_my_project' && notification.relatedApplicationId) {
             navigate(`/my-applications?tab=received&appId=${notification.relatedApplicationId}`);
        } else if (notification.link) { 
            navigate(notification.link);
        }
    };
    
    const tabConfig: { key: ActiveNotificationsTab, label: string, icon: React.ReactElement<{ className?: string }> }[] = [
        { key: 'applications_to_my_project', label: 'Applications Received', icon: <UserPlusIcon className="w-4 h-4" /> },
        { key: 'connections', label: 'Connection Requests', icon: <AppContextLinkIcon className="w-4 h-4" /> },
    ];

    const getFilteredNotifications = () => {
        return appNotifications
            .filter(n => n.category === activeTab)
            .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    
    const currentNotifications = getFilteredNotifications();
    const unreadCountForTab = currentNotifications.filter(n => !n.isRead && n.status === 'pending').length;


    return (
        <div className="text-neutral-800 dark:text-neutral-100">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <PageTitle title="Notifications Center" description="Manage your applications received and connection requests." className="mb-0"/>
                {unreadCountForTab > 0 && (
                    <button
                        onClick={() => markAllNotificationsAsRead(activeTab)}
                        className="flex items-center space-x-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        title={`Mark all in ${activeTab === 'applications_to_my_project' ? 'Applications Received' : 'Connections'} as read`}
                    >
                        <CheckBadgeIcon className="w-5 h-5"/>
                        <span>Mark All in Tab as Read</span>
                    </button>
                )}
            </div>

            <div className="mb-6 bg-white dark:bg-neutral-800/60 p-1.5 rounded-xl border border-gray-200 dark:border-neutral-700/50 inline-flex flex-wrap space-x-1">
                {tabConfig.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg relative transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-purple-500/50
                        ${activeTab === tab.key 
                            ? 'bg-purple-600 text-white' 
                            : 'text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-neutral-700/60'
                        }`}
                        aria-pressed={activeTab === tab.key}
                    >
                        {React.cloneElement(tab.icon, { className: `w-4 h-4 mr-1 opacity-90 ${activeTab === tab.key ? 'text-purple-100': 'text-neutral-500 dark:text-neutral-400'}`})}
                        <span>{tab.label}</span>
                        {appNotifications.filter(n => n.category === tab.key && !n.isRead && n.status === 'pending').length > 0 && (
                           <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-purple-400/70 text-purple-50' : 'bg-gray-200 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-200'}`}>
                               {appNotifications.filter(n => n.category === tab.key && !n.isRead && n.status === 'pending').length}
                           </span>
                        )}
                    </button>
                ))}
            </div>


            {currentNotifications.length > 0 ? (
                <div className="bg-white dark:bg-neutral-800/70 backdrop-blur-md rounded-xl border border-gray-200 dark:border-neutral-700/60 overflow-hidden">
                    <ul className="divide-y divide-gray-200 dark:divide-neutral-700/70">
                        {currentNotifications.map(notification => (
                            <li 
                                key={notification.id} 
                                className={`p-4 sm:p-6 transition-colors duration-150 group 
                                            ${!notification.isRead && notification.status === 'pending' ? 'bg-purple-500/5 dark:bg-neutral-700/30' : ''}
                                            ${notification.status === 'accepted' ? 'opacity-70 bg-emerald-500/5' : ''}
                                            ${notification.status === 'rejected' ? 'opacity-60 bg-red-500/5' : ''}
                                            `}
                            >
                                <div 
                                  className={`flex items-start space-x-4 ${(notification.category === 'applications_to_my_project' || notification.link) ? 'cursor-pointer' : ''}`}
                                  onClick={() => handleNotificationClick(notification)}
                                  onKeyPress={(e) => { if (e.key === 'Enter') handleNotificationClick(notification);}}
                                  tabIndex={(notification.category === 'applications_to_my_project' || notification.link) ? 0 : -1}
                                  role="button"
                                  aria-label={`View notification: ${notification.title}`}
                                >
                                    <span className={`flex-shrink-0 mt-1 p-2 rounded-full
                                        ${!notification.isRead && notification.status === 'pending' ? 'bg-purple-100 dark:bg-purple-500/20' : 'bg-gray-100 dark:bg-neutral-700/50'}
                                        ${notification.status === 'accepted' ? 'bg-emerald-100 dark:bg-emerald-500/20' : ''}
                                        ${notification.status === 'rejected' ? 'bg-red-100 dark:bg-red-500/20' : ''}
                                    `}>
                                      {React.cloneElement(notification.icon, {className: `w-5 h-5 
                                        ${!notification.isRead && notification.status === 'pending' ? 'text-purple-600 dark:text-purple-300' : 'text-neutral-500 dark:text-neutral-400'}
                                        ${notification.status === 'accepted' ? 'text-emerald-600 dark:text-emerald-300' : ''}
                                        ${notification.status === 'rejected' ? 'text-red-600 dark:text-red-300' : ''}
                                      `})}
                                    </span>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`text-base font-semibold ${!notification.isRead && notification.status === 'pending' ? 'text-neutral-900 dark:text-white' : 'text-neutral-800 dark:text-neutral-100'}`}>
                                                {notification.title}
                                            </h3>
                                            {!notification.isRead && notification.status === 'pending' && (
                                                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-1 flex-shrink-0" title="Unread"></div>
                                            )}
                                        </div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                                            {notification.description}
                                        </p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                                            {new Date(notification.timestamp).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        {notification.status === 'pending' && activeTab === 'connections' && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); acceptConnectionRequest(notification.id); }} className="px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 rounded-md transition-colors flex items-center space-x-1 border border-emerald-200 dark:border-emerald-500/30"><CheckCircleIcon className="w-3.5 h-3.5"/><span>Accept</span></button>
                                                <button onClick={(e) => { e.stopPropagation(); declineConnectionRequest(notification.id); }} className="px-3 py-1 text-xs font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 rounded-md transition-colors flex items-center space-x-1 border border-red-200 dark:border-red-500/30"><XCircleIconMini className="w-3.5 h-3.5"/><span>Decline</span></button>
                                            </div>
                                        )}
                                        {notification.status === 'accepted' && <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 italic">Status: Accepted</p>}
                                        {notification.status === 'rejected' && <p className="mt-2 text-xs text-red-600 dark:text-red-400 italic">Status: Rejected</p>}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-neutral-800/50 rounded-xl border border-gray-200 dark:border-neutral-700/60 p-8">
                    <BellAlertIcon className="text-gray-400 dark:text-neutral-600 w-20 h-20 mx-auto mb-6 opacity-70" />
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3">No notifications in this tab</h2>
                    <p className="text-neutral-500 dark:text-neutral-400">Your notification tray is empty for this category.</p>
                </div>
            )}

            <div className="mt-12 text-center">
                <Link 
                    to="/dashboard" 
                    className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-colors duration-300 group"
                >
                    <ArrowLeftCircleIcon className="w-5 h-5 mr-1.5 opacity-80 group-hover:opacity-100 transition-opacity" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotificationsPage;