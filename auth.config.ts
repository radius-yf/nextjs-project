import { NextAuthConfig, User } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { login } from './api/api';

const authConfig = {
  providers: [
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const res = await login(email, password);
        return {
          id: '1',
          name: email.slice(0, email.indexOf('@')),
          email: email,
          auth: res.token_type + ' ' + res.access_token
        } satisfies User;
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user && user.auth) {
        token.gql = user.auth;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.auth = token.gql;
      return session;
    }
  },
  pages: {
    signIn: '/login' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
