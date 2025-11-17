// Base integration interface

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'fitness' | 'health' | 'productivity' | 'learning';
  scopes: string[];
  authUrl: string;
  webhookUrl?: string;
}

export interface IntegrationConnection {
  id: string;
  userId: string;
  integrationId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  metadata: Record<string, unknown>;
  status: 'active' | 'expired' | 'error';
  lastSync: Date;
  createdAt: Date;
}

export interface ActivityData {
  source: string;
  type: string;
  timestamp: Date;
  duration?: number;
  distance?: number;
  calories?: number;
  metadata: Record<string, unknown>;
}

export abstract class BaseIntegration {
  abstract id: string;
  abstract name: string;

  abstract authorize(userId: string): Promise<string>;
  abstract handleCallback(code: string, state: string): Promise<IntegrationConnection>;
  abstract fetchActivities(connection: IntegrationConnection, since: Date): Promise<ActivityData[]>;
  abstract verifyWebhook(payload: unknown, signature: string): boolean;

  protected async refreshToken(connection: IntegrationConnection): Promise<IntegrationConnection> {
    // Override in specific integrations
    return connection;
  }
}
