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
  pages: {
    error: '/error'
  },
  callbacks: {
    async signIn({ user, account, profile}) {
      const { email } = user;

      try {
        await fauna.query(
          q.If( // Se
            q.Not( // não
              q.Exists( // existir
                q.Match( // o termo buscado no indice especificado
                  q.Index('user_by_email'),
                  q.Casefold(user.email) // Normaliza
                )
              )
            ), // Se não existir
            q.Create( // Cria
              q.Collection('users'), // na collection 'users'
              { data: { email } } // o email do github logado
            ), // Senão
            q.Get( // Pegue
              q.Match( // o termo buscado no indice especificado
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true;
      } catch (error) {
        // console.log(error);
        return false;
      }
    }
  }
})