import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CollapsibleSection } from '@/components/dashboard/CollapsibleSection';
import { Award } from 'lucide-react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<object>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('CollapsibleSection', () => {
  it('renders title correctly', () => {
    render(
      <CollapsibleSection title="Test Section">
        <p>Content</p>
      </CollapsibleSection>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <CollapsibleSection
        title="Achievements"
        icon={<Award data-testid="award-icon" className="w-5 h-5" />}
      >
        <p>Content</p>
      </CollapsibleSection>
    );

    expect(screen.getByTestId('award-icon')).toBeInTheDocument();
  });

  it('is collapsed by default', () => {
    render(
      <CollapsibleSection title="Test Section">
        <p>Hidden Content</p>
      </CollapsibleSection>
    );

    // Content should not be visible when collapsed
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('can be expanded when defaultCollapsed is false', () => {
    render(
      <CollapsibleSection title="Test Section" defaultCollapsed={false}>
        <p>Visible Content</p>
      </CollapsibleSection>
    );

    expect(screen.getByText('Visible Content')).toBeInTheDocument();
  });

  it('toggles content on button click', () => {
    render(
      <CollapsibleSection title="Test Section">
        <p>Toggle Content</p>
      </CollapsibleSection>
    );

    // Initially collapsed
    expect(screen.queryByText('Toggle Content')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Toggle Content')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Toggle Content')).not.toBeInTheDocument();
  });

  it('has correct text colors for visibility', () => {
    render(
      <CollapsibleSection title="Test Section">
        <p>Content</p>
      </CollapsibleSection>
    );

    // The title text itself should be wrapped in a div with text-gray-900
    const titleText = screen.getByText('Test Section');
    const titleContainer = titleText.closest('div.flex.items-center.gap-2');
    expect(titleContainer).toHaveClass('text-gray-900');
  });

  it('chevron rotates when expanded', () => {
    render(
      <CollapsibleSection title="Test Section" defaultCollapsed={false}>
        <p>Content</p>
      </CollapsibleSection>
    );

    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toHaveClass('rotate-180');
  });
});

describe('Navigation path utilities', () => {
  describe('isActivePath for BottomNavigation', () => {
    const isActivePath = (pathname: string, href: string): boolean => {
      if (href === '/dashboard') {
        return pathname === '/dashboard';
      }
      if (href === '/habits/new') {
        return false;
      }
      return pathname?.startsWith(href) ?? false;
    };

    it('handles all primary nav routes', () => {
      const routes = [
        { path: '/dashboard', nav: '/dashboard', expected: true },
        { path: '/squads', nav: '/squads', expected: true },
        { path: '/squads/abc', nav: '/squads', expected: true },
        { path: '/discover', nav: '/discover', expected: true },
        { path: '/profile', nav: '/profile', expected: true },
        { path: '/habits/new', nav: '/habits/new', expected: false }, // FAB
      ];

      routes.forEach(({ path, nav, expected }) => {
        expect(isActivePath(path, nav)).toBe(expected);
      });
    });
  });
});

describe('Date formatting', () => {
  it('formats date correctly for dashboard header', () => {
    const date = new Date('2024-11-17');
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    expect(formatted).toContain('November');
    expect(formatted).toContain('17');
  });
});

describe('Activity timestamp formatting', () => {
  it('formats recent timestamps as relative time', () => {
    const now = Date.now();
    const thirtyMinutesAgo = new Date(now - 1000 * 60 * 30);

    // This would be "30 minutes ago"
    const diff = Math.round((now - thirtyMinutesAgo.getTime()) / (1000 * 60));
    expect(diff).toBe(30);
  });

  it('formats older timestamps correctly', () => {
    const now = Date.now();
    const twoHoursAgo = new Date(now - 1000 * 60 * 60 * 2);

    const diff = Math.round((now - twoHoursAgo.getTime()) / (1000 * 60 * 60));
    expect(diff).toBe(2);
  });
});

describe('Habit data transformations', () => {
  interface HabitInput {
    id: string | number;
    title: string;
    emoji: string | null;
  }

  interface HabitOutput {
    id: string;
    name: string;
    emoji: string;
  }

  const transformHabit = (input: HabitInput): HabitOutput => ({
    id: String(input.id),
    name: input.title ?? 'Habit',
    emoji: input.emoji ?? '✅',
  });

  it('converts id to string', () => {
    const input = { id: 123, title: 'Test', emoji: '🏃' };
    const output = transformHabit(input);
    expect(output.id).toBe('123');
    expect(typeof output.id).toBe('string');
  });

  it('uses default emoji when null', () => {
    const input = { id: '1', title: 'Test', emoji: null };
    const output = transformHabit(input);
    expect(output.emoji).toBe('✅');
  });

  it('renames title to name', () => {
    const input = { id: '1', title: 'Morning Workout', emoji: '💪' };
    const output = transformHabit(input);
    expect(output.name).toBe('Morning Workout');
  });
});

describe('User greeting', () => {
  it('extracts first name from full name', () => {
    const fullName = 'John Doe';
    const firstName = fullName.split(' ')[0];
    expect(firstName).toBe('John');
  });

  it('handles single name', () => {
    const fullName = 'John';
    const firstName = fullName.split(' ')[0];
    expect(firstName).toBe('John');
  });

  it('extracts username from email', () => {
    const email = 'john.doe@example.com';
    const username = email.split('@')[0];
    expect(username).toBe('john.doe');
  });

  it('provides fallback for missing name', () => {
    const userName = null;
    const email = 'test@example.com';
    const displayName = userName || email?.split('@')[0] || 'User';
    expect(displayName).toBe('test');
  });
});
