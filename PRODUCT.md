# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters screening for software-engineering internships. They scan fast and decide in about ten seconds whether Pragati gets an interview.

Secondary: engineers and hiring managers who dig into projects, merged PRs, and source code to judge real skill. The page must reward that second, deeper read without slowing the first.

## Product Purpose

The personal portfolio of Pragati Srivastava, a B.Tech Computer Science undergraduate (2024–2028) focused on Python backends, REST APIs, and applied AI. Success is a visitor emailing Pragati.

## Positioning

A backend engineer whose work is evidence, not adjectives: a deployed Gemini + Pinecone pipeline serving live traffic, a four-signal credibility-scoring engine, merged open-source fixes, and a NASA Space Apps Global Nominee project. The site itself should feel engineered and playful at once, with small games that end in an invitation to email her.

## Operating Context

Visitors arrive from LinkedIn, a resume link, GitHub, or a job application. Many recruiters view on laptops between other tasks; some view on phones. Engineers follow links out to GitHub repos, PRs, and the live AirQuality demo.

## Capabilities and Constraints

- Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, `motion` for animation.
- Static content; no backend, database, or form handling. Contact is a `mailto:` link.
- Interactive mini-games are wanted by the owner. Each game's call to action is emailing Pragati.
- The portrait asset is 400×400 px, so it cannot render larger than about 200 CSS px without visible softness.

## Brand Commitments

- Name: Pragati Srivastava. Short form in the logo: "Pragati."
- Voice: plain, direct, specific. Claims are backed by named work.
- Primary call to action: email `pragatisrivastava9a@gmail.com`.

## Evidence on Hand

- Portrait: `public/pragati.jpg` (400×400).
- Resume: `public/Pragati-Srivastava-Resume.pdf`. It contains her phone number.
- LinkedIn: https://www.linkedin.com/in/pragati-srivastava-283431321/
- GitHub: https://github.com/Pragatisource08
- Experience: CSRBOX, Generative AI and Cloud Computing Intern, June–August 2026, remote. Cloud 9 AI assistant; Python pipeline to Google Gemini on AWS EC2; Pinecone knowledge base storing responses only when marked helpful; embedding similarity search to serve repeat queries without a new API call.
- Open source: pocketpaw/pocketpaw, April 2026. PR #906 (merged): port fallback across 8888–8897 with socket pre-checks, catching EADDRINUSE / WinError 10048. PR #845 (merged): dark-mode select dropdown fix.
- Projects: BharatRitu (Smart India Hackathon 2026; Next.js Route Handlers GET/POST/PATCH; four-signal credibility engine marking reports Verified / Under Review / Flagged; Open-Meteo with 5-second timeout and fail-soft fallback). Track Your Finances (Flask blueprints, SQLAlchemy, SQLite, CSV export, Chart.js). AirQuality (CesiumJS 3D globe of real AQI data; NASA Space Apps Global Nominee out of 11,500+ participants across 167+ countries; live demo).
- Recognition: Smart India Hackathon 2026 Team Lead; NASA Space Apps Challenge 2025 Global Nominee; 30+ LeetCode problems solved.
- Education: Dr. A.P.J. Abdul Kalam Technical University, B.Tech CSE, 2024–2028, CGPA 7.3/10.
- Skills: Python, C++, TypeScript, JavaScript; Flask, Next.js, REST APIs, SQLAlchemy, Jinja2, Chart.js, CesiumJS; SQLite, MySQL, Pinecone; Google Gemini API, vector embeddings, similarity search; Git, GitHub, AWS EC2.
- Absent, do not fabricate: testimonials, employer quotes, traffic or latency numbers, star counts, user counts.

## Product Principles

1. Recruiter first, engineer second: the first viewport states who she is, what she builds, and how to reach her.
2. Every claim links to evidence: a repo, a PR, a demo, or the resume.
3. Play is a path to contact: each game ends at the email action, never at a dead end.
4. Never fabricate metrics, quotes, or results.

## Accessibility & Inclusion

Games must be playable by keyboard and must not block reading the content. Motion respects `prefers-reduced-motion`. Text meets WCAG AA contrast.
