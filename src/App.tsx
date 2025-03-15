import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import MovieDetail from './pages/detail/MovieDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:imdbID" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
