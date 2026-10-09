import { skillCategories } from '../../data/skills';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';
export function Skills() {
  return (
    <section className="section skills-section" id="skills" aria-labelledby="skills-title">
      <div className="section-kicker" data-reveal>
        <span>04 / MY TOOLKIT</span>
        <span>ALWAYS ADDING TO IT.</span>
      </div>
      <div className="section-heading" data-reveal>
        <h2 id="skills-title">
          WHAT I
          <br />
          <span className="serif">work with.</span>
        </h2>
        <p>
          The tools I work with.
          <br />
          The foundations I’m strengthening.
          <br />
          <span className="muted">Select a category to explore.</span>
        </p>
      </div>
      <div className="skill-rows">
        {skillCategories.map((category, i) => (
          <details
            className="skill-row"
            key={category.name}
            onToggle={() => ScrollTrigger.refresh()}
          >
            <summary className="skill-summary">
              <span className="row-number">0{i + 1}</span>
              <h3>{category.name === 'Languages' ? 'Programming' : category.name}</h3>
              <div className="skill-names">
                {category.skills.map((skill) => (
                  <span key={skill.name}>{skill.name}</span>
                ))}
              </div>
              <Plus className="skill-toggle-icon" size={22} aria-hidden="true" />
            </summary>
            <div className="skill-detail">
              <p>{category.description}</p>
              <dl>
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <dt>{skill.name}</dt>
                    <dd>{skill.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
