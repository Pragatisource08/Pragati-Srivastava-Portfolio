import { Icon } from "@/components/icons";
import { links, profile } from "@/lib/content";
import { BadgeWorld, CopyAddress, PassToggle } from "@/components/badge/BadgeWorld";
import { LanyardBadge } from "@/components/badge/LanyardBadge";
import { PlanB } from "@/components/badge/PlanB";
import {
  Booth,
  CheckIn,
  Directory,
  Expo,
  HandsOn,
  HelpDesk,
  Judging,
  MergeDesk,
  Registration,
  Stickers,
  Wristbands,
} from "@/components/badge/Floor";

export default function Home() {
  return (
    <BadgeWorld className="badge-page">
      <a className="badge-skip" href="#floor">
        Skip to the event floor
      </a>
      <header className="badge-hero">
        <LanyardBadge />
        <div className="badge-hero-copy">
          <div className="badge-hero-top">
            <span className="badge-wordmark">Pragati.</span>
            <PassToggle label="Reading depth for the whole page" />
          </div>
          <h1 className="badge-hook">
            Things break.
            <br />
            My code has a <em>Plan&nbsp;B</em>.
          </h1>
          <PlanB />
          <p className="badge-hook-sub">
            I&rsquo;m {profile.name}, a backend engineer building Python services, REST APIs, and applied AI. Team Lead
            at Smart India Hackathon 2026. NASA Space Apps 2025 Global Nominee.
          </p>
          <div className="badge-hero-actions">
            <a className="badge-btn-primary badge-btn-lg" href={links.mailto}>
              <Icon name="mail" size={22} />
              Email Pragati
            </a>
            <ul className="badge-hero-links">
              <li>
                <a href={links.linkedin} target="_blank" rel="noreferrer">
                  <Icon name="linkedin" size={18} />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={links.github} target="_blank" rel="noreferrer">
                  <Icon name="github" size={18} />
                  GitHub
                </a>
              </li>
              <li>
                <a href={links.resume} target="_blank" rel="noreferrer">
                  <Icon name="resume" size={18} />
                  Resume
                </a>
              </li>
              <li>
                <CopyAddress />
              </li>
            </ul>
          </div>
        </div>
        <a className="badge-to-floor" href="#floor">
          Onto the event floor
          <Icon name="arrowDown" size={18} />
        </a>
      </header>
      <main id="floor" className="badge-floor" tabIndex={-1}>
        <Directory />
        <CheckIn />
        <Expo />
        <MergeDesk />
        <Booth />
        <HandsOn />
        <Wristbands />
        <Stickers />
        <Registration />
        <Judging />
      </main>
      <HelpDesk />
    </BadgeWorld>
  );
}
