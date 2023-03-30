import Navbar from '@/components/navbar'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='bg-black py-5 px-10 md:px-20 lg:px-30 xl:px-48 font-cabin'>
        <Navbar />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
