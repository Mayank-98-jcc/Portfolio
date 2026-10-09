import { buildingSteps } from '../../data/process';
export function Process() {
  return (
    <section id="process" className="section process-section" aria-labelledby="process-title">
      <div className="section-kicker" data-reveal>
        <span>03 / HOW I BUILD</span>
        <span>ONE IDEA. MANY ITERATIONS.</span>
      </div>
      <div className="section-heading" data-reveal>
        <h2 id="process-title">
          FROM IDEA TO
          <br />
          <span className="serif">implementation.</span>
        </h2>
        <p>
          My approach to learning
          <br />
          and building projects.
          <br />
          <span className="muted">Curiosity, structure, and iteration.</span>
        </p>
      </div>
      <ol className="process-timeline">
        {buildingSteps.map((step, index) => (
          <li className="process-step" key={step.title}>
            <span className="process-number">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <span className="process-note">{step.note}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
