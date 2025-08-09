import { jwtDecode } from 'jwt-decode';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticateUser } from './lib/actions/auth-actions';

const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login'
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(
        credentials?: Partial<Record<'email' | 'password', unknown>>
      ) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          throw new Error('Missing email or password');
        }

        try {
          const userData = await authenticateUser(email, password);

          // Ensure role matches the expected type
          const validRoles = ['admin', 'manager', 'support', 'user'] as const;
          const role = validRoles.includes(userData.role as any)
            ? (userData.role as (typeof validRoles)[number])
            : 'user';

          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role,
            accessToken: userData.token,
            refreshToken: userData.refreshToken || ''
          };
        } catch (error: any) {
          console.error('Authorization error:', error);
          throw new Error(error.message || 'Invalid credentials');
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || '';
        token.name = user.name || '';
        token.email = user.email || '';
        token.role = user.role || '';
        token.accessToken = user.accessToken || '';
        token.refreshToken = user.refreshToken || '';

        if (token.accessToken) {
          try {
            const decoded = jwtDecode<{ exp: number }>(token.accessToken);
            token.accessTokenExpires = decoded.exp * 1000;
          } catch (e) {
            console.error('Token decode error:', e);
            token.accessTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
          }
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id || '';
        session.user.name = token.name || '';
        session.user.email = token.email || '';
        session.user.role = token.role || '';
        session.user.image = token.image || '';
        session.user.accessToken = token.accessToken || '';
        session.user.refreshToken = token.refreshToken || '';
      }
      return session;
    }
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 1 day
  },

  secret: process.env.NEXTAUTH_SECRET
};

export default authConfig;
