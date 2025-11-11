// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <header id="top" className="hero-banner d-grid align-content-center">
      <div className="container position-relative text-center">
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/resume" className="btn btn-light btn-lg px-4">
            Résumé
          </Link>
          <Link to="/portfolio" className="btn btn-outline-light btn-lg px-4">
            API Portfolio
          </Link>
        </div>
      </div>
    </header>
  );
}
