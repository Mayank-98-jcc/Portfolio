import { useState } from 'react';
import { HeroEnvironment } from './HeroEnvironment';
import { HeroIntro } from './HeroIntro';
import { Button, ButtonLink } from '../ui/Button';
import { HeroPortraitVideo } from './HeroPortraitVideo';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { socials } from '../../data/socials';
export function Hero() {
  const [introOpen, setIntroOpen] = useState(false);
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <HeroEnvironment />
      <div className="hero-topline">
        <span>PORTFOLIO / 2026</span>
        <span>CURIOUS MIND. BUILDER AT HEART.</span>
      </div>
      <p className="hero-greeting" aria-hidden="true">
        <span className="hero-greeting-pointer">
          <span className="greeting-word">Hey,</span> <span className="greeting-word">there.</span>
        </span>
      </p>
      <HeroPortraitVideo />
      <div className="hero-availability">
        <span className="status-dot" />
        Open to internships & opportunities
      </div>
      <p className="hero-note">
        MCA Student focused on <br />
        Full-Stack Development, <br />
        AI/ML, and modern digital <br />
        experiences.
        <ArrowUpRight size={24} strokeWidth={1.4} />
      </p>
      <div className="hero-identity">
        <h1 id="hero-title" className="hero-name">
          <span className="hero-iam name-line">
            <span className="name-line-inner">I AM</span>
          </span>
          <span className="name-line">
            <span className="name-line-inner">MAYANK</span>
          </span>
          <span className="name-line">
            <span className="name-line-inner">
              THAPLIYAL<span className="name-period">.</span>
            </span>
          </span>
          <span className="sr-only"> — Aspiring Software Engineer & Full-Stack Developer</span>
        </h1>
        <p className="hero-supporting">
          MCA Student · Full-Stack Developer
          <br />
          AI/ML Enthusiast · Problem Solver
        </p>
        <div className="hero-actions">
          <ButtonLink href="#projects">
            View My Work <ArrowUpRight size={16} />
          </ButtonLink>
          <Button
            variant="secondary"
            onClick={(event) => {
              event.currentTarget.focus({ preventScroll: true });
              setIntroOpen(true);
            }}
            aria-haspopup="dialog"
          >
            Quick Intro <ArrowUpRight size={16} />
          </Button>
        </div>
      </div>
      <div className="hero-role">
        <span className="role-asterisk" aria-hidden="true">
          ✳
        </span>
        <p>
          ASPIRING <br />
          SOFTWARE <br />
          ENGINEER
        </p>
        <span className="role-caption">A little curiosity. A lot of building.</span>
      </div>
      <div className="hero-bottom">
        <a className="scroll-link" href="#projects">
          <span className="circle-icon">
            <ArrowDown size={17} />
          </span>
          SCROLL TO EXPLORE
        </a>
        <span className="hero-study">
          MCA — GGSIPU <span>2026–2028</span>
        </span>
        <div className="hero-socials">
          <a href={socials.github} target="_blank" rel="noopener noreferrer">
            GITHUB <ArrowUpRight size={13} />
          </a>
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
            LINKEDIN <ArrowUpRight size={13} />
          </a>
          <a href={socials.email} aria-label="Email Mayank">
            EMAIL <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      {introOpen && <HeroIntro onClose={() => setIntroOpen(false)} />}
    </section>
  );
}
