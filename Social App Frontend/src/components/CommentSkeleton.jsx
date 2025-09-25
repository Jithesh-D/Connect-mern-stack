import React from "react";

const CommentSkeleton = () => (
  <div
    className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-2
                  border border-gray-200 dark:border-gray-700"
  >
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
    </div>
  </div>
);

export const CommentSkeletons = () => (
  <div className="space-y-4">
    <CommentSkeleton />
    <CommentSkeleton />
    <CommentSkeleton />
  </div>
);
