import crypto from 'crypto';
import { BaseIntegration, ActivityData, IntegrationConnection } from './types';
import { createClient } from '@/lib/supabase/server';

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  start_date: string;
  moving_time: number;
  distance: number;
  calories?: number;
  average_speed: number;
  max_speed: number;
  total_elevation_gain: number;
}

interface StravaTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete: {
    id: number;
    firstname: string;
    lastname: string;
  };
}

export class StravaIntegration extends BaseIntegration {
  id = 'strava';
  name = 'Strava';

  private clientId = process.env.STRAVA_CLIENT_ID || '';
  private clientSecret = process.env.STRAVA_CLIENT_SECRET || '';
  private redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/integrations/strava/callback`;

  async authorize(userId: string): Promise<string> {
    const state = crypto.randomUUID();

    // Store state in Supabase for verification (expires in 10 minutes)
    const supabase = await createClient();
    await supabase.from('integration_states').insert({
      state,
      user_id: userId,
      integration_id: this.id,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'read,activity:read_all',
      state,
    });

    return `https://www.strava.com/oauth/authorize?${params}`;
  }

  async handleCallback(code: string, state: string): Promise<IntegrationConnection> {
    const supabase = await createClient();

    // Verify state
    const { data: stateData, error: stateError } = await supabase
      .from('integration_states')
      .select('user_id')
      .eq('state', state)
      .eq('integration_id', this.id)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (stateError || !stateData) {
      throw new Error('Invalid or expired state');
    }

    const userId = stateData.user_id;

    // Clean up state
    await supabase.from('integration_states').delete().eq('state', state);

    // Exchange code for tokens
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const data: StravaTokenResponse = await response.json();

    // Store connection in Supabase
    const connection: IntegrationConnection = {
      id: crypto.randomUUID(),
      userId,
      integrationId: this.id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(data.expires_at * 1000),
      metadata: {
        athleteId: data.athlete.id,
        athleteName: `${data.athlete.firstname} ${data.athlete.lastname}`,
      },
      status: 'active',
      lastSync: new Date(),
      createdAt: new Date(),
    };

    const { error: insertError } = await supabase.from('integration_connections').insert({
      id: connection.id,
      user_id: connection.userId,
      integration_id: connection.integrationId,
      access_token: connection.accessToken,
      refresh_token: connection.refreshToken,
      expires_at: connection.expiresAt?.toISOString(),
      metadata: connection.metadata,
      status: connection.status,
      last_sync: connection.lastSync.toISOString(),
      created_at: connection.createdAt.toISOString(),
    });

    if (insertError) {
      throw new Error(`Failed to store connection: ${insertError.message}`);
    }

    return connection;
  }

  async fetchActivities(connection: IntegrationConnection, since: Date): Promise<ActivityData[]> {
    // Check if token expired
    if (connection.expiresAt && connection.expiresAt < new Date()) {
      connection = await this.refreshToken(connection);
    }

    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${Math.floor(since.getTime() / 1000)}`,
      {
        headers: {
          Authorization: `Bearer ${connection.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Strava activities');
    }

    const activities: StravaActivity[] = await response.json();

    return activities.map((activity) => ({
      source: 'strava',
      type: activity.type.toLowerCase(),
      timestamp: new Date(activity.start_date),
      duration: activity.moving_time,
      distance: activity.distance,
      calories: activity.calories,
      metadata: {
        id: activity.id,
        name: activity.name,
        averageSpeed: activity.average_speed,
        maxSpeed: activity.max_speed,
        elevationGain: activity.total_elevation_gain,
      },
    }));
  }

  verifyWebhook(payload: unknown, signature: string): boolean {
    // Verify Strava webhook signature
    const hmac = crypto.createHmac('sha256', this.clientSecret);
    hmac.update(JSON.stringify(payload));
    const computed = hmac.digest('hex');

    return computed === signature;
  }

  protected async refreshToken(connection: IntegrationConnection): Promise<IntegrationConnection> {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: connection.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Strava token');
    }

    const data: StravaTokenResponse = await response.json();

    // Update connection
    connection.accessToken = data.access_token;
    connection.refreshToken = data.refresh_token;
    connection.expiresAt = new Date(data.expires_at * 1000);

    // Update in database
    const supabase = await createClient();
    await supabase
      .from('integration_connections')
      .update({
        access_token: connection.accessToken,
        refresh_token: connection.refreshToken,
        expires_at: connection.expiresAt.toISOString(),
      })
      .eq('id', connection.id);

    return connection;
  }
}

export const stravaIntegration = new StravaIntegration();
