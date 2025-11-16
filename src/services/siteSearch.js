// src/services/siteSearch.js

/**
 * Lightweight local search index for site content (Résumé).
 * Extend by adding items to RESUME_INDEX.
 */
const RESUME_INDEX = [
  {
    id: 'exp-xit',
    type: 'resume',
    title: 'Xcellerate IT — Enterprise Workflow Specialist',
    url: '/resume#experience',
    excerpt:
      'Lead enterprise transformation across finance and supply chain; design orchestration layers above ERP/ECM; OCR, RPA, API integration (SAP, TechnologyOne, Oracle).',
    tags: ['Xcellerate IT', 'workflow', 'orchestration', 'SAP', 'TechnologyOne', 'Oracle', 'OCR', 'RPA', 'Sydney', 'Ipaas', 'React', 'Flask', 'Django'],
  },
  {
    id: 'exp-citrix',
    type: 'resume',
    title: 'Citrix — Training Services / Implementation Manager',
    url: '/resume#experience',
    excerpt:
      'Owned ANZ Education P&L, $6M+ revenue; routes-to-market; packaged Education + light PS (health checks, quick config).',
    tags: ['Citrix', 'Education', 'Professional Services', 'ANZ', 'P&L'],
  },
  {
    id: 'exp-dna',
    type: 'resume',
    title: 'DNA Connect — Business Development Manager',
    url: '/resume#experience',
    excerpt:
      'Launched enterprise SaaS across APAC; security & document management; partner channel growth.',
    tags: ['DNA Connect', 'SaaS', 'security', 'APAC'],
  },
  {
    id: 'summary',
    type: 'resume',
    title: 'Executive Summary',
    url: '/resume#summary',
    excerpt:
      'I help large enterprises regain control via orchestration layers above ERP/ECM, focusing on governance, auditability, and agility.',
    tags: ['orchestration', 'governance', 'ERP', 'ECM'],
  },
  {
    id: 'skills',
    type: 'resume',
    title: 'Skills & Capabilities',
    url: '/resume#skills',
    excerpt:
      'Workflow design, decision governance, control-layer architecture, C-suite engagement, business case development.',
    tags: ['skills', 'governance', 'workflow', 'architecture'],
  },
  {
    id: 'edu',
    type: 'resume',
    title: 'Education & Certifications',
    url: '/resume#education',
    excerpt:
      'Grad Dip (IT, Computer Science) — QUT; BCom (Finance & Marketing) — Swinburne; AP Essentials Executive; CDMS (DMI).',
    tags: ['QUT', 'Swinburne', 'AP Essentials', 'Digital Marketing Institute'],
  },
];

/** Basic scorer: counts term hits in title/excerpt/tags */
function score(item, terms) {
  const hay = (item.title + ' ' + item.excerpt + ' ' + item.tags.join(' '))
    .toLowerCase();
  let s = 0;
  for (const t of terms) if (hay.includes(t)) s += 1;
  return s;
}

/** Search local résumé index */
export function searchLocal(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  return RESUME_INDEX
    .map((item) => ({ item, s: score(item, terms) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .map(({ item }) => item);
}
