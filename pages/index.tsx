import Head from 'next/head'
import { Inter } from 'next/font/google'
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

type Movie = {
  id: string;
  rating: number;
  title: string;
  poster: string;
}

type MovieNode = {
  node: Movie;
}

type PopularMovies = {
  edges: MovieNode[];
}

type QueryData = {
  movies: {
    popular: PopularMovies;
  };
}

const client = new ApolloClient({
  uri: 'https://tmdb.apps.quintero.io/',
  cache: new InMemoryCache(),
});

const GET_MOVIES = gql`
    query {
      movies {
        popular {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
            __typename
          }
          edges {
            node {
              id
              rating
              title
              poster(size: W500)
            }
            __typename
          }
        }
      }
    }
  `;

export default function Home() {


  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const Logo = "/assets/logo.png";

  useEffect(() => {
    client.query<QueryData>({ query: GET_MOVIES })
      .then(result => setAllMovies(result.data.movies.popular.edges.map(movie => movie.node)))
      .catch(error => console.log(error))
    console.log('allMovies', allMovies)
  }, []);

  return (
    <ApolloProvider client={client}>
      <Head>
        <title>now playing</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='py-5 px-10 md:px-20 lg:px-30 xl:px-48 font-comfortaa bg-black'>
        <div className='mb-20 w-full border-pink-700 border-2 rounded-lg p-3'>
          <img src={Logo} alt="Logo" className='w-40' /></div>
        <div className='flex flex-row flex-wrap justify-evenly gap-6 border-pink-700 border-2 rounded-lg p-8 bg-black'>
          {allMovies.map(movie => (
            <div key={movie.id} className='items-center h[40vh] w-[20vh] bg-neutral-200
            rounded-xl shadow-sm shadow-neutral-700'>
              <div className='h-[30vh] w-[20vh] flex relative'>
                <img src={movie.poster} alt={movie.title} className='object-fill w-full h-full rounded-t-lg' />
                <div className={`absolute bottom-0 right-0 mr-1 mb-1 w-8 h-8 rounded-full border-gray-600
                border-2 flex items-center justify-center 
                ${movie.rating < 5 ? 'bg-red-500' : movie.rating < 6 ? 'bg-orange-500' : movie.rating < 7 ?
                    'bg-yellow-500' : movie.rating < 8 ? 'bg-teal-500' : 'bg-lime-500'}`}>
                  <p className='text-sm md:text-md'>{movie.rating}</p>
                </div>
              </div>
              <div className='p-1 text-center'><h2 className='text-sm md:text-md lg:text-[16px]'>{movie.title}</h2></div>
            </div>
          ))}
        </div>
      </main>
    </ApolloProvider>
  )
}
