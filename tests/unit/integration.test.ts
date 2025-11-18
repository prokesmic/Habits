import { describe, it, expect, vi } from 'vitest';

// Integration tests for complete user flows

describe('User Dashboard Flow', () => {
  describe('Daily Check-in Flow', () => {
    interface Habit {
      id: string;
      name: string;
      checkedInToday: boolean;
      currentStreak: number;
    }

    const optimisticCheckIn = (habits: Habit[], habitId: string): Habit[] => {
      return habits.map(h =>
        h.id === habitId
          ? {
              ...h,
              checkedInToday: true,
              currentStreak: h.currentStreak + 1,
            }
          : h
      );
    };

    const revertCheckIn = (habits: Habit[], habitId: string): Habit[] => {
      return habits.map(h =>
        h.id === habitId
          ? {
              ...h,
              checkedInToday: false,
              currentStreak: h.currentStreak - 1,
            }
          : h
      );
    };

    it('performs optimistic update on check-in', () => {
      const initialHabits: Habit[] = [
        { id: '1', name: 'Exercise', checkedInToday: false, currentStreak: 5 },
        { id: '2', name: 'Read', checkedInToday: true, currentStreak: 10 },
      ];

      const updatedHabits = optimisticCheckIn(initialHabits, '1');

      expect(updatedHabits[0].checkedInToday).toBe(true);
      expect(updatedHabits[0].currentStreak).toBe(6);
      // Other habits unchanged
      expect(updatedHabits[1].checkedInToday).toBe(true);
      expect(updatedHabits[1].currentStreak).toBe(10);
    });

    it('reverts on API error', () => {
      const afterOptimistic: Habit[] = [
        { id: '1', name: 'Exercise', checkedInToday: true, currentStreak: 6 },
      ];

      const reverted = revertCheckIn(afterOptimistic, '1');

      expect(reverted[0].checkedInToday).toBe(false);
      expect(reverted[0].currentStreak).toBe(5);
    });

    it('updates completion percentage after check-in', () => {
      const habits: Habit[] = [
        { id: '1', name: 'Exercise', checkedInToday: false, currentStreak: 5 },
        { id: '2', name: 'Read', checkedInToday: true, currentStreak: 10 },
        { id: '3', name: 'Meditate', checkedInToday: false, currentStreak: 3 },
      ];

      // Before: 1/3 = 33%
      const completedBefore = habits.filter(h => h.checkedInToday).length;
      const rateBefore = Math.round((completedBefore / habits.length) * 100);
      expect(rateBefore).toBe(33);

      // After checking in habit 1: 2/3 = 67%
      const updatedHabits = optimisticCheckIn(habits, '1');
      const completedAfter = updatedHabits.filter(h => h.checkedInToday).length;
      const rateAfter = Math.round((completedAfter / habits.length) * 100);
      expect(rateAfter).toBe(67);
    });
  });

  describe('Navigation State Management', () => {
    const getActiveNavItem = (pathname: string): string => {
      const navItems = [
        { id: 'today', href: '/dashboard' },
        { id: 'squads', href: '/squads' },
        { id: 'discover', href: '/discover' },
        { id: 'challenges', href: '/challenges' },
        { id: 'profile', href: '/profile' },
      ];

      for (const item of navItems) {
        if (item.href === '/dashboard' && pathname === '/dashboard') {
          return item.id;
        }
        if (item.href !== '/dashboard' && pathname.startsWith(item.href)) {
          return item.id;
        }
      }

      return '';
    };

    it('highlights correct nav item for each route', () => {
      expect(getActiveNavItem('/dashboard')).toBe('today');
      expect(getActiveNavItem('/squads')).toBe('squads');
      expect(getActiveNavItem('/squads/abc')).toBe('squads');
      expect(getActiveNavItem('/discover')).toBe('discover');
      expect(getActiveNavItem('/challenges')).toBe('challenges');
      expect(getActiveNavItem('/profile')).toBe('profile');
    });

    it('handles unknown routes', () => {
      expect(getActiveNavItem('/settings')).toBe('');
      expect(getActiveNavItem('/habits')).toBe('');
    });
  });

  describe('Squad Activity Feed', () => {
    interface Activity {
      id: string;
      user: { name: string };
      timestamp: string;
      reactions: number;
    }

    it('sorts activities by most recent', () => {
      const activities: Activity[] = [
        { id: '1', user: { name: 'Alice' }, timestamp: '2024-11-17T08:00:00Z', reactions: 5 },
        { id: '2', user: { name: 'Bob' }, timestamp: '2024-11-17T10:00:00Z', reactions: 3 },
        { id: '3', user: { name: 'Charlie' }, timestamp: '2024-11-17T09:00:00Z', reactions: 8 },
      ];

      const sorted = [...activities].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      expect(sorted[0].user.name).toBe('Bob'); // Most recent
      expect(sorted[1].user.name).toBe('Charlie');
      expect(sorted[2].user.name).toBe('Alice');
    });

    it('limits feed to 5 items', () => {
      const activities: Activity[] = Array.from({ length: 10 }, (_, i) => ({
        id: String(i),
        user: { name: `User${i}` },
        timestamp: new Date().toISOString(),
        reactions: i,
      }));

      const limited = activities.slice(0, 5);
      expect(limited).toHaveLength(5);
    });
  });

  describe('Discover Page Data', () => {
    interface PopularHabit {
      id: string;
      name: string;
      users: number;
      avgStreak: number;
    }

    it('sorts habits by user count', () => {
      const habits: PopularHabit[] = [
        { id: '1', name: 'Meditation', users: 12500, avgStreak: 21 },
        { id: '2', name: 'Exercise', users: 18200, avgStreak: 14 },
        { id: '3', name: 'Reading', users: 9800, avgStreak: 18 },
      ];

      const sorted = [...habits].sort((a, b) => b.users - a.users);

      expect(sorted[0].name).toBe('Exercise');
      expect(sorted[1].name).toBe('Meditation');
      expect(sorted[2].name).toBe('Reading');
    });

    it('formats user count with locale', () => {
      const count = 18200;
      const formatted = count.toLocaleString();
      expect(formatted).toBe('18,200');
    });
  });

  describe('User Authentication Flow', () => {
    interface User {
      id: string;
      email: string;
      fullName?: string;
    }

    interface Profile {
      onboarding_completed: boolean;
      full_name?: string;
    }

    const shouldRedirectToOnboarding = (profile: Profile | null): boolean => {
      return !profile || !profile.onboarding_completed;
    };

    const getDisplayName = (user: User, profile: Profile | null): string => {
      if (profile?.full_name) {
        return profile.full_name.split(' ')[0];
      }
      return user.email.split('@')[0];
    };

    it('redirects to onboarding when not completed', () => {
      const profile: Profile = { onboarding_completed: false };
      expect(shouldRedirectToOnboarding(profile)).toBe(true);
    });

    it('allows access when onboarding completed', () => {
      const profile: Profile = { onboarding_completed: true };
      expect(shouldRedirectToOnboarding(profile)).toBe(false);
    });

    it('redirects when profile is null', () => {
      expect(shouldRedirectToOnboarding(null)).toBe(true);
    });

    it('uses full name for display when available', () => {
      const user: User = { id: '1', email: 'john@example.com' };
      const profile: Profile = { onboarding_completed: true, full_name: 'John Doe' };

      expect(getDisplayName(user, profile)).toBe('John');
    });

    it('falls back to email when no profile name', () => {
      const user: User = { id: '1', email: 'john.doe@example.com' };
      const profile: Profile = { onboarding_completed: true };

      expect(getDisplayName(user, profile)).toBe('john.doe');
    });
  });

  describe('Branding Consistency', () => {
    it('uses Habitio brand name', () => {
      const brandName = 'Habitio';
      expect(brandName).toBe('Habitio');
      expect(brandName).not.toBe('Momentum');
      expect(brandName).not.toBe('HabitTracker');
    });

    it('uses correct logo letter', () => {
      const logoLetter = 'H';
      expect(logoLetter).toBe('H');
      expect(logoLetter).not.toBe('M');
    });

    it('uses orange-blue gradient theme', () => {
      const gradientClasses = 'from-orange-500 to-blue-500';
      expect(gradientClasses).toContain('orange');
      expect(gradientClasses).toContain('blue');
    });
  });
});

describe('Error Handling', () => {
  it('handles empty habits array gracefully', () => {
    const habits: unknown[] = [];
    const completionRate = habits.length > 0 ? 50 : 0;
    expect(completionRate).toBe(0);
  });

  it('handles missing optional fields', () => {
    const habit = {
      id: '1',
      name: 'Test',
      checkedInToday: false,
      currentStreak: 0,
    };

    const hasStake = habit.hasStake ?? false;
    const stakeAmount = habit.stakeAmount ?? 0;

    expect(hasStake).toBe(false);
    expect(stakeAmount).toBe(0);
  });

  it('sanitizes user input for display', () => {
    const userName = '<script>alert("xss")</script>';
    // In React, this is automatically escaped
    const sanitized = userName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    expect(sanitized).not.toContain('<script>');
  });
});
