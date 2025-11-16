// src/pages/Contact.jsx
import React, { useState } from "react";
import homerImg from "../images/homer_simpson.png";

export default function Contact() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    const form = e.target;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xyzldpoz", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: data
      });

      if (res.ok) {
        setStatus("Thanks! Your message has been sent. 🍩");
        form.reset();
      } else {
        setStatus("Oops! Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("Network error — please try again.");
    }
  };

  return (
    <main className="contact-fullpage">
      <div className="contact-inner">
        <div className="contact-grid">

          {/* Homer Image */}
          <div className="contact-left">
            <img
              src={homerImg}
              alt="Homer Simpson"
              className="contact-homer"
            />
          </div>

          {/* Contact Form */}
          <div className="contact-right">
            <div className="contact-card card p-4 border-0 shadow-sm">
              <h1 className="contact-title text-center mb-3">
                Get in Touch, D’oh!
              </h1>

              <p className="contact-subtitle text-center mb-4">
                Have a project, question, idea? Drop me a note below!
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control contact-input"
                    placeholder="Homer J. Simpson"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control contact-input"
                    placeholder="donuts@springfield.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control contact-input"
                    rows="5"
                    placeholder="Mmm... donuts and automation!"
                    required
                  />
                </div>

                <button type="submit" className="btn contact-btn w-100">
                  Send Message 🍩
                </button>
              </form>

              {status && (
                <p className="contact-status text-center mt-3">{status}</p>
              )}

              <div className="text-center mt-4">
                <p className="small">Prefer email?</p>
                <a href="mailto:christopherbargh@gmail.com" className="contact-email">
                  christopherbargh@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
