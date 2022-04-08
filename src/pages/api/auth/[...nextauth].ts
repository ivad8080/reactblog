import { query as q } from 'faunadb';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github'
import { fauna } from '../../../services/fauna'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: { // n é mais somente scope: 'read:user'
        params: {
          scope: 'read:user',
        }
      }
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  callbacks: {
    async signIn({ user, account, profile}) {
      const { email } = user;

      try {
        await fauna.query(
          q.Create(
            q.Collection('users'),
            { data: { email }}
          )
        )
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
})