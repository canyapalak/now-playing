import Head from 'next/head'
import Home from './home';
import Navbar from '@/components/navbar';
import MoviePage from './[id]';

export default function Index() {


  return (
    <div className=''>
      <Head>
        <title>Now Playing</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home />
    </div>
  )
}
