import { Link } from 'react-router-dom';
import type { Movie } from '../features/moviesSlice';
import noImage from '../assets/no-image.png';
import './MovieCard.scss'

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="card h-100 movie-card">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : noImage}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).onerror = null;
          (e.currentTarget as HTMLImageElement).src = noImage;
        }}
        className="card-img-top"
        alt={movie.Title}
      />
      <div className="card-body d-flex flex-column">
        {/* Show explicit columns */}
        <h5 className="card-title mb-3">{movie.Title}</h5>
        <p className="card-text">
          <strong>Release Date:</strong> {movie.Year}
        </p>
        <p className="card-text mb-3">
          <strong>IMDb ID:</strong> {movie.imdbID}
        </p>
        <Link to={`/movies/${movie.imdbID}`} className="mt-auto btn btn-primary">
          Details
        </Link>
      </div>
    </div>
  );
}
