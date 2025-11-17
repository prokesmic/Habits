import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { stravaIntegration } from '@/lib/integrations/strava';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Strava OAuth error:', error);
      return NextResponse.redirect(
        new URL('/integrations?error=oauth_denied', request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/integrations?error=missing_params', request.url)
      );
    }

    // Handle the callback
    const connection = await stravaIntegration.handleCallback(code, state);

    console.log('Strava connected successfully:', {
      userId: connection.userId,
      athleteName: connection.metadata.athleteName,
    });

    // Redirect to integrations page with success message
    return NextResponse.redirect(
      new URL('/integrations?success=strava_connected', request.url)
    );
  } catch (error) {
    console.error('Strava callback error:', error);
    return NextResponse.redirect(
      new URL('/integrations?error=connection_failed', request.url)
    );
  }
}
