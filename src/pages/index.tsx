import Head from 'next/head'
import styles from '../styles/home.module.scss'

export default function Home() {
  return (
    <>
      <Head>
        <title>react.blog | Home</title>
      </Head>
      <h1 className={styles.title}>
        Hello <span>Word</span>
      </h1>
    </>
  )
}
