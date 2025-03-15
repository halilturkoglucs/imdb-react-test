import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMovieById } from '../../features/moviesSlice';
import './MovieDetail.scss';
import noImage from '../../assets/no-image.png';

function MovieDetail() {
  const { imdbID } = useParams();
  const dispatch = useAppDispatch();
  const { currentMovie, status, error } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (imdbID) {
      dispatch(fetchMovieById(imdbID));
    }
  }, [dispatch, imdbID]);

  // Loading State
  if (status === 'loading') {
    return <div className="container mt-5">Loading...</div>;
  }

  // Error State
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Error: {error}</div>
        <Link to="/" className="btn btn-secondary">Go Back</Link>
      </div>
    );
  }

  // Render Movie Details
  return (
    <div className="container mt-4 movie-detail">
      {currentMovie && (
        <div className="row">
          {/* Poster */}
          <div className="col-md-4 mb-3">
            <img
              src={currentMovie.Poster !== 'N/A' ? currentMovie.Poster : noImage}
              alt={currentMovie.Title}
              className="img-fluid rounded"
            />
          </div>
          {/* Info */}
          <div className="col-md-8">
            <h2 className="mb-3">{currentMovie.Title}</h2>
            <ul className="list-group mb-4">
              <li className="list-group-item">
                {currentMovie.Title}
              </li>
              <li className="list-group-item">
                <strong>Release Date:</strong> {currentMovie.Year}
              </li>
              <li className="list-group-item">
                <strong>IMDb ID:</strong> {currentMovie.imdbID}
              </li>
              <li className="list-group-item">
                <strong>Genre:</strong> {currentMovie.Genre}
              </li>
              <li className="list-group-item">
                <strong>Duration:</strong> {currentMovie.Runtime}
              </li>
              <li className="list-group-item">
                <strong>Director:</strong> {currentMovie.Director}
              </li>
              <li className="list-group-item">
                <strong>Cast:</strong> {currentMovie.Actors}
              </li>
              <li className="list-group-item">
                <strong>IMDB Rating:</strong> {currentMovie.imdbRating}
              </li>
            </ul>
            <div className="mb-4">
              <h5>Plot</h5>
              <p>{currentMovie.Plot}</p>
            </div>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
