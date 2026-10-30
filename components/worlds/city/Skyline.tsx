"use client";

import { projects, type Project } from "@/lib/content";
import { Icon } from "@/components/icons";
import { s } from "./cls";

// West to east. The eastern tower is the facade that turns silver before dawn.
const ORDER: { slug: string; roof: "tank" | "setback" | "mast"; east?: boolean }[] = [
  { slug: "finances", roof: "tank" },
  { slug: "bharatritu", roof: "setback" },
  { slug: "airquality", roof: "mast", east: true },
];

export function Skyline() {
  return (
    <section id="skyline" className={s.section} aria-labelledby="skyline-h">
      <div className={s.wrap}>
        <h2 id="skyline-h" className={s.h2}>
          Three lit towers
        </h2>
        <p className={s.lede}>
          Each tower is a project she built. The sign is its name, the lobby board says what it does, and the
          door goes to the code or the live demo.
        </p>
      </div>
      <div className={s.towers}>
        {ORDER.map((o) => {
          const p = projects.find((x) => x.slug === o.slug);
          return p ? <ProjectTower key={p.slug} p={p} roof={o.roof} east={o.east} /> : null;
        })}
      </div>
    </section>
  );
}

function ProjectTower({ p, roof, east }: { p: Project; roof: string; east?: boolean }) {
  return (
    <article className={s.tower} data-roof={roof} data-east={east ? "" : undefined} aria-labelledby={`tw-${p.slug}`}>
      <div className={s.roof} aria-hidden="true" />
      <div className={s.towerSign}>
        <h3 id={`tw-${p.slug}`} className={s.towerName}>
          {p.name}
        </h3>
      </div>
      <div className={s.facade}>
        <div className={s.windows} aria-hidden="true" />
        <div className={s.lobby}>
          <p className={s.towerContext}>{p.context}</p>
          <p className={s.towerTagline}>{p.tagline}</p>
          <div className={s.allStops}>
            <p className={s.towerAim}>{p.aim}</p>
            <ul className={s.points}>
              {p.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </div>
          <ul className={s.plates} aria-label="Stack">
            {p.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <a className={s.door} href={p.link.url} target="_blank" rel="noreferrer">
            {p.link.label}
            <span className={s.srOnly}> for {p.name}</span>
            <Icon name="arrowUpRight" size={16} />
          </a>
        </div>
      </div>
      <div className={s.wetStreet} aria-hidden="true">
        <span className={s.towerMirror}>{p.name}</span>
      </div>
    </article>
  );
}
