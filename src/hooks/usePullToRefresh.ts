import { useEffect, useRef, useState } from "react";

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const threshold = 80;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && startY.current > 0) {
        const distance = e.touches[0].clientY - startY.current;
        if (distance > 0) {
          setPullDistance(Math.min(distance, threshold));
          setIsPulling(true);
        }
      }
    };
    const handleTouchEnd = async () => {
      if (pullDistance >= threshold) {
        await onRefresh();
      }
      setIsPulling(false);
      setPullDistance(0);
      startY.current = 0;
    };
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance, onRefresh]);

  return { isPulling, pullDistance };
}


