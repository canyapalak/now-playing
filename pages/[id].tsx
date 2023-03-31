import { useRouter } from 'next/router';
import { useQuery, ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import { languageCodes } from "../data/language-codes.js"
import Link from 'next/link.js';


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
        revenue
        budget
        tagline
        originalLanguage
        overview
        poster (size: W500)
        genres {
          name
        }
        rating
        releaseDate
        credits {
        crew {
          job
          value {
            name
          }
        }
        cast {
            character
            value {
              name
              imdbID
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
    revenue: number;
    budget: number;
    tagline: string;
    originalLanguage: string
    genres: {
      name: string;
    }[];
    rating: number;
    releaseDate: string;
    credits: {
      crew: {
        job: string;
        value: {
          name: string;
        }
      }
      cast: {
        character: string;
        value: {
          name: string;
          imdbID: string;
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

  function getLanguageName(languageCode: string) {
    return languageCodes[languageCode] || languageCode;
  }

  return (
    <ApolloProvider client={client}>
      <main className='text-neutral-200'>
        <div className="flex flex-col border-pink-700 border-2 rounded-lg p-8">

          <div className='flex flex-col md:flex-row'>
            <div className='flex-shrink-0 md:w-80 md:h-150 w-60 h-120 sm:mx-auto xs:mx-auto'>
              <img
                src={movieDetails?.poster}
                alt={movieDetails?.title}
                className="rounded-xl shadow-md object-cover flex-grow"
              />
            </div>
            <div className="flex flex-col ml-10">
              <h1 className="text-3xl font-bold my-5 text-amber-200">{movieDetails?.title}</h1>

              <div className='flex flex-row gap-3'>
                {movieDetails?.genres.map((genre) => (
                  <span className='px-2 py-1 bg-neutral-200 rounded-md'><p className='text-black'>{genre.name}</p></span>
                ))}
              </div>
              <div className='mt-3 mb-4 flex flex-row gap-3'>
                <div className={`rounded-full border-gray-600
                  border-2 flex justify-center align-middle w-11 h-11
                  ${movieDetails?.rating < 5 ? 'bg-red-500' : movieDetails?.rating < 6 ? 'bg-orange-500' : movieDetails?.rating < 7 ?
                    'bg-yellow-500' : movieDetails?.rating < 8 ? 'bg-teal-500' : 'bg-lime-500'}`}>
                  <p className='items-center my-auto text-black'>{movieDetails?.rating.toFixed(1)}</p>
                </div>
                <div>
                  <p className="my-2">{new Date(movieDetails?.releaseDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="my-2">{movieDetails?.runtime} min</p>
                </div>
                <div>
                  <p className="my-2">{getLanguageName(movieDetails?.originalLanguage)}</p>
                </div>
              </div>
              <p className="my-2 italic text-stone-400">{movieDetails?.tagline}</p>
              <p className="mt-2 mb-6">{movieDetails?.overview}</p>
              <div className='mb-3'>
                {movieDetails?.credits.crew
                  .filter(crewPerson => crewPerson?.job === "Director")
                  .map(crewPerson =>
                    <div key={crewPerson?.value.name}>
                      <p>Director: {crewPerson?.value.name}</p>
                    </div>
                  )}
                {movieDetails?.credits.crew
                  .filter(crewPerson => crewPerson?.job === "Writer")
                  .map(crewPerson =>
                    <div key={crewPerson?.value.name}>
                      <p>Writer: {crewPerson?.value.name}</p>
                    </div>
                  )}
              </div>
              <p className="my-1">Budget: ${movieDetails?.budget.toLocaleString()}</p>
              <p className="">Revenue: ${movieDetails?.revenue.toLocaleString()}</p>
            </div>
          </div>
          <h2 className="text-xl font-bold mt-4 mb-6 text-center">Cast:</h2>
          <div className="flex flex-row justify-center flex-wrap gap-8">
            {movieDetails?.credits.cast.slice(0, 6).map((castPerson) => (
              <Link href={`https://www.imdb.com/name/${castPerson?.value.imdbID}/`} target="_blank">
                <div key={castPerson?.value.name} className="flex flex-col
                items-center h-[18rem] w-[8rem] bg-neutral-200
              rounded-lg shadow-sm shadow-neutral-700">

                  <div className='h-[15rem]'>
                    <img
                      src={castPerson?.value.profilePicture}
                      alt={castPerson?.value.name}
                      className="w-[14rem] rounded-t-md"
                    />
                    <div className='h-[14-rem] bg-neutral-200 p-2 rounded-b-md break-normal'>
                      <p className="font-cabinbold text-sm font-bold text-black">{castPerson?.value.name}</p>
                      <p className="text-sm mt-2 text-neutral-600 ">{castPerson?.character}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </ApolloProvider >
  )
}
