import type { Movie } from './moviesSlice.ts';
import MovieCard from '../components/MovieCard';

interface MovieListProps {
  movies: Movie[];
}

export default function MovieList({ movies }: MovieListProps) {
  return (
    <div className="row">
      {movies.map((movie) => (
        <div key={movie.imdbID} className="col-sm-6 col-md-4 col-lg-3 mb-4">
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}
