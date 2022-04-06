import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import { useSession } from 'next-auth/react'

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {

  const { data: session } = useSession();

  const showUserName = session ? session.user.name : 'Visitante';

  return (
    <>
      <Head>
        <title>react.blog | Home</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>🤗 Olá, {showUserName}!</span>
          <h1>Aprenda tudo sobre o <span>React</span></h1>
          <p>
            Apoie nosso blog e receba acesso completo <br />
            <span>por {product.amount}</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <Image
          src="/images/avatar.png"
          alt="Dude coding"
          width={366}
          height={521}
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KjIZaJS7urTWgWWNbgxwKx1')
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price.unit_amount / 100),
  }
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24h
  }
}
