import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { stripe } from '../../services/stripe';

export default async (req: NextApiRequest, res: NextApiResponse ) => {
  if (req.method === 'POST') { // Se o método for POST
    const session = await getSession({ req }) // Pega a sessão do usuario atraves dos cookies

    const stripeCostumer = await stripe.customers.create({ // Fix: Verificar se customer existe
      email: session.user.email
    })

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCostumer.id,
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