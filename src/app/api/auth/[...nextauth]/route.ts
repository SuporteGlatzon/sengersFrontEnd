import NextAuth, { AuthOptions, NextAuthOptions } from 'next-auth';
import { SessionStrategy } from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import LinkedinProvider, {
  LinkedInProfile,
} from 'next-auth/providers/linkedin';
import { JWT } from 'next-auth/jwt';

// First, define a type for the token
interface RefreshToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
  provider?: string;
  idToken?: string;
}

async function refreshAccessToken(token: RefreshToken): Promise<RefreshToken> {
  try {
    console.log(
      'Attempting to refresh token with refresh token:',
      token.refreshToken ? 'present' : 'missing'
    );

    // Check if refreshToken exists
    if (!token.refreshToken) {
      throw new Error('No refresh token available');
    }

    // Build the request URL and parameters
    const params = new URLSearchParams();
    params.append('client_id', String(process.env.GOOGLE_CLIENT_ID));
    params.append('client_secret', String(process.env.GOOGLE_CLIENT_SECRET));
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', token.refreshToken);

    // Log the params for debugging (don't include the full client_secret)
    console.log('Refresh token request params:', {
      client_id: params.get('client_id')?.substring(0, 10) + '...',
      grant_type: params.get('grant_type'),
      refresh_token_present: params.has('refresh_token'),
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error response from Google:', data);
      throw data;
    }

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      // Google may not always return a new refresh token
      refreshToken: data.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: String(process.env.GITHUB_ID),
      clientSecret: String(process.env.GITHUB_SECRET),
    }),
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
    }),
    LinkedinProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
      client: { token_endpoint_auth_method: 'client_secret_post' },
      issuer: 'https://www.linkedin.com',
      profile: (profile: LinkedInProfile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }),
      wellKnown:
        'https://www.linkedin.com/oauth/.well-known/openid-configuration',
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
    }),
    FacebookProvider({
      clientId: String(process.env.FACEBOOK_CLIENT_ID),
      clientSecret: String(process.env.FACEBOOK_CLIENT_SECRET),
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as SessionStrategy, // Type assertion to SessionStrategy
    maxAge: 60 * 60, // 1 hour (match Google token expiration)
  },
  callbacks: {
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      session.tokenType = token.tokenType || 'Bearer';
      session.idToken = token.idToken; // Include ID token if available
      session.provider = token.provider; // Store the provider
      session.error = token.error; // Forward any errors
      session.expires = new Date(
        Date.now() + 60 * 60 * 1000 // 1 hour
      ).toISOString();
      return session;
    },
    async jwt({ token, user, account }: any) {
      // Initial token creation
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : Date.now() + 3600 * 1000,
          provider: account.provider,
          idToken: account.id_token,
        };
      }

      // Check if refresh token exists before trying to use it
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Before attempting refresh, check if we have the necessary refresh token
      if (!token.refreshToken) {
        console.error('No refresh token available for token refresh');
        return {
          ...token,
          error: 'NoRefreshTokenError',
        };
      }

      // Access token has expired, try to refresh it
      return refreshAccessToken(token);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
