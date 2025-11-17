import webpush from 'web-push';

// Configure VAPID keys for web push
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:support@habitstake.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export interface PushSubscriptionData {
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  currentStreak: number;
}

export const sendPushNotification = async (
  subscription: PushSubscriptionData,
  payload: NotificationPayload
): Promise<void> => {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys
      },
      JSON.stringify(payload)
    );
  } catch (error: unknown) {
    console.error('Push notification failed:', error);

    // Remove invalid subscriptions (410 = subscription expired)
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const err = error as { statusCode: number };
      if (err.statusCode === 410) {
        // TODO: Remove subscription from database
        console.log('Subscription expired, should be removed:', subscription.endpoint);
      }
    }
  }
};

export const sendHabitReminder = async (
  subscriptions: PushSubscriptionData[],
  habit: Habit
): Promise<void> => {
  for (const subscription of subscriptions) {
    await sendPushNotification(subscription, {
      title: `Time for ${habit.name}! ${habit.emoji}`,
      body: `Don't break your ${habit.currentStreak}-day streak!`,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      data: {
        habitId: habit.id,
        url: '/habits'
      }
    });
  }
};

export const sendSquadActivity = async (
  subscriptions: PushSubscriptionData[],
  memberName: string,
  habitName: string
): Promise<void> => {
  for (const subscription of subscriptions) {
    await sendPushNotification(subscription, {
      title: 'Squad Activity',
      body: `${memberName} just checked in to ${habitName}!`,
      icon: '/icon-192.png',
      data: {
        url: '/dashboard'
      }
    });
  }
};

export const sendStreakMilestone = async (
  subscriptions: PushSubscriptionData[],
  habitName: string,
  days: number
): Promise<void> => {
  for (const subscription of subscriptions) {
    await sendPushNotification(subscription, {
      title: `${days}-Day Streak! 🔥`,
      body: `Congratulations! You've maintained ${habitName} for ${days} days!`,
      icon: '/icon-192.png',
      data: {
        url: '/habits'
      }
    });
  }
};
