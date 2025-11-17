'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineIndicator } from '@/components/OfflineIndicator';

export const ClientWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <OfflineIndicator />
      {children}
    </ErrorBoundary>
  );
};
