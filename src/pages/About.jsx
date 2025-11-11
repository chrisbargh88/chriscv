import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  useEffect(() => {
    document.title = 'Chris Bargh';
  }, []);

  return (
    <main className="container py-5">
      <header className="mb-4 text-center">
        <h1 className="h3 mb-2">About Chris</h1>
        <p className="text-muted mb-0">
          Enterprise workflow specialist • Automation strategist • Aviation enthusiast ✈️
        </p>
      </header>

      <div className="row g-4 align-items-center">
        {/* Left column — short bio */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="mb-3">
                I design enterprise control layers that orchestrate how data, decisions, and systems work together.
              </p>
              <p className="mb-3">
                With over a decade in enterprise automation, I’ve partnered with leading vendors and organisations
                to deliver measurable outcomes faster cycle times, stronger governance, and scalable process visibility.
              </p>
            </div>
          </div>
        </div>

        {/* Right column — personal image or logo */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm h-100 text-center">
            <div className="card-body d-flex flex-column justify-content-center">
              <div
                className="ratio ratio-1x1 rounded-circle overflow-hidden mx-auto mb-3"
                style={{
                  maxWidth: '180px',
                  background: "url('/hero-bg.jpg') center/cover no-repeat",
                }}
              ></div>
              <p className="small text-muted mb-0">
                “Precision. Orchestration. Control.” — my approach to both automation and aviation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center mt-5">
        <p className="mb-3 text-muted">
          Interested in enterprise automation, digital governance, or modern orchestration design?
        </p>
        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <Link to="/resume" className="btn btn-primary px-4">
            View Résumé
          </Link>
          <Link to="/portfolio" className="btn btn-outline-primary px-4">
            Portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
