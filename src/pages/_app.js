import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from './layout';

export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient())
  const router = useRouter()

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Head>
        <title>HMD Academy</title>
      </Head>
      {(router.pathname == '/signin' || router.pathname == '/signup' ) ?
      <Component {...pageProps} />
      :
      <Layout>
        <Component {...pageProps} />
      </Layout>
      }
    </SessionContextProvider>
  )
}