\"use client\";

import { useCallback, useEffect, useState } from \"react\";
import { experimentService } from \"@/lib/experiments\"; 

// Placeholder auth hook
function useAuth() {
  // In real app, source from Supabase auth context/session
  const [user, setUser] = useState<{ id: string } | null>(null);
  useEffect(() => {
    // Hydrate mock user id
    setUser({ id: \"demo-user\" });
  }, []);
  return { user };
}

export const useExperiment = (experimentId: string) => {
  const { user } = useAuth();
  const [variant, setVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const v = await experimentService.getVariant(experimentId, user.id);
      setVariant(v);
      setIsLoading(false);
    };
    void load();
  }, [experimentId, user]);

  const trackEvent = useCallback(
    async (_eventName: string, _eventData?: Record<string, any>) => {
      // Wire to backend analytics later
      return;
    },
    []
  );

  return { variant, isLoading, trackEvent };
};

export const useExperimentConfig = <T = any>(experimentId: string, defaultConfig: T): T => {
  const { user } = useAuth();
  const [config, setConfig] = useState<T>(defaultConfig);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const cfg = await experimentService.getConfig<T>(experimentId, user.id, defaultConfig);
      setConfig(cfg);
    };
    void load();
  }, [experimentId, user, defaultConfig]);

  return config;
};


