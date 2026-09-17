import React from 'react';

/**
 * Reusable animated pulse skeletons to prevent Cumulative Layout Shift (CLS)
 * and provide a seamless loading experience during network data hydration.
 */

export function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/5 border border-white/5 ${className}`} />
  );
}

export function RoverCardSkeleton() {
  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between animate-pulse">
      {/* Aspect 16/10 Image placeholder */}
      <div className="relative aspect-[16/10] bg-space-900/80 border-b border-white/5 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/5" />
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="w-24 h-6 rounded-full bg-white/10" />
          <div className="w-20 h-6 rounded-full bg-white/5" />
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-3/4 h-8 bg-white/10 rounded-lg" />
          <div className="w-full h-4 bg-white/5 rounded" />
          <div className="w-5/6 h-4 bg-white/5 rounded" />
        </div>

        {/* Specs placeholder */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 h-14" />
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 h-14" />
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 h-14" />
        </div>
      </div>
    </div>
  );
}

export function TeamMemberSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col items-center text-center space-y-4 animate-pulse">
      {/* Avatar skeleton */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white/10 border border-white/10" />
      
      <div className="space-y-2 w-full flex flex-col items-center">
        <div className="w-3/4 h-5 bg-white/10 rounded" />
        <div className="w-1/2 h-3.5 bg-white/5 rounded" />
      </div>

      <div className="w-20 h-6 bg-white/5 rounded-full border border-white/5" />

      {/* Social links placeholder */}
      <div className="flex gap-2 pt-2">
        <div className="w-8 h-8 rounded-lg bg-white/5" />
        <div className="w-8 h-8 rounded-lg bg-white/5" />
        <div className="w-8 h-8 rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

export function AchievementCardSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-24 h-6 bg-white/10 rounded-full" />
        <div className="w-16 h-5 bg-white/5 rounded" />
      </div>
      <div className="w-full aspect-[16/10] rounded-2xl bg-white/5 border border-white/5" />
      <div className="space-y-2">
        <div className="w-3/4 h-6 bg-white/10 rounded" />
        <div className="w-full h-4 bg-white/5 rounded" />
      </div>
    </div>
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/10 animate-pulse">
      <div className="aspect-[16/11] bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="w-20 h-5 bg-white/10 rounded" />
        <div className="w-full h-5 bg-white/10 rounded" />
        <div className="w-2/3 h-4 bg-white/5 rounded" />
      </div>
    </div>
  );
}

export default {
  SkeletonBox,
  RoverCardSkeleton,
  TeamMemberSkeleton,
  AchievementCardSkeleton,
  MediaCardSkeleton,
};
