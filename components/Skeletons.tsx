import React from 'react';

export const ProjectCardSkeleton: React.FC = () => (
  <div className="bg-gray-100 dark:bg-neutral-800/70 rounded-xl shadow-lg p-5 space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="h-6 w-28 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
      <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
    </div>
    <div className="h-6 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
    <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
    </div>
    <div className="h-4 w-1/2 bg-gray-200 dark:bg-neutral-700 rounded-md mt-2"></div>
    <div className="flex flex-wrap gap-2 pt-2">
        <div className="h-6 w-20 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
        <div className="h-6 w-24 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
    </div>
    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-neutral-700/70 mt-4">
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
        <div className="h-8 w-28 bg-gray-300 dark:bg-neutral-700 rounded-lg"></div>
    </div>
  </div>
);

export const ProfileSectionSkeleton: React.FC<{ hasImage?: boolean }> = ({ hasImage }) => (
    <div className={`bg-gray-100 dark:bg-neutral-800/60 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/60 animate-pulse ${hasImage ? 'flex flex-col md:flex-row items-center gap-8' : ''}`}>
        {hasImage && (
             <div className="w-40 h-40 bg-gray-200 dark:bg-neutral-700 rounded-full flex-shrink-0"></div>
        )}
        <div className="w-full space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded-md"></div>
            {hasImage && <div className="h-10 w-40 bg-gray-300 dark:bg-neutral-600 rounded-lg mt-2"></div>}
        </div>
    </div>
);
