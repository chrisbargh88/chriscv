import React, { useEffect } from "react";

export default function Resume() {
  useEffect(() => {
    document.title = "Résumé • CHRISCV";
  }, []);

  return (
    <main className="resume container-xl py-5" itemScope itemType="https://schema.org/Person">
      {/* Masthead */}
      <header className="resume-masthead card border-0 shadow-sm mb-4">
        <div className="card-body d-flex flex-column flex-md-row align-items-md-end gap-3">
          <div className="resume-id">
            <h1 className="h2 mb-1" itemProp="name">Chris Bargh</h1>
            <p className="text-muted mb-2">
              Enterprise Workflow & Orchestration • Sydney, Australia
            </p>
            <ul className="resume-chips list-unstyled d-flex flex-wrap gap-2 mb-0">
              {["Orchestration", "Governance", "ERP Integration", "Automation"].map((c) => (
                <li key={c} className="chip">{c}</li>
              ))}
            </ul>
          </div>
          <div className="ms-md-auto text-md-end small">
            <div><a className="link-primary" href="mailto:christopherbargh@gmail.com" itemProp="email">christopherbargh@gmail.com</a></div>
            <div><a className="link-secondary" href="tel:+61449158539" itemProp="telephone">+61 449 158 539</a></div>
            <div className="d-flex gap-2 justify-content-md-end mt-2">
              <a className="btn btn-outline-primary btn-sm" href="https://www.linkedin.com/in/chris-bargh/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a className="btn btn-outline-dark btn-sm" href="https://github.com/chrisbargh88" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </header>

      <div className="row g-4">
        {/* Sticky quick nav */}
        <aside className="col-12 col-lg-3">
          <nav aria-label="Resume quick navigation" className="resume-quicknav card border-0 shadow-sm">
            <div className="list-group list-group-flush">
              {[
                ["summary","Summary"],
                ["highlights","Highlights"],
                ["experience","Experience"],
                ["projects","Projects"],
                ["skills","Skills"],
                ["education","Education"],
                ["interests","Interests"],
              ].map(([id, label]) => (
                <a key={id} className="list-group-item list-group-item-action" href={`#${id}`}>{label}</a>
              ))}
            </div>
          </nav>
        </aside>

        {/* Content */}
        <section className="col-12 col-lg-9 d-grid gap-4">
          {/* Executive Summary */}
          <section id="summary" className="card border-0 shadow-sm">
            <div className="card-header resume-section-title">Executive Summary</div>
            <div className="card-body">
              <p className="mb-2" itemProp="description">
              I help large enterprises regain control of their operations by orchestrating how data, decisions, and systems work together.. not just by automating tasks.
In a world where most organisations are drowning in siloed platforms, disconnected workflows, and feature-level “AI,” my focus is on building enterprise control layers: automation and workflow strategies that sit above ERP, ECM, and SaaS systems to deliver real visibility, governance, and agility.
With a foundation in commerce and digital strategy, and postgraduate study in computer science and cybersecurity, I bring a commercial-technical perspective that bridges the language of CFOs, CIOs, and transformation leaders. This allows me to design solutions that not only speed up processes but make them more compliant, auditable, modular, and future-proof.
Over the past decade, I’ve partnered with leading vendors and enterprise clients across the ANZ region to deliver outcomes that go beyond automation: embedding decision governance, reducing systemic risk, and enabling organisations to change and scale faster.
              </p>
              <p className="mb-0">
                My passion is helping leaders move beyond fragmented systems and superficial “AI features” towards orchestrated enterprises where business logic is centralised, risk is visible, and change happens at the speed of strategy.
              </p>
            </div>
          </section>

          {/* Highlights */}
          <section id="highlights" className="card border-0 shadow-sm">
            <div className="card-header resume-section-title">Career Highlights</div>
            <ul className="list-group list-group-flush">
              {[
                "Delivered $10M+ in enterprise software revenue across ANZ; led complex workflow & automation programs.",
                "Designed orchestration architectures that centralise policy, automate decision logic, and reduce risk across ERP/ECM/SaaS.",
                "Guided top-5 super funds, universities, and public sector through multi-year automation journeys — up to 45% faster AP cycle time, 50% fewer exceptions.",
                "Integrated OCR, RPA, and AI decisioning with SAP, TechnologyOne, Oracle, and Dynamics for end-to-end posting.",
                "130%+ average sales attainment while shaping enterprise roadmaps with C-suite stakeholders."
              ].map((t, i) => <li key={i} className="list-group-item">{t}</li>)}
            </ul>
          </section>

          {/* Experience — timeline style */}
          <section id="experience" className="card border-0 shadow-sm">
            <div className="card-header resume-section-title">Professional Experience</div>
            <div className="card-body">
              <ol className="resume-timeline list-unstyled mb-0">
                <li className="resume-timeline-item">
                  <div className="resume-tl-header d-flex flex-wrap align-items-baseline gap-2">
                    <h3 className="h6 mb-0">Xcellerate IT</h3>
                    <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis">Enterprise Workflow Specialist</span>
                    <span className="ms-auto text-muted small">Feb 2023 – Present · Sydney</span>
                  </div>
                  <ul className="resume-tl-points">
                    <li>Led enterprise transformation engagements orchestrating workflows above ERP/ECM for compliant, auditable finance processes.</li>
                    <li>Advised CFOs/CIOs on control-layer strategy enabling modular governance and rapid policy change.</li>
                    <li>Designed solutions integrating OCR, RPA, and API orchestration with SAP, TechnologyOne, Oracle.</li>
                    <li>Drove value-led engagement (risk, resilience, agility), achieving &gt;130% quota.</li>
                  </ul>
                </li>

                <li className="resume-timeline-item">
                  <div className="resume-tl-header d-flex flex-wrap align-items-baseline gap-2">
                    <h3 className="h6 mb-0">Citrix</h3>
                    <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis">Training Services / Implementation Manager</span>
                    <span className="ms-auto text-muted small">2019 – 2023 · Sydney</span>
                  </div>
                  <ul className="resume-tl-points">
                    <li>Owned ANZ Education P&L; $6M+ revenue (≈70% new business).</li>
                    <li>Built GTM, email motions, and packaged light-touch PS (health checks, quick configs).</li>
                  </ul>
                </li>

                <li className="resume-timeline-item">
                  <div className="resume-tl-header d-flex flex-wrap align-items-baseline gap-2">
                    <h3 className="h6 mb-0">DNA Connect</h3>
                    <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">Business Development Manager</span>
                    <span className="ms-auto text-muted small">2017 – 2019 · Sydney</span>
                  </div>
                  <ul className="resume-tl-points">
                    <li>Scaled enterprise SaaS across APAC; expanded partner channel and market penetration by 200%.</li>
                  </ul>
                </li>

                <li className="resume-timeline-item">
                  <div className="resume-tl-header d-flex flex-wrap align-items-baseline gap-2">
                    <h3 className="h6 mb-0">Ingeniq</h3>
                    <span className="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">Business Development Executive</span>
                    <span className="ms-auto text-muted small">2016 – 2017 · Sydney</span>
                  </div>
                  <ul className="resume-tl-points">
                    <li>Sold Splunk training solutions to enterprise; exceeded targets via consultative selling.</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="card border-0 shadow-sm">
            <div className="card-header resume-section-title">Notable Projects</div>
            <div className="row g-3 p-3 pt-0">
              {[
                ["Superannuation AP Transformation","Multi-environment AP program integrating OCR, orchestration, and ERP posting logic; 45% faster cycle time; 50% fewer exceptions."],
                ["University Digital Controls","Orchestration layer above ERP to unify finance/procurement/compliance and enable rapid policy deployment."],
                ["Supply Chain Governance","Cross-platform automation integrating supplier risk, compliance checks, and payment logic; improved audit readiness & decision transparency."]
              ].map(([title, detail]) => (
                <div key={title} className="col-12 col-md-6 col-lg-4">
                  <div className="resume-card card h-100 border-0">
                    <div className="card-body">
                      <h3 className="h6 mb-2">{title}</h3>
                      <p className="small mb-0">{detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="card border-0 shadow-sm">
            <div className="card-header resume-section-title">Skills & Capabilities</div>
            <div className="row g-3 p-3 pt-0">
              <div className="col-12 col-lg-4">
                <h3 className="h6 mb-2">Enterprise Orchestration</h3>
                <ul className="resume-list small mb-0">
                  <li>Workflow Design & Re-engineering</li>
                  <li>Decision Governance & Control Layers</li>
                  <li>Target Operating Model & Roadmaps</li>
                </ul>
              </div>
              <div className="col-12 col-lg-4">
                <h3 className="h6 mb-2">Technology & Platforms</h3>
                <p className="small text-muted mb-2">Kofax TotalAgility, Appian, Pega, ServiceNow, SAP, TechnologyOne, Oracle, D365, OCR, RPA, iPaaS</p>
                <div className="resume-chips flex-wrap d-flex gap-2">
                  {["TotalAgility","Appian","Pega","ServiceNow","SAP","TechOne","Oracle","D365","OCR","RPA","iPaaS"].map(s => (
                    <span key={s} className="chip chip-light">{s}</span>
                  ))}
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <h3 className="h6 mb-2">Advisory & Commercial</h3>
                <ul className="resume-list small mb-0">
                  <li>C-Suite Engagement</li>
                  <li>Business Case Development</li>
                  <li>Digital Governance & Risk</li>
                  <li>Partner Ecosystems & Growth</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Education */}
          <section id="education" className="card border-0 shadow-sm">
            <div className="card-header resume-section-title">Education & Certifications</div>
            <div className="row g-3 p-3 pt-0">
              <div className="col-12 col-lg-6">
                <div className="resume-card card h-100 border-0">
                  <div className="card-body">
                    <h3 className="h6 mb-1">Graduate Diploma — Information Technology (Computer Science)</h3>
                    <p className="small text-muted mb-0">Queensland University of Technology</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="resume-card card h-100 border-0">
                  <div className="card-body">
                    <h3 className="h6 mb-1">Bachelor of Commerce (Finance & Marketing)</h3>
                    <p className="small text-muted mb-2">Swinburne University of Technology</p>
                    <h4 className="h6 mb-2">Certifications</h4>
                    <ul className="resume-list small mb-0">
                      <li>AP Essentials Executive — Tungsten Automation</li>
                      <li>Certified Digital Marketing Specialist — DMI</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interests */}
          <section id="interests" className="card border-0 shadow-sm">
            <div className="card-header resume-section-title">Professional Interests</div>
            <div className="card-body">
              <p className="small mb-0">Enterprise workflow orchestration · Digital governance & risk · AI & Agentic Automation · Finance & supply chain transformation</p>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

