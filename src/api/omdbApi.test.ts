import { getMovies, getMovieById, OmdbSearchResponse, OmdbError } from './omdbApi';

// Mock the global fetch
global.fetch = jest.fn();

describe('omdbApi tests', () => {
  const mockApiKey = 'TEST_KEY';

  afterEach(() => {
    // Clear all mocks after each test so they don’t interfere
    jest.clearAllMocks();
  });

  test('getMovies: resolves with valid data on success', async () => {
    // 1) Mock a successful fetch response
    const mockResponse: OmdbSearchResponse = {
      Search: [
        { Title: 'Test Movie', Year: '2021', imdbID: 'tt1234567', Type: 'movie', Poster: 'N/A' },
      ],
      totalResults: '1',
      Response: 'True',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // 2) Call the function
    const result = await getMovies(mockApiKey, 'test', '', '', 1);

    // 3) Assert
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('apikey=TEST_KEY') // Check query string
    );
  });

  test('getMovies: throws error if Response is "False"', async () => {
    // 1) Mock an error from OMDb (e.g., "Movie not found!")
    const mockError: OmdbError = {
      Response: 'False',
      Error: 'Movie not found!',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockError,
    });

    // 2) Assert that getMovies throws
    await expect(
      getMovies(mockApiKey, 'nonexistent', '', '', 1)
    ).rejects.toThrow('Movie not found!');
  });

  test('getMovieById: resolves with valid detail data', async () => {
    const mockDetail = {
      Title: 'Test Movie',
      Year: '2021',
      imdbID: 'tt1234567',
      Type: 'movie',
      Poster: 'N/A',
      Runtime: '100 min',
      Genre: 'Action',
      Director: 'John Doe',
      Actors: 'Jane, Bob',
      Plot: 'A test plot',
      imdbRating: '7.5',
      Response: 'True',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDetail,
    });

    const result = await getMovieById(mockApiKey, 'tt1234567');
    expect(result).toEqual(mockDetail);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('i=tt1234567'));
  });

  test('getMovieById: throws error if fetch fails', async () => {
    // For example, network error or something
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(
      getMovieById(mockApiKey, 'tt1234567')
    ).rejects.toThrow('Network error');
  });
});
