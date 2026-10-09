import { ArrowUpRight } from 'lucide-react';
const capabilities = [
  {
    title: 'FULL-STACK WEB APPLICATIONS',
    description:
      'From the interface to the API and database. Thoughtful applications, connected end to end.',
  },
  {
    title: 'REACT FRONTEND EXPERIENCES',
    description:
      'Responsive, accessible interfaces with attention to the details that make them feel right.',
  },
  {
    title: 'AI-POWERED APPLICATIONS',
    description: 'Exploring how intelligent features can solve useful, everyday problems.',
  },
  {
    title: 'DATA & 3D VISUALIZATION',
    description:
      'Making complex information easier to explore through interactive visual experiences.',
  },
];
export function Services() {
  return (
    <section className="section services-section" aria-labelledby="services-title">
      <div className="section-kicker" data-reveal>
        <span>07 / LET’S MAKE SOMETHING</span>
        <span>OPEN TO COLLABORATION</span>
      </div>
      <h2 id="services-title" className="display-heading" data-reveal>
        I CAN HELP
        <br />
        YOU <span className="serif">build.</span>
      </h2>
      <div className="service-rows">
        {capabilities.map((item, i) => (
          <a href="#contact" className="service-row" key={item.title} data-reveal>
            <span className="row-number">0{i + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span className="circle-icon">
              <ArrowUpRight size={23} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
