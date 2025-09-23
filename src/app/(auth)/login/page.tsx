'use client';
import { api } from '@/app/api/api';
import { IconGoogle } from '@/components/icons/google';
import { IconLinkedin } from '@/components/icons/linkedin';
import SocialButton from '@/components/social-button';
import { Session } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCookie } from 'nookies';
import { useEffect } from 'react';

interface CustomSession extends Session {
  accessToken?: string;
}

const SignInPage = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const isLoadingOrWaitingRedirect =
    status === 'authenticated' || status === 'loading';

  useEffect(() => {
    if (status === 'authenticated') {
      // Check for session errors
      if (
        (session as any)?.error === 'NoRefreshTokenError' ||
        (session as any)?.error === 'RefreshAccessTokenError'
      ) {
        console.log(
          'Session error detected, signing out:',
          (session as any)?.error
        );
        // Force re-login with Google to get a new refresh token
        signOut({
          callbackUrl: `/login?callbackUrl=${encodeURIComponent(
            callbackUrl
          )}&force=true`,
        });
        return;
      }

      // Continue with normal authentication
      const provider = localStorage.getItem('authProvider');
      if (provider) {
        verifySessionAndGetToken(provider);
      }
    }
  }, [session, status]);

  async function handleLogin(provider: string) {
    console.log('Starting login for:', provider);
    localStorage.setItem('authProvider', provider);

    try {
      const result = await signIn(provider, { redirect: false });
      console.log('SignIn result:', result);

      if (result?.error) {
        console.error('Login error:', result.error);
        alert('Erro ao fazer login');
        return;
      }

      if (result?.ok) {
        console.log('Login successful, waiting for session');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Erro ao fazer login');
    }
  }

  async function verifySessionAndGetToken(provider: string) {
    try {
      const accessToken = (session as CustomSession)?.accessToken;
      const idToken = (session as any)?.idToken; // Try to get ID token too

      if (!accessToken) {
        console.error('No access token found in session');
        handleSignOut('Access token not available');
        return;
      }

      console.log('Auth provider:', provider);
      console.log('Token type:', typeof accessToken);
      console.log('Token length:', accessToken.length);

      // Try using ID token for Google if available (often more reliable)
      const tokenToUse =
        provider === 'google' && idToken ? idToken : accessToken;

      const response = await api.post(
        'auth/oauth/token',
        {
          provider: provider === 'linkedin' ? 'linkedin-openid' : provider,
          access_token: tokenToUse,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      console.log('Token response:', response.data);

      if (!response.data || !response.data.access_token) {
        console.error('Invalid token response:', response.data);
        handleSignOut('Invalid authentication response.');
        return;
      }

      setCookie(undefined, 'accessToken', response.data.access_token, {
        maxAge: 24 * 60 * 60,
        path: '/',
      });

      // Set axios default headers
      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.data.access_token}`;

      // Also log the token being used
      console.log(
        'Token set in defaults:',
        response.data.access_token.substring(0, 15) + '...'
      );

      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${response.data.access_token}`;

      setProfileCookies(response.data.user);

      router.push('/');
    } catch (error: any) {
      console.error('Token exchange error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      handleSignOut('Authentication failed');
    }
  }

  function setProfileCookies(user: { image: string; email: string }) {
    if (!user) {
      console.error('No user data available for storing session');
      return;
    }

    try {
      const userData = JSON.stringify({
        image: user.image,
        email: user.email,
      });

      setCookie(undefined, 'user', userData, { maxAge: 24 * 60 * 60 });
      console.log('User data stored successfully:', userData);
    } catch (error) {
      console.error('Error storing user session data:', error);
    }
  }

  function handleSignOut(message: string) {
    console.log('Signing out and clearing session/localStorage');
    localStorage.removeItem('authProvider');
    localStorage.removeItem('callbackUrl');

    signOut({
      callbackUrl: `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    });

    alert(message);
  }

  return (
    <div>
      <span className='text-lg'>Bem vindo</span>
      <h1 className='text-stone-700 text-2xl font-bold'>Acesse a sua conta</h1>
      {isLoadingOrWaitingRedirect ? (
        <div className='h-[180px] flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-transparent border-2 border-secondary'></div>
        </div>
      ) : (
        <div className='flex flex-col my-4'>
          <SocialButton
            icon={<IconGoogle />}
            provider='google'
            callback={handleLogin}
          >
            Entrar com Google
          </SocialButton>
          <SocialButton
            icon={<IconLinkedin />}
            provider='linkedin'
            callback={handleLogin}
          >
            Entrar com Linkedin
          </SocialButton>
        </div>
      )}
      <div className='justify-center items-center flex text-base'>
        <div className='text-stone-700 pr-1 text-center'>
          Ao se cadastrar, você declara concordar com nossos{' '}
          <a
            href='/termos-de-uso'
            target='_blank'
            className='underline hover:text-secondary'
          >
            termos de uso
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
