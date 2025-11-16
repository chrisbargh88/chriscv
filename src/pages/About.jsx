// src/pages/About.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";

import blueMountains from "../images/Blue_Mountains.jpg";
import garigal from "../images/Garigal_National_Park.jpg";
import manlyWharf from "../images/Manly_Wharf.jpg";
import narrabeen from "../images/Narrabeen_Beach.jpg";

const galleryPhotos = [
  {
    id: "blue-mountains",
    title: "Blue Mountains, NSW",
    url: blueMountains,
  },
  {
    id: "garigal",
    title: "Garigal National Park",
    url: garigal,
  },
  {
    id: "manly",
    title: "Manly Wharf at sunset",
    url: manlyWharf,
  },
  {
    id: "narrabeen",
    title: "Narrabeen Beach",
    url: narrabeen,
  },
];

export default function About() {
  useEffect(() => {
    document.title = "Chris Bargh | About";
  }, []);

  return (
    <main className="about-page">
      <div className="container">
        {/* Header */}
        <header className="text-center mb-5">
          <p className="about-kicker text-uppercase mb-1">About</p>
          <h1 className="about-title mb-2">
            Chris Bargh
          </h1>
          <p className="about-subtitle mb-0">
           "We Roll Tonight, To the Guitar Bite!" - AC/DC"
          </p>
        </header>

        <div className="row g-4 align-items-stretch">
          {/* Bio / story */}
          <section className="col-12 col-lg-7">
            <div className="about-card h-100">
              <h2 className="h5 mb-3">Who Am I?</h2>
              <p className="mb-3">
                By day I help large enterprises regain control of their operations by
                orchestrating how data, decisions, and systems work together. That
                means building control layers above ERP and content systems so CFOs,
                CIOs and operations leaders can see, steer, and change processes
                without pulling the whole stack apart.
              </p>
              <p className="mb-0">
               <h2 className="h6 mt-4 mb-2">Outside of Work I Enjoy</h2>
<ul className="about-facts list-unstyled small">
  <li>• Guitar Enthusiast</li>
  <li>• Exotic Chef</li>
  <li>• Virtual Sim Pilot</li>
  <li>• Mountain Bike Riding</li>
  <li>• Basketball</li>
  <li>• Aviation</li>
  <li>• Road Trips</li>
</ul>
              </p>
            </div>
          </section>

          {/* Portrait + quick facts */}
          <aside className="col-12 col-lg-5">
            <div className="about-card-secondary h-100 d-flex flex-column align-items-center text-center">
              <div className="about-portrait mb-3" />
              <p className="small mb-3">
                Christopher Ian Bargh
              </p>
              <ul className="about-facts list-unstyled text-start small mb-3">
                <li>• Based in Sydney, Australia</li>
                <li>• Enterprise workflow / automation specialist</li>
                <li>• Passion for flight related projects</li>
                <li>• Background in commerce + computer science</li>
              </ul>

              <div className="d-flex gap-2 flex-wrap justify-content-center mt-auto">
                <Link to="/resume" className="btn btn-outline-light btn-sm px-3">
                  View Résumé
                </Link>
                <Link to="/portfolio" className="btn btn-primary btn-sm px-3">
                  Explore Portfolio
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Local photo gallery */}
        <section className="about-gallery mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h6 mb-0">Places that reset my brain</h2>
            <span className="about-gallery-hint small">
              Local shots from around Sydney & NSW
            </span>
          </div>

          <div className="row g-3">
            {galleryPhotos.map((photo) => (
              <div key={photo.id} className="col-6 col-md-3">
                <div className="about-gallery-item">
                  <div className="about-gallery-img-wrapper">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="about-gallery-img"
                    />
                  </div>
                  <p className="about-gallery-caption small mb-0 mt-1">
                    {photo.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
