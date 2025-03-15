import { render, screen } from '@testing-library/react';
import MovieCard from './MovieCard';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import type { Movie } from '../features/moviesSlice';

describe('MovieCard Component', () => {
  const mockMovie: Movie = {
    Title: 'Test Movie',
    Year: '2021',
    imdbID: 'tt1234567',
    Type: 'movie',
    Poster: 'N/A',
  };

  test('renders movie title, release date, and IMDb ID', () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText(/release date/i)).toBeInTheDocument();
    expect(screen.getByText(/2021/)).toBeInTheDocument();
    expect(screen.getByText(/IMDb ID:/i)).toBeInTheDocument();
    expect(screen.getByText(/tt1234567/)).toBeInTheDocument();
  });

  test('renders fallback image if Poster is "N/A"', () => {
    render(
      <BrowserRouter>
        <MovieCard movie={mockMovie} />
      </BrowserRouter>
    );

    // This is a bit trickier to test fully, but we can check the src
    const img = screen.getByAltText('Test Movie') as HTMLImageElement;
    expect(img.src).toBe('http://localhost/test-file-stub');
  });
});
