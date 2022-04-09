import { NextApiRequest, NextApiResponse } from 'next';
import { query as q } from 'faunadb';
import { getSession } from 'next-auth/react';
import { fauna } from '../../services/fauna';
import { stripe } from '../../services/stripe';

type User = { // Passa como generic na Query do fauna
  ref: {
    id: string;
  },
  data: {
    stripe_customer_id: string;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse ) => {
  if (req.method === 'POST') { // Se o método for POST
    const session = await getSession({ req }) // Recebe a sessão do usuario atraves dos cookies

    const user = await fauna.query<User>( // Recebe os dados do usuario
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    let customerId = user.data.stripe_customer_id;

    if (!customerId) { // Se nao existir customer do stripe no fauna
      const stripeCustomer = await stripe.customers.create({ // Cria
        email: session.user.email
      })

      await fauna.query( // Atualiza os dados do usuario com o id de customer do stripe
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      )
      customerId = stripeCustomer.id
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: process.env.STRIPE_PRICE_ID, quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: false,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}