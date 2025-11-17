import { describe, it, expect } from 'vitest';

// Test utilities and helper functions for dashboard

describe('Dashboard utility functions', () => {
  describe('completionRate calculation', () => {
    it('calculates 0% when no habits exist', () => {
      const completedToday = 0;
      const totalToday = 0;
      const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
      expect(completionRate).toBe(0);
    });

    it('calculates 100% when all habits completed', () => {
      const completedToday = 5;
      const totalToday = 5;
      const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
      expect(completionRate).toBe(100);
    });

    it('calculates correct percentage for partial completion', () => {
      const completedToday = 3;
      const totalToday = 10;
      const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
      expect(completionRate).toBe(30);
    });

    it('rounds percentage correctly', () => {
      const completedToday = 1;
      const totalToday = 3;
      const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
      expect(completionRate).toBe(33); // 33.33... rounds to 33
    });

    it('handles edge case of single habit', () => {
      const completedToday = 1;
      const totalToday = 1;
      const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
      expect(completionRate).toBe(100);
    });
  });

  describe('Hot streaks filtering', () => {
    interface MockHabit {
      id: string;
      name: string;
      currentStreak: number;
    }

    it('filters habits with 7+ day streaks', () => {
      const habits: MockHabit[] = [
        { id: '1', name: 'Habit 1', currentStreak: 10 },
        { id: '2', name: 'Habit 2', currentStreak: 3 },
        { id: '3', name: 'Habit 3', currentStreak: 7 },
        { id: '4', name: 'Habit 4', currentStreak: 6 },
      ];

      const hotStreaks = habits
        .filter(h => h.currentStreak >= 7)
        .sort((a, b) => b.currentStreak - a.currentStreak);

      expect(hotStreaks).toHaveLength(2);
      expect(hotStreaks[0].id).toBe('1'); // Highest streak first
      expect(hotStreaks[1].id).toBe('3');
    });

    it('returns empty array when no hot streaks', () => {
      const habits: MockHabit[] = [
        { id: '1', name: 'Habit 1', currentStreak: 3 },
        { id: '2', name: 'Habit 2', currentStreak: 5 },
      ];

      const hotStreaks = habits.filter(h => h.currentStreak >= 7);
      expect(hotStreaks).toHaveLength(0);
    });

    it('sorts by streak count descending', () => {
      const habits: MockHabit[] = [
        { id: '1', name: 'Habit 1', currentStreak: 7 },
        { id: '2', name: 'Habit 2', currentStreak: 30 },
        { id: '3', name: 'Habit 3', currentStreak: 14 },
      ];

      const hotStreaks = habits
        .filter(h => h.currentStreak >= 7)
        .sort((a, b) => b.currentStreak - a.currentStreak);

      expect(hotStreaks[0].currentStreak).toBe(30);
      expect(hotStreaks[1].currentStreak).toBe(14);
      expect(hotStreaks[2].currentStreak).toBe(7);
    });

    it('limits to top 5 streaks', () => {
      const habits: MockHabit[] = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        name: `Habit ${i}`,
        currentStreak: 10 + i,
      }));

      const hotStreaks = habits
        .filter(h => h.currentStreak >= 7)
        .sort((a, b) => b.currentStreak - a.currentStreak)
        .slice(0, 5);

      expect(hotStreaks).toHaveLength(5);
    });
  });

  describe('Stake calculations', () => {
    interface MockHabit {
      hasStake?: boolean;
      stakeAmount?: number;
    }

    it('calculates total stake amount', () => {
      const habits: MockHabit[] = [
        { hasStake: true, stakeAmount: 25 },
        { hasStake: false },
        { hasStake: true, stakeAmount: 50 },
      ];

      const totalStakeAmount = habits.reduce((sum, h) => sum + (h.stakeAmount || 0), 0);
      expect(totalStakeAmount).toBe(75);
    });

    it('counts active stakes', () => {
      const habits: MockHabit[] = [
        { hasStake: true, stakeAmount: 25 },
        { hasStake: false },
        { hasStake: true, stakeAmount: 50 },
        { hasStake: true, stakeAmount: 10 },
      ];

      const stakeCount = habits.filter(h => h.hasStake).length;
      expect(stakeCount).toBe(3);
    });

    it('returns null when no active stakes', () => {
      const habits: MockHabit[] = [
        { hasStake: false },
        { hasStake: false },
      ];

      const hasActiveStakes = habits.some(h => h.hasStake);
      const stakes = hasActiveStakes ? { count: 0, totalAmount: 0 } : null;

      expect(stakes).toBeNull();
    });
  });

  describe('Navigation path detection', () => {
    const isActivePath = (pathname: string, href: string): boolean => {
      if (href === '/dashboard') {
        return pathname === '/dashboard';
      }
      if (href === '/habits/new') {
        return false; // FAB is never active
      }
      return pathname?.startsWith(href) ?? false;
    };

    it('matches exact dashboard path', () => {
      expect(isActivePath('/dashboard', '/dashboard')).toBe(true);
    });

    it('does not match dashboard when on sub-route', () => {
      expect(isActivePath('/dashboard/settings', '/dashboard')).toBe(false);
    });

    it('matches squads and sub-routes', () => {
      expect(isActivePath('/squads', '/squads')).toBe(true);
      expect(isActivePath('/squads/123', '/squads')).toBe(true);
      expect(isActivePath('/squads/abc/chat', '/squads')).toBe(true);
    });

    it('FAB is never active', () => {
      expect(isActivePath('/habits/new', '/habits/new')).toBe(false);
    });

    it('matches discover routes', () => {
      expect(isActivePath('/discover', '/discover')).toBe(true);
      expect(isActivePath('/discover/habits', '/discover')).toBe(true);
    });

    it('does not match unrelated paths', () => {
      expect(isActivePath('/settings', '/squads')).toBe(false);
      expect(isActivePath('/profile', '/dashboard')).toBe(false);
    });
  });
});
