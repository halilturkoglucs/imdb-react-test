import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getMovies, getMovieById, OmdbSearchResponse, OmdbDetailResponse } from '../api/omdbApi';

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface MovieDetail extends Movie {
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  imdbRating: string;
}

interface MoviesState {
  data: Movie[];
  totalResults: number;
  currentMovie?: MovieDetail;
  status: 'idle' | 'loading' | 'failed';
  error?: string;
  searchQuery: string;
  yearFilter: string;
  typeFilter: string;
  page: number;
}

const initialState: MoviesState = {
  data: [],
  totalResults: 0,
  status: 'idle',
  searchQuery: 'Pokemon', // only default on initial load
  yearFilter: '',
  typeFilter: '',
  page: 1,
};

const API_KEY = import.meta.env.VITE_OMDB_API_KEY || '52572824';

// Async thunk to fetch multiple movies
export const fetchMovies = createAsyncThunk<
  // Returned data shape
  { Search: Movie[]; totalResults: string },
  // Thunk arguments
  { search: string; year: string; type: string; page: number },
  // Rejected value
  { rejectValue: string }
>(
  'movies/fetchMovies',
  async ({ search, year, type, page }, { rejectWithValue }) => {
    try {
      const data: OmdbSearchResponse = await getMovies(API_KEY, search, year, type, page);
      return {
        Search: data.Search as Movie[],
        totalResults: data.totalResults,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// Async thunk to fetch a single movie by IMDb ID
export const fetchMovieById = createAsyncThunk<
  MovieDetail,
  string,
  { rejectValue: string }
>(
  'movies/fetchMovieById',
  async (imdbID, { rejectWithValue }) => {
    try {
      const data: OmdbDetailResponse = await getMovieById(API_KEY, imdbID);
      return data as MovieDetail;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setYearFilter(state, action: PayloadAction<string>) {
      state.yearFilter = action.payload;
    },
    setTypeFilter(state, action: PayloadAction<string>) {
      state.typeFilter = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMovies
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload.Search;
        state.totalResults = parseInt(action.payload.totalResults, 10);
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchMovieById
      .addCase(fetchMovieById.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
        state.currentMovie = undefined;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.status = 'idle';
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setYearFilter,
  setTypeFilter,
  setPage,
} = moviesSlice.actions;

export default moviesSlice.reducer;
