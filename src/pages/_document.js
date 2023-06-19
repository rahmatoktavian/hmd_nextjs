import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>HMD Academy</title>
        <meta property="og:title" content="HMD Academy" key="title" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
