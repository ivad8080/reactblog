import { useSession } from 'next-auth/react';
import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router';
import { useEffect } from 'react';

import styles from './error.module.scss'

export default function Error() {
  const { data: session } = useSession();

  useEffect(() => {
    if(session) {
      Router.push('/')
    }
  }, [session])

  return (
    <>
      <Head>
        <title>react.blog | Error</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>🚨 Hey, Visitante!</span>
          <h1>
            Você precisa ter um <span className={styles.blue}>email público</span> no <span className={styles.yellow}>github</span> para logar!
          </h1>
          <p>
            Acesse github.com, e siga os passos:<br />
            <ul>
              <li>em Settings</li>
              <li>clique em Emails</li>
              <li>adicione em Add email address (pode ser um secundário)</li>
            </ul>
            <ul>
              <li>em Public profile</li>
              <li>selecione o Public email</li>
            </ul>
          </p>
        </section>
        <Image
          src="/images/error.svg"
          alt="Dude coding"
          width={480}
          height={640}
        />
      </main>
    </>
  )
}