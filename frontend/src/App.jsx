import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JunctionPage from './pages/JunctionPage';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/junction/:id" element={<JunctionPage />} />
      </Routes>
    </div>
  );
}
