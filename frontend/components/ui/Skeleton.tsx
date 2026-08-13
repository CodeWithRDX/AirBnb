import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3 animate-pulse">
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-1"></div>
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="w-full h-[450px] bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
    </div>
  );
};
