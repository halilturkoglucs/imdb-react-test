import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchMovies,
} from '../../features/moviesSlice';
import MovieList from '../../features/MovieList';
import './Home.scss';

function Home() {
  const dispatch = useAppDispatch();
  const {
    data: movies,
    status,
    error,
    totalResults
  } = useAppSelector((state) => state.movies);

  // -----------------------------------
  // 1) LOCAL STATES FOR ALL PARAMETERS
  // -----------------------------------
  // Default search "Pokemon" on first render
  const [search, setSearch] = useState('Pokemon');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  // Warnings
  const [searchWarning, setSearchWarning] = useState('');
  const [yearWarning, setYearWarning] = useState('');

  // -----------------------------------
  // 2) DEBOUNCE USEEFFECT
  // -----------------------------------
  useEffect(() => {
    // Basic validation
    if (!search.trim()) {
      setSearchWarning('Search is required.');
    } else {
      setSearchWarning('');
    }

    if (year && !/^\d{4}$/.test(year)) {
      setYearWarning('Please enter a valid 4-digit year or leave blank.');
    } else {
      setYearWarning('');
    }

    // If either warning is present, skip fetch
    // Also skip if search is empty
    const canFetch =
      search.trim() &&
      !searchWarning &&
      !yearWarning;

    const timer = setTimeout(() => {
      if (!canFetch) return;

      // Dispatch the Redux thunk
      dispatch(
        fetchMovies({
          search: search.trim(),
          year: year.trim(),
          type,
          page,
        })
      );
    }, 300); // 300ms debounce

    // Cleanup on unmount or when any dependency changes
    return () => clearTimeout(timer);
  }, [search, year, type, page, searchWarning, yearWarning, dispatch]);

  // -----------------------------------
  // 3) HANDLERS
  // -----------------------------------
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // Whenever you change search, reset to page 1
    setPage(1);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(e.target.value);
    setPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // -----------------------------------
  // 4) PAGINATION LOGIC
  // -----------------------------------
  const PAGE_WINDOW = 9;
  const totalPages = Math.ceil(totalResults / 10);

  let startPage = Math.max(1, page - Math.floor(PAGE_WINDOW / 2));
  let endPage = startPage + PAGE_WINDOW - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
  }

  const visiblePages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  // For convenience in the render
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  // -----------------------------------
  // RENDER
  // -----------------------------------
  return (
    <div className="home-container container mt-4">
      <h1 className="mb-4">Movie Search</h1>

      {/* FILTERS: SEARCH, YEAR, TYPE */}
      <div className="row mb-3">
        {/* Search */}
        <div className="col-md-4 mb-3 mb-md-0">
          <label className="form-label fw-bold">Search by Name</label>
          <input
            type="text"
            className="form-control"
            value={search}
            onChange={handleSearchChange}
            placeholder="e.g. Pokemon"
          />
          {searchWarning && (
            <div className="text-warning mt-1" style={{ fontSize: '0.9rem' }}>
              {searchWarning}
            </div>
          )}
        </div>

        {/* Year */}
        <div className="col-md-3 mb-3 mb-md-0">
          <label className="form-label fw-bold">Year</label>
          <input
            type="text"
            className="form-control"
            value={year}
            onChange={handleYearChange}
            placeholder="e.g. 2021"
          />
          {yearWarning && (
            <div className="text-warning mt-1" style={{ fontSize: '0.9rem' }}>
              {yearWarning}
            </div>
          )}
        </div>

        {/* Type */}
        <div className="col-md-3">
          <label className="form-label fw-bold">Type</label>
          <select
            className="form-select"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="">All</option>
            <option value="movie">Movies</option>
            <option value="series">TV Series</option>
            <option value="episode">TV Episodes</option>
          </select>
        </div>
      </div>

      {/* Loading / Error */}
      {status === 'loading' && <p>Loading...</p>}
      {error && <div className="alert alert-danger">Error: {error}</div>}

      {/* MOVIES GRID */}
      <MovieList movies={movies} />

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-4">
          {/* Prev */}
          {canGoPrev && (
            <button
              className="btn btn-outline-primary mx-1"
              onClick={() => handlePageChange(page - 1)}
            >
              Prev
            </button>
          )}

          {/* Numeric Pages */}
          {visiblePages.map((p) => (
            <button
              key={p}
              className={`btn mx-1 ${
                p === page ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          {canGoNext && (
            <button
              className="btn btn-outline-primary mx-1"
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
