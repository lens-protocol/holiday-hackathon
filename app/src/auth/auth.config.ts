import { DefaultSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findByAddress, MinimalProfile } from '@/backend/profiles';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '@/utils/session.options';
import { cookies } from 'next/headers';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      address: string;
      chainId: number;
      profile: MinimalProfile;
    } & DefaultSession['user'];
  }
  interface User {
    address: string;
    chainId: number;
    profile: MinimalProfile;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    address: string;
    chainId: number;
    profile: MinimalProfile;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'web3',
      name: 'Web3',
      credentials: {
        address: { label: 'Address', type: 'text' },
      },
      async authorize(credentials) {
        try {
          console.log('authorize credentials:', credentials);
          if (!credentials?.address) {
            throw new Error('No address provided');
          }

          const cookieStore = await cookies();
          const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
          console.log('session:', session);

          const profile = await findByAddress(session.address);
          console.log('profile:', profile);

          if (!profile) return null;
          const minimalProfile = {
            _id: profile._id,
            name: profile.name,
            address: profile.address,
            handle: profile.handle,
            avatar: profile.avatar,
            techScore: profile.stats.techScore,
          } satisfies MinimalProfile;

          console.log('profile:', minimalProfile);
          return {
            id: profile._id || session.address,
            profile: minimalProfile,
            address: session.address,
            chainId: session.chainId || 1,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      if (!token.address) {
        throw new Error('No address found in token');
      }

      session.user = {
        ...session.user,
        id: token.sub || token.address,
        address: token.address,
        chainId: token.chainId,
        profile: token.profile,
      };

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // When signing in
        token.address = user.address;
        token.chainId = user.chainId;
        token.profile = user.profile;
        token.sub = user.id; // Ensure sub is set from user.id
      }

      // Return the token with profile information
      return {
        ...token,
        address: token.address,
        chainId: token.chainId,
        profile: token.profile,
      };
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 * 10,
  },
  debug: true,
};
