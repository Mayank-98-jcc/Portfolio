import { ArrowUpRight } from 'lucide-react';
import { education } from '../../data/education';
export function Education() {
  return (
    <section className="section education-section" id="education" aria-labelledby="education-title">
      <div className="section-kicker" data-reveal>
        <span>05 / THE FOUNDATION</span>
        <span>STUDENT TODAY. BUILDER ALWAYS.</span>
      </div>
      <div className="education-grid">
        <h2 id="education-title" className="display-heading" data-reveal>
          EDUCATION<span className="education-heading-note serif">The foundation.</span>
        </h2>
        <div className="education-detail" data-reveal>
          <div className="education-date">
            <span>{education.duration}</span>
            <span className="education-current">
              <i />
              MCA · {education.semester}
            </span>
          </div>
          <h3>
            MASTER OF
            <br />
            COMPUTER APPLICATIONS
          </h3>
          <p className="university">
            Guru Gobind Singh Indraprastha University <span>(GGSIPU)</span>
          </p>
          <p>{education.institution}</p>
          <div className="education-bottom">
            <span>{education.branch}</span>
            <ArrowUpRight size={28} />
          </div>
        </div>
      </div>
    </section>
  );
}
