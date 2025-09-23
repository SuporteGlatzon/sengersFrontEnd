'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

export function SessionManager() {
  const { data: session } = useSession();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API ||
    'https://admin.conexoesengenharia.com.br/api/';

  useEffect(() => {
    // Function to refresh session - use your Laravel endpoint
    const refreshSession = async () => {
      try {
        // Instead of using /api/auth/session which doesn't exist,
        // call your Laravel refresh token endpoint
        const response = await fetch(`${apiBaseUrl}auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(session as any)?.accessToken || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to refresh session: ${response.status}`);
        }

        const data = await response.json();
        console.log(
          'Session refreshed successfully:',
          new Date().toISOString()
        );
        return data;
      } catch (error) {
        console.error('Error refreshing session:', error);
      }
    };

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // If session exists, set up a periodic refresh
    if (session) {
      console.log(
        'Setting up session refresh timer with session:',
        session ? 'exists' : 'missing'
      );
      // Check every 10 minutes (600000 ms)
      timerRef.current = setInterval(refreshSession, 600000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session, apiBaseUrl]);

  return null;
}
