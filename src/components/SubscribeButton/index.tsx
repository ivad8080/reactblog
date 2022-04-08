import styles from './styles.module.scss';
import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return;
    }

    try {
      const response = await api.post('/subscribe') // Pulo do Gato pra acessar a rota interna

      const { sessionId } = response.data;

      const stripe = await getStripeJs() // Se comunica com o stripe através do front end com uma chave de api publica

      await stripe.redirectToCheckout({ sessionId })

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
    Inscreva-se agora
    </button>
  )
}