import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {
  fetchMovies,
  setSearchQuery,
  setYearFilter,
  setTypeFilter,
  setPage,
} from '../../features/moviesSlice';
import MovieList from '../../features/MovieList';
import './Home.scss';

function Home() {
  const dispatch = useAppDispatch();
  const {
    data: movies,
    searchQuery,
    yearFilter,
    typeFilter,
    page,
    totalResults,
    status,
    error,
  } = useAppSelector((state) => state.movies);

  // Additional local states for validation errors
  const [searchWarning, setSearchWarning] = useState('');
  const [yearWarning, setYearWarning] = useState('');

  // We only want to fetch if searchQuery is non-empty AND year is valid
  useEffect(() => {
    // If initial load (search="Pokemon"), or if user typed valid input:
    if (!searchQuery) {
      // If empty, do NOT call fetchMovies. We'll show a warning
      return;
    }

    // If year is invalid, do not fetch
    if (yearWarning) {
      return;
    }

    dispatch(
      fetchMovies({
        search: searchQuery.trim(),
        year: yearFilter.trim(),
        type: typeFilter,
        page,
      })
    );
  }, [dispatch, searchQuery, yearFilter, typeFilter, page, yearWarning]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearchQuery(value));

    // Validation for required
    if (!value.trim()) {
      setSearchWarning('Search is required.');
    } else {
      setSearchWarning('');
    }
    // reset to page 1
    dispatch(setPage(1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setYearFilter(value));
    dispatch(setPage(1));

    // Basic validation: allow empty or 4-digit year
    if (value && !/^\d{4}$/.test(value)) {
      setYearWarning('Please enter a valid 4-digit year or leave blank.');
    } else {
      setYearWarning('');
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTypeFilter(e.target.value));
    dispatch(setPage(1));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const PAGE_WINDOW = 9;

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / 10);

  // Compute startPage and endPage
  let startPage = Math.max(1, page - Math.floor(PAGE_WINDOW / 2));
  let endPage = startPage + PAGE_WINDOW - 1;

  // Adjust if endPage exceeds totalPages
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
  }

  // Build the array of visible pages
  const visiblePages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return (
    <div className="home-container container mt-4">
      <h1 className="mb-4">Movie Search</h1>

      {/* Filters: Search, Year, Type */}
      <div className="row mb-3">
        {/* Search */}
        <div className="col-md-4 mb-3 mb-md-0">
          <label className="form-label fw-bold">Search by Name</label>
          <input
            type="text"
            className="form-control"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="e.g. Avengers"
          />
          {searchWarning && (
            <div className="text-warning mt-1" style={{fontSize: '0.9rem'}}>
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
            value={yearFilter}
            onChange={handleYearChange}
            placeholder="e.g. 2021"
          />
          {yearWarning && (
            <div className="text-warning mt-1" style={{fontSize: '0.9rem'}}>
              {yearWarning}
            </div>
          )}
        </div>

        {/* Type */}
        <div className="col-md-3">
          <label className="form-label fw-bold">Type</label>
          <select
            className="form-select"
            value={typeFilter}
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

      {/* Movies Grid */}
      <MovieList movies={movies}/>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-4">
          {/* Prev Button */}
          {page > 1 && (
            <button
              className="btn btn-outline-primary mx-1"
              onClick={() => handlePageChange(page - 1)}
            >
              Prev
            </button>
          )}

          {/* Numeric Pages within window */}
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

          {/* Next Button */}
          {page < totalPages && (
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
