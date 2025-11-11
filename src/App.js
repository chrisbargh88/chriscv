// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Resume from './pages/Resume';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import Search from './pages/Search';
import Contact from './pages/Contact';

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container-fluid p-0">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/resume" element={<Resume />} />

          {/* Portfolio + detail */}
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:name" element={<ProjectDetail />} />

          {/* Search (navbar route) */}
          <Route path="/search" element={<Search />} />

          {/* Contact (to be built) */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
