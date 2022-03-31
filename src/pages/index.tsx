import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton';

import styles from './home.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>react.blog | Home</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>🤗 Olá, visitante</span>
          <h1>Tudo sobre a biblioteca <span>React</span></h1>
          <p>
            Apoie nosso blog e receba acesso completo <br />
            <span>por R$9,90</span>
          </p>
          <SubscribeButton />
        </section>
        <img src="/images/avatar.png" alt="Dude coding" />
      </main>
    </>
  )
}
