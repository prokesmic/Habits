import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stravaIntegration } from '@/lib/integrations/strava';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { integrationId } = await request.json();

    let authUrl: string;

    switch (integrationId) {
      case 'strava':
        authUrl = await stravaIntegration.authorize(user.id);
        break;
      // Add other integrations here
      // case 'fitbit':
      //   authUrl = await fitbitIntegration.authorize(user.id);
      //   break;
      default:
        return NextResponse.json({ error: 'Unknown integration' }, { status: 400 });
    }

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Integration authorization error:', error);
    return NextResponse.json({ error: 'Failed to authorize integration' }, { status: 500 });
  }
}
