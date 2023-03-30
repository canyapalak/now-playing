import Head from 'next/head'
import { Inter } from 'next/font/google'
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MoviePage from './[id]';

const inter = Inter({ subsets: ['latin'] })

type Movie = {
  id: string;
  rating: number;
  title: string;
  poster: string;
};

type PageInfo = {
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
};

type MovieNode = {
  node: Movie;
};

type PopularMovies = {
  totalCount: number;
  pageInfo: PageInfo;
  edges: MovieNode[];
};

type QueryData = {
  movies: {
    popular: PopularMovies;
  };
};

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

export default function Landing() {


  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [pageInfo, setPageInfo] = useState({
  endCursor: null,
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
  });
  
useEffect(() => {
  client.query<QueryData>({ query: GET_MOVIES })
    .then(result => {
      setAllMovies(result.data.movies.popular.edges);
      setPageInfo(result.data.movies.popular.pageInfo);
    })
    .catch(error => console.log(error))
  console.log('allMovies', allMovies)
  console.log('pageInfo :>> ', pageInfo);
}, []);
  

  return (
    <ApolloProvider client={client}>
      <main >
        <div className='flex flex-row flex-wrap justify-evenly gap-6 border-pink-700 border-2 rounded-lg p-8'>
          {allMovies?.map(movie => (
            <Link href={`/${movie.node.id}`} key={movie.node.id}>
            <div className='items-center h[40vh] w-[20vh] bg-neutral-200
            rounded-xl shadow-sm shadow-neutral-700'>
              <div className='h-[30vh] w-[20vh] flex relative'>
                <img src={movie.node.poster} alt={movie.node.title} className='object-fill w-full h-full rounded-t-lg' />
                <div className={`absolute bottom-0 right-0 mr-1 mb-1 w-8 h-8 rounded-full border-gray-600
                border-2 flex items-center justify-center 
                ${movie.node.rating < 5 ? 'bg-red-500' : movie.node.rating < 6 ? 'bg-orange-500' : movie.node.rating < 7 ?
                    'bg-yellow-500' : movie.node.rating < 8 ? 'bg-teal-500' : 'bg-lime-500'}`}>
                  <p className='text-sm md:text-md'>{movie.node.rating}</p>
                </div>
              </div>
              <div className='p-1 text-center h-12'><h2 >{movie.node.title}</h2></div>
              </div>
              </Link>
          ))}
        </div>
      </main>
      <MoviePage />
    </ApolloProvider>
  )
}
