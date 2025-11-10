import React from 'react';

export default function Contact() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="h3 mb-4 text-center">Contact Chris</h1>
          <p className="text-muted text-center mb-4">
            Have a project, collaboration idea, or automation question? 
            Reach out using the form below or send me an email directly.
          </p>

          {/* Contact form (placeholder only) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Contact form not yet connected — please email directly.');
            }}
            className="card border-0 shadow-sm p-4"
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" id="name" className="form-control" placeholder="Your name" required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" className="form-control" placeholder="you@example.com" required />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea id="message" rows="5" className="form-control" placeholder="Write your message..." required />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg">
                Send Message
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="small text-muted mb-1">Prefer email?</p>
            <a
              href="mailto:christopherbargh@gmail.com"
              className="link-primary text-decoration-none fw-semibold"
            >
              christopherbargh@gmail.com
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
