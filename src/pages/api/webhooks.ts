import { NextApiRequest, NextApiResponse } from "next"
import { Readable } from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";

async function buffer(readable: Readable) { // Recebe os dados em streaming e vai montando
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    )
  }

  return Buffer.concat(chunks)
}

export const config = { // Temos que desabilitar para dados stream
  api: {
    bodyParser: false
  }
}

const relevantEvents = new Set([
  'checkout.session.completed'
])

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    //console.log('evento recebido')
    const buff = await buffer(req)
    const secret = req.headers['stripe-signature']

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buff, secret, webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      console.log('Evento Recebido', event) // Event recebe todos os dados da transacao
    }

    res.json({ received: true})
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}