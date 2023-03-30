import { useRouter, NextRouter } from 'next/router';
import { useQuery, ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import { ClassificationTypeNames } from 'typescript';

const client = new ApolloClient({
  uri: 'https://tmdb.apps.quintero.io/',
  cache: new InMemoryCache(),
});

const GET_MOVIE = gql`
  query ($id: ID!) {
    movies {
      movie (id: $id) {
        title
        runtime
        originalLanguage
        overview
        poster (size: W500)
        genres {
          name
        }
        rating
        releaseDate
        credits {
          cast {
            value {
              name
              profilePicture (size: W185)
            }
          }
        }
      }
    }
  }
`;

type MovieData = {
  movie: {
    title: string;
    runtime: number;
    overview: string;
    poster: string;
    originalLanguage: string
    genres: {
      name: string;
    }[];
    rating: number;
    releaseDate: string;
    credits: {
      cast: {
        value: {
          name: string;
          profilePicture: string;
        };
      }[];
    };
  };
};

interface MovieId {
  id: string;
}

export default function MoviePage() {


  const router = useRouter();
  const { id } = router.query;
  const [movieDetails, setMovieDetails] = useState<MovieData>();

  const { data, loading, error } = useQuery<MovieData, MovieId>(GET_MOVIE, {
    client: client,
    variables: { id: id as string },
    onCompleted: (data) => setMovieDetails(data.movies.movie),
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log('error :>> ', error);
  console.log('loading', loading)

  console.log('movieDetails', movieDetails)

  return (
    <ApolloProvider client={client}>
      <main className='text-neutral-200'>
        <div className="flex flex-col items-center border-pink-700 border-2 rounded-lg p-8">

          <div className='flex flex-row'>
            <div className='flex-shrink-0 w-80 h-150'>
              <img
                src={movieDetails?.poster}
                alt={movieDetails?.title}
                className="rounded-xl shadow-md object-cover flex-grow"
              />
            </div>
            <div className="flex flex-col ml-10">
              <h1 className="text-4xl font-bold my-5 text-amber-200">{movieDetails?.title}</h1>
              <p className="text-lg font-bold">
                {movieDetails?.genres.map((genre) => genre.name).join(', ')}
              </p>
              <p className="my-2">{movieDetails?.overview}</p>
              <p className="text-lg my-2">Runtime: {movieDetails?.runtime} minutes</p>
              <p className="text-lg my-2">Rating: {movieDetails?.rating}</p>
              <p className="text-lg my-2">Language Code: {movieDetails?.originalLanguage}</p>
              <p className="text-lg my-2">Release Date: {new Date(movieDetails?.releaseDate).toLocaleDateString()}</p>
            </div>
          </div>


          <h2 className="text-2xl font-bold mt-8 mb-4">Cast:</h2>

          <div className="flex flex-wrap">
            {movieDetails?.credits.cast.map(({ value }) => (
              <div key={value.name} className="flex flex-col items-center mr-4 mb-4">
                <img
                  src={value.profilePicture}
                  alt={value.name}
                  className="w-24 h-36  shadow-md"
                />
                <p className="text-lg font-bold mt-2">{value.name}</p>
              </div>
            ))}
          </div>


        </div>
      </main>
    </ApolloProvider>
  )
}
