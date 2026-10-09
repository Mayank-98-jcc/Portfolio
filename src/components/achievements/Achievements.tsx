import { ArrowUpRight } from 'lucide-react';
import { certifications } from '../../data/certifications';
export function Achievements() {
  if (!certifications.length) return null;
  return (
    <section id="achievements" className="section">
      <div className="section-kicker">CONTINUING THE JOURNEY</div>
      <h2 className="display-heading">CERTIFICATIONS</h2>
      <div className="cert-grid">
        {certifications.map((cert) => (
          <article className="certificate" key={`${cert.title}-${cert.date}`}>
            {cert.image && (
              <img src={cert.image} alt={`${cert.title} certificate`} loading="lazy" />
            )}
            <h3>{cert.title}</h3>
            <p>
              {cert.issuer} · {cert.date}
            </p>
            {cert.credentialUrl && (
              <a
                className="text-link"
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View credential <ArrowUpRight size={14} />
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
