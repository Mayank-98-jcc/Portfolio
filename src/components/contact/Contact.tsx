import { ArrowUpRight } from 'lucide-react';
import { socials } from '../../data/socials';
import { ContactForm } from './ContactForm';
import { ButtonLink } from '../ui/Button';
const resumeFiles = import.meta.glob('/public/resume.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
});
export function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="section contact-inner">
        <div className="section-kicker" data-reveal>
          <span>08 / YOUR NEXT IDEA STARTS HERE</span>
          <span>
            <i className="status-dot" /> OPEN TO OPPORTUNITIES
          </span>
        </div>
        <div className="contact-grid">
          <h2 id="contact-title">
            <span className="contact-line">
              <span className="contact-line-inner">LET’S BUILD</span>
            </span>
            <span className="contact-line">
              <span className="contact-line-inner">SOMETHING</span>
            </span>
            <span className="contact-line">
              <span className="contact-line-inner">
                <span className="serif">great.</span>
                <span className="contact-star" aria-hidden="true">
                  ✳
                </span>
              </span>
            </span>
          </h2>
          <div className="contact-copy" data-reveal>
            <p>
              Have an idea, opportunity,
              <br />
              or project to discuss?
              <br />
              <span>I’d love to connect.</span>
            </p>
            <ButtonLink
              href={socials.email}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-cta"
            >
              LET’S TALK <ArrowUpRight size={20} />
            </ButtonLink>
            <a
              className="contact-email"
              href={socials.email}
              target="_blank"
              rel="noopener noreferrer"
            >
              mayankthapliyal500@gmail.com <ArrowUpRight size={15} />
            </a>
            <div className="contact-socials">
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                LINKEDIN <ArrowUpRight size={15} />
              </a>
              <a href={socials.github} target="_blank" rel="noopener noreferrer">
                GITHUB <ArrowUpRight size={15} />
              </a>
              {Object.keys(resumeFiles).length > 0 && (
                <a href="/resume.pdf" download>
                  RÉSUMÉ <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
        <details className="contact-form-details">
          <summary>
            Prefer to write a message here? <span>+</span>
          </summary>
          <ContactForm />
        </details>
      </div>
    </section>
  );
}
