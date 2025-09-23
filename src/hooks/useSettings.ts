'use client';

import { api } from '@/app/api/api';
import { SettingsProps } from '@/app/type/settings.type';
import { useEffect, useRef, useState } from 'react';

const CACHE_KEY = 'settings';
const CACHE_DURATION = 60 * 1000; // 1 minute

export function useSettings() {
  const [settings, setSettings] = useState<SettingsProps[]>([]);
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (isFetching.current) return;

      const cachedSettings = localStorage.getItem(CACHE_KEY);
      const lastFetchTime = localStorage.getItem(`${CACHE_KEY}_time`);
      const now = Date.now();

      if (
        cachedSettings &&
        lastFetchTime &&
        now - Number(lastFetchTime) < CACHE_DURATION
      ) {
        setSettings(JSON.parse(cachedSettings));
        return;
      }

      try {
        isFetching.current = true;
        const res = await api.get('settings');
        localStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
        localStorage.setItem(`${CACHE_KEY}_time`, now.toString());
        setSettings(res.data?.data ?? res.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        isFetching.current = false;
      }
    };

    fetchSettings();
  }, []);

  return settings;
}
