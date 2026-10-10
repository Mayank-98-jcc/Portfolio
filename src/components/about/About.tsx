import { ArrowUpRight } from 'lucide-react';
import { ProjectArtwork } from '../projects/ProjectArtwork';
import { projects } from '../../data/projects';
export function About() {
  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <div className="section-kicker" data-reveal>
        <span>02 / A LITTLE ABOUT ME</span>
        <span>THE PERSON BEHIND THE CODE</span>
      </div>
      <div className="about-grid">
        <div>
          <h2 id="about-title" className="display-heading">
            <span className="editorial-line">
              <span>TURNING</span>
            </span>
            <span className="editorial-line">
              <span>IDEAS INTO</span>
            </span>
            <span className="editorial-line">
              <span className="serif">REALITY</span>
            </span>
          </h2>
          <div className="about-copy" data-reveal>
            <span className="small-asterisk" aria-hidden="true">
              ✳
            </span>
            <div>
              <p>
                I’m Mayank, an MCA student at GGSIPU with a growing interest in software
                engineering, full-stack development, and AI-powered applications.
              </p>
              <p className="muted">
                I enjoy turning ideas into working products, exploring new technologies, and
                understanding how software systems fit together.
              </p>
              <a href="#contact" className="text-link">
                LET’S GET TO KNOW EACH OTHER <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
        <div className="about-visual" data-reveal>
          <ProjectArtwork project={projects[1]} />
          <div className="image-caption">
            <span>IDEAS INTO INTERFACES</span>
            <span>OCEANXPLORE / PROJECT SCREENSHOT</span>
          </div>
        </div>
      </div>
      <div className="about-facts" data-reveal>
        {[
          { label: 'THE JOURNEY', value: 'MCA', detail: '2026–2028 · GGSIPU' },
          { label: 'THE WORK', value: '03', detail: 'Featured projects' },
          { label: 'THE FOCUS', value: 'Full-Stack + AI', detail: 'Engineering meets curiosity' },
          { label: 'RIGHT NOW', value: 'Learning & building', detail: 'One idea at a time' },
        ].map((fact, i) => (
          <div key={fact.label}>
            <span className="fact-label">
              0{i + 1} / {fact.label}
            </span>
            <strong>{fact.value}</strong>
            <span>{fact.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
