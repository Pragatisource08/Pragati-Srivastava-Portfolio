
const projects = [
  {
    number: "01",
    name: "BharatRitu",
    description:
      "A crowd-sourced weather reporting platform with report validation, credibility scoring, and live weather integration.",
    stack: "Next.js · TypeScript · REST APIs",
    label: "Smart India Hackathon 2026",
    links: [
      {
        text: "View source",
        url: "https://github.com/Pragatisource08/BharatRitu",
      },
    ],
  },
  {
    number: "02",
    name: "Track Your Finances",
    description:
      "A personal finance tracker with expense filtering, CSV export, and interactive spending visualizations.",
    stack: "Python · Flask · SQLite · Chart.js",
    label: "Full-stack project",
    links: [
      {
        text: "View source",
        url: "https://github.com/Pragatisource08/Personal-Finance-Tracker-",
      },
    ],
  },
  {
    number: "03",
    name: "AirQuality",
    description:
      "An interactive 3D globe for exploring real-world air quality data. Selected as a NASA Space Apps Challenge Global Nominee.",
    stack: "JavaScript · CesiumJS",
    label: "NASA Space Apps Challenge",
    links: [
      {
        text: "Live demo",
        url: "https://air-quality-chi.vercel.app/",
      },
    ],
  },
];


export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <a href="#" className="text-lg font-semibold tracking-tight">
            Pragati<span className="text-blue-600">.</span>
          </a>

          <div className="flex items-center gap-5 text-sm text-slate-600">
            <a href="#experience" className="transition hover:text-blue-600">
               Experience
            </a>
            <a href="#projects" className="transition hover:text-blue-600">
              Projects
            </a>
            <a href="#opensource" className="transition hover:text-blue-600">
              Open source
            </a>
            <a href="#education" className="transition hover:text-blue-600">
              Education
            </a>
            <a href="#contact" className="transition hover:text-blue-600">
              Contact
            </a>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-24 sm:pt-32">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
          Computer Science · Backend · Applied AI
        </p>

        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Building useful software, one problem at a time.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          I&apos;m Pragati, a computer science undergraduate interested in
          backend engineering, APIs, and practical AI applications.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Explore my work <span aria-hidden="true">↗</span>
          </a>

          <a
            href="#contact"
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
          >
            Get in touch
          </a>
        </div>

        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <span>Python &amp; REST APIs</span>
          <span>Generative AI</span>
          <span>Open source</span>
        </div>
      </section>

      <section id="projects" className="border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">
            Selected work
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Projects I&apos;ve worked on.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.number}
                className="rounded-xl border border-slate-200 p-6 transition hover:border-blue-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-400">
                    {project.number}
                  </span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {project.label}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {project.name}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {project.description}
                </p>

                <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">
                  {project.stack}
                </p>
                
<          div className="mt-5 flex flex-wrap gap-4">
            {project.links.map((link) => (
              <a
                key={link.text}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                {link.text}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>

              </article>
            ))}
          </div>
        </div>
      </section>
      
      <section id="experience" className="border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">
            Experience
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Where I&apos;ve worked.
          </h2>

          <div className="mt-10 rounded-xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Generative AI and Cloud Computing Intern
                </h3>
                <p className="mt-1 font-medium text-blue-600">
                  CSRBOX
                </p>
              </div>

              <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                June – August 2026
              </span>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              Worked on Cloud 9, an AI assistant, building backend services
              and integrating Google Gemini with a Pinecone vector database.
            </p>

            <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
              <li className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                Designed a Python backend pipeline routing user queries to
                Google Gemini and serving live traffic from AWS EC2.
              </li>

              <li className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                Built a feedback-driven knowledge base that stored helpful
                responses as vector embeddings in Pinecone.
              </li>

              <li className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                Implemented similarity search to reuse responses to repeated
                or similar queries, reducing redundant external API calls.
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Python",
                "Google Gemini",
                "Pinecone",
                "Vector Embeddings",
                "AWS EC2",
                "REST APIs",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section id="opensource" className="border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">
            Open source
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Contributing beyond my own projects.
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            I contributed bug fixes and reliability improvements to
            PocketPaw, collaborating within an existing open-source codebase.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="rounded-xl border border-slate-200 p-6 transition hover:border-blue-300">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">PR #906</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Merged
                </span>
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Reliable port fallback
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Added socket-level port checks and automatic fallback across
                ports 8888–8897 to prevent startup failures when a port is
                already occupied.
              </p>

              <a
                href="https://github.com/pocketpaw/pocketpaw/pull/906"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View pull request <span aria-hidden="true">↗</span>
              </a>
            </article>

            <article className="rounded-xl border border-slate-200 p-6 transition hover:border-blue-300">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">PR #845</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Merged
                </span>
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Dark-mode dropdown fix
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Fixed a select dropdown rendering issue to restore consistent
                dark-mode styling across the application.
              </p>

              <a
                href="https://github.com/pocketpaw/pocketpaw/pull/845"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View pull request <span aria-hidden="true">↗</span>
              </a>
            </article>
          </div>
        </div>
      </section>


      
<section id="education" className="scroll-mt-24 border-t border-slate-200 py-20">
  <div className="mx-auto max-w-6xl px-6">
    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
      Background
    </p>

    <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
      Education & recognition
    </h2>

    <div className="mt-8 grid gap-6 md:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 p-6">
        <p className="text-sm font-medium text-blue-600">2024 — 2028</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-950">
          B.Tech in Computer Science
        </h3>
        <p className="mt-2 leading-7 text-slate-600">
          Dr. A.P.J. Abdul Kalam Technical University
        </p>
        <p className="mt-4 text-sm text-slate-500">
          CGPA: 7.3 / 10
        </p>
      </article>

      <article className="rounded-2xl border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-950">
          Selected achievements
        </h3>

        <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
          <li>
            <span className="font-medium text-slate-900">
              NASA Space Apps Challenge
            </span>
            <br />
            Global Nominee, 2025.
          </li>
          <li>
            <span className="font-medium text-slate-900">
              Smart India Hackathon
            </span>
            <br />
            Team Lead, 2026.
          </li>
          <li>
            <span className="font-medium text-slate-900">
              LeetCode
            </span>
            <br />
            Solving problems consistently to strengthen DSA fundamentals.
          </li>
        </ul>
      </article>
    </div>
  </div>
</section>


      <footer id="contact" className="border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">
            Contact
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Let&apos;s build something useful.
          </h2>

          <p className="mt-4 text-slate-600">
            Interested in software engineering, backend systems, and applied AI.
          </p>

          <a
            href="mailto:pragatisrivastava9a@gmail.com"
            className="mt-6 inline-block font-medium text-blue-600 hover:text-blue-800"
          >
            pragatisrivastava9a@gmail.com ↗
          </a>

          <div className="mt-12 border-t border-slate-200 pt-5 text-sm text-slate-400">
            © 2026 Pragati Srivastava
          </div>
        </div>
      </footer>
    </main>
  );
}
