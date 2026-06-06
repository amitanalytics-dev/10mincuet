"use client";
import React, { ReactNode, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

interface SwipeGesturesProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeDown?: () => void;
  onSwipeUp?: () => void;
  enableRefresh?: boolean;
  enableNavigation?: boolean;
}

interface TouchStart {
  x: number;
  y: number;
  time: number;
}

export function SwipeGestures({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeDown,
  onSwipeUp,
  enableRefresh = true,
  enableNavigation = true,
}: SwipeGesturesProps) {
  const router = useRouter();
  const touchStart = useRef<TouchStart | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const SWIPE_THRESHOLD = 50;
  const TIME_THRESHOLD = 500;

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!touchStart.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      };

      const deltaX = touchStart.current.x - touchEnd.x;
      const deltaY = touchStart.current.y - touchEnd.y;
      const timeDelta = touchEnd.time - touchStart.current.time;

      if (timeDelta > TIME_THRESHOLD) {
        touchStart.current = null;
        return;
      }

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > SWIPE_THRESHOLD && absDeltaX > absDeltaY) {
        if (deltaX > 0 && onSwipeLeft) onSwipeLeft();
        else if (deltaX < 0 && onSwipeRight) onSwipeRight();
      } else if (absDeltaY > SWIPE_THRESHOLD && absDeltaY > absDeltaX) {
        if (deltaY > 0 && onSwipeDown) onSwipeDown();
        else if (deltaY < 0 && onSwipeUp) onSwipeUp();
      }

      touchStart.current = null;
    },
    [onSwipeLeft, onSwipeRight, onSwipeDown, onSwipeUp]
  );

  const handleRefresh = useCallback(async () => {
    if (!enableRefresh || isRefreshing) return;
    setIsRefreshing(true);
    try {
      router.refresh();
      setTimeout(() => setIsRefreshing(false), 600);
    } catch (error) {
      console.error("Refresh failed:", error);
      setIsRefreshing(false);
    }
  }, [enableRefresh, isRefreshing, router]);

  return (
    <div
      className="swipe-enabled relative w-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse" />
      )}
      {children}
    </div>
  );
}
