import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = user.id;
  const today = new Date().toISOString().split('T')[0];

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', userId)
    .single();

  // Fetch habits
  const { data: habits } = await supabase
    .from('habits')
    .select('id, title, emoji, frequency, target_days_per_week')
    .eq('user_id', userId)
    .eq('archived', false);

  // Check which habits have been checked in today
  const { data: todayLogs } = await supabase
    .from('habit_logs')
    .select('habit_id')
    .eq('user_id', userId)
    .eq('log_date', today)
    .eq('status', 'done');

  const checkedInHabitIds = new Set((todayLogs ?? []).map(log => String(log.habit_id)));

  // Transform habits with mock squad data
  const processedHabits = (habits ?? []).map((habit) => {
    const currentStreak = Math.floor(Math.random() * 15);
    const mockSquadMembers = ['Emma', 'John', 'Sarah', 'Mike', 'Lisa']
      .slice(0, Math.floor(Math.random() * 5) + 1)
      .map((name, i) => ({
        id: `member-${i}`,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        checkedInToday: Math.random() > 0.4,
      }));

    return {
      id: String(habit.id),
      name: habit.title ?? 'Habit',
      emoji: habit.emoji ?? '✅',
      currentStreak,
      longestStreak: Math.floor(Math.random() * 60) + currentStreak,
      checkedInToday: checkedInHabitIds.has(String(habit.id)),
      squadMembers: mockSquadMembers,
      hasStake: Math.random() > 0.7,
      stakeAmount: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : undefined,
    };
  });

  const completedCount = processedHabits.filter(h => h.checkedInToday).length;
  const totalCount = processedHabits.length;

  // Mock activity feed
  const mockActivities = [
    {
      id: 'activity-1',
      user: { name: 'Emma', avatar: '' },
      habit: { name: 'Morning Workout', emoji: '💪' },
      proof: {
        photoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
        note: 'Crushed it! 30 min HIIT session done.',
      },
      reactions: 8,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: 'activity-2',
      user: { name: 'John', avatar: '' },
      habit: { name: 'Read 30 mins', emoji: '📚' },
      proof: {
        note: 'Finished chapter 5 of Atomic Habits!',
      },
      reactions: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'activity-3',
      user: { name: 'Sarah', avatar: '' },
      habit: { name: 'Meditation', emoji: '🧘' },
      proof: {
        note: '15 minutes of mindfulness. Feeling centered.',
      },
      reactions: 4,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
  ];

  // Hot streaks (habits with 7+ day streaks)
  const hotStreaks = processedHabits
    .filter(h => h.currentStreak >= 7)
    .map(h => ({
      habitId: h.id,
      habitName: h.name,
      emoji: h.emoji,
      days: h.currentStreak,
      isHot: true,
    }))
    .sort((a, b) => b.days - a.days);

  // Mock achievements
  const mockAchievements = [
    { id: '1', name: 'First Check-in', emoji: '🎯' },
    { id: '2', name: '7-Day Streak', emoji: '🔥' },
    { id: '3', name: 'Early Bird', emoji: '🌅' },
    { id: '4', name: 'Squad Leader', emoji: '👑' },
    { id: '5', name: 'Consistency King', emoji: '⭐' },
    { id: '6', name: 'Photo Pro', emoji: '📸' },
  ];

  // Calculate user's max streak
  const maxStreak = processedHabits.length > 0
    ? Math.max(...processedHabits.map(h => h.currentStreak))
    : 0;

  const userName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const firstName = userName.split(' ')[0];

  // Build response
  const response = {
    user: {
      name: userName,
      firstName,
      avatar: profile?.avatar_url || '',
      totalStreak: maxStreak,
    },
    today: {
      date: new Date(),
      completed: completedCount,
      total: totalCount,
      habits: processedHabits,
    },
    squad: {
      activeNow: Math.floor(Math.random() * 8) + 2,
      recentActivity: mockActivities,
      checkInsToday: Math.floor(Math.random() * 20) + 5,
    },
    streaks: hotStreaks,
    achievements: mockAchievements,
    stakes: processedHabits.some(h => h.hasStake)
      ? {
          active: processedHabits.filter(h => h.hasStake).length,
          amount: processedHabits.reduce((sum, h) => sum + (h.stakeAmount || 0), 0),
        }
      : null,
  };

  return NextResponse.json(response);
}
