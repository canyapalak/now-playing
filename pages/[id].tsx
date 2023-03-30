import { useRouter, NextRouter } from 'next/router';
import { useQuery, ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';

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

    const movie = movieDetails;
    console.log('movieDetails', movieDetails)

    const encodedId = btoa(id as string);

    return (
        <ApolloProvider client={client}>
         <main className='py-5 px-10 md:px-20 lg:px-30 xl:px-48 font-comfortaa bg-black'>
            <Navbar />
            <div className="flex flex-col items-center border-pink-700 border-2 rounded-lg">
                <h1 className="text-4xl font-bold my-8">{movieDetails?.title}</h1>
                <div className="flex flex-col md:flex-row justify-center items-center">
                    <img
                        src={movieDetails?.poster}
                        alt={movieDetails?.title}
                        className="w-1/2 md:w-1/3 rounded-lg shadow-md"
                    />
                    <div className="md:ml-8 mt-8 md:mt-0">
                        <p className="text-lg font-bold">
                            {movieDetails?.genres.map((genre) => genre.name).join(', ')}
                        </p>
                        <p className="my-2">{movieDetails?.overview}</p>
                        <p className="text-lg my-2">Runtime: {movieDetails?.runtime} minutes</p>
                        <p className="text-lg my-2">Rating: {movieDetails?.rating}</p>
                        <p className="text-lg my-2">Release Date: {movieDetails?.releaseDate}</p>
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
                </div>
                </div>
                </main>
        </ApolloProvider>
    )
}
