# Response to the Assignment

This project is a **Single Page Application (SPA)** built with **React**, **TypeScript**, **Vite**, and **Redux Toolkit**. It allows users to **list** and **view details** of movies using the **OMDb API**. Below is a summary of the key features and technical choices.

## Warning

Please set your own `VITE_OMDB_API_KEY` in `.env` file

---

## Features

1. **Movie Listing**  
   - Displays movies in a grid with columns: **Name** (Title), **Release Date** (Year), **IMDb ID**.  
   - **Pagination**: Shows 10 results per page, plus a “Prev / Next” approach with a paginated window.

2. **Filtering & Search**  
   - **Default search**: "Pokemon" on initial load.  
   - **Search by Name** with validation (search is required).  
   - **Filter by Year** (4-digit validation).  
   - **Filter by Type** (Movies, TV Series, TV Episodes).  
   - **Debounce** and **Backoff** logic, so we don’t spam the API with rapid changes.

3. **Movie Details Page**  
   - Shows the **poster**, **duration**, **genre**, **director**, **cast**, **IMDb rating**, etc.  
   - Also shows **Name**, **Release Date**, **IMDb ID** as a minimum.

4. **Fallback Image**  
   - If a movie poster is `"N/A"`, we use a **no-image** placeholder.

5. **Error Handling**  
   - Displays a **warning** if the year is invalid or if the search is empty.  
   - Shows **API errors** (e.g. "Movie not found!").

---

## Trade-offs & Libraries

- **Vite + React**: Fast dev server, speedy builds.  
- **TypeScript**: Strong typing and better developer experience.  
- **Redux Toolkit**: Simplified Redux usage with slices, async thunks, etc.  
- **Bootstrap** + **SCSS**: Quick styling and custom scss for more control.  
- **React Router**: For navigation between Home and Detail pages.  
- **Jest + React Testing Library**: For testing both logic and UI.

---

## How to Run the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Environment Variables**:
    - Modify or add a `.env` (or similar) with your **OMDb API key**:
      ```bash
      VITE_OMDB_API_KEY=YOUR_OWN_KEY
      ```
    - If not set, the app will fallback to my default api key but it may expire soon and it's normally 
      not good practise to send api keys to version control but this is done for assignment purposes only.

3. **Development**:
   ```bash
   npm run dev
   ```
    - Opens the Vite dev server (usually on [http://localhost:5173](http://localhost:5173)).

4. **Production Build**:
   ```bash
   npm run build
   ```
    - Creates a `dist/` folder with optimized output.

5. **Preview**:
   ```bash
   npm run preview
   ```
    - Serves the build locally for final checks.

## Testing

We use **Jest** with **ts-jest** for TypeScript-based tests. To run them:

```bash
npm run test
```

- **`omdbApi.test.ts`** covers API calls, mocking `fetch`.
- **`MovieCard.test.tsx`** covers the component rendering, fallback images, etc.

If you see warnings about `.js` mocks or missing config, check `jest.config.ts` for `moduleNameMapper` and `transform` settings.

---

## Screenshots

Below are some screenshots demonstrating the features (click **Raw** on GitHub if they don’t render):

### 1. Home Page (Desktop)
![Home Page](screenshots/home_1.png?raw=true "Home Page")

### 2. Mobile View with Search
![Mobile View Search](screenshots/home_search_mobile.png?raw=true "Mobile View")

### 3. Mobile View with Placeholder Image
![Mobile Placeholder](screenshots/home_search_mobile_placeholder_img.png?raw=true "Mobile Fallback Poster")

### 4. Detail Page
![Detail Page](screenshots/detail_page.png?raw=true "Movie Detail Page")

### Conclusion

This project meets the assignment requirements for listing/searching OMDb data, filtering by year and type, providing pagination, and displaying detailed movie info on a dedicated page. We leverage modern tooling (Vite, React, Redux Toolkit) plus TypeScript for a robust dev experience. If you have any questions, refer to the code or contact us for clarification.
