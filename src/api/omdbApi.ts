import {Movie} from "../features/moviesSlice.ts";

export interface OmdbSearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface OmdbDetailResponse {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  imdbRating: string;
  [key: string]: unknown;
}

// Instead of returning "any", define an Error shape if needed
export interface OmdbError {
  Response: 'False';
  Error: string;
}

const BASE_URL = 'https://www.omdbapi.com/';

export async function getMovies(
  apiKey: string,
  search: string,
  year: string,
  type: string,
  page: number
): Promise<OmdbSearchResponse> {
  const url = new URL(BASE_URL);
  url.searchParams.set('apikey', apiKey);
  url.searchParams.set('s', search);
  if (year) url.searchParams.set('y', year);
  if (type) url.searchParams.set('type', type);
  url.searchParams.set('page', page.toString());

  const response = await fetch(url.toString());
  const data = (await response.json()) as OmdbSearchResponse | OmdbError;

  if (data.Response === 'False') {
    throw new Error(data.Error);
  }
  return data as OmdbSearchResponse;
}

export async function getMovieById(
  apiKey: string,
  imdbID: string
): Promise<OmdbDetailResponse> {
  const url = new URL(BASE_URL);
  url.searchParams.set('apikey', apiKey);
  url.searchParams.set('i', imdbID);
  url.searchParams.set('plot', 'full');

  const response = await fetch(url.toString());
  const data = (await response.json()) as OmdbDetailResponse | OmdbError;

  if ((data as OmdbError).Response === 'False') {
    throw new Error((data as OmdbError).Error);
  }
  return data as OmdbDetailResponse;
}
