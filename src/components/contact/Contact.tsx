import { ArrowUpRight, Mail, MessageSquare } from 'lucide-react';
import { Github, Linkedin } from '../ui/BrandIcons';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { socials } from '../../data/socials';
import { ContactForm } from './ContactForm';
import { ButtonLink } from '../ui/Button';
import { ContactEnvironment } from './ContactEnvironment';
const resumeFiles = import.meta.glob('/public/resume.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
});
export function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-atmosphere" aria-hidden="true" />
      <div className="section contact-inner">
        <div className="section-kicker contact-kicker">
          <span>08 / YOUR NEXT IDEA STARTS HERE</span>
        </div>
        <div className="contact-grid">
          <div className="contact-headline">
            <h2 id="contact-title">
              <span className="contact-line">
                <span className="contact-line-inner">LET’S BUILD</span>
              </span>
              <span className="contact-line">
                <span className="contact-line-inner">SOMETHING</span>
              </span>
              <span className="contact-line contact-serif-line">
                <span className="contact-line-inner">
                  <span className="serif">great.</span>
                  <span className="contact-star" aria-hidden="true">
                    ✳
                  </span>
                </span>
              </span>
            </h2>
            <div className="contact-editorial">
              <p>
                IDEAS
                <br />
                CONVERSATIONS
                <br />
                COLLABORATIONS
                <br />
                REAL IMPACT
              </p>
              <span>
                Open to
                <br />
                opportunities
              </span>
            </div>
          </div>
          <ContactEnvironment />
          <div className="contact-copy">
            <div className="contact-availability">
              <i className="status-dot" /> OPEN TO OPPORTUNITIES
            </div>
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
              <Mail size={19} aria-hidden="true" />
              <span>mayankthapliyal500@gmail.com</span>{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <div className="contact-socials">
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} aria-hidden="true" /> LINKEDIN{' '}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a href={socials.github} target="_blank" rel="noopener noreferrer">
                <Github size={20} aria-hidden="true" /> GITHUB{' '}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              {Object.keys(resumeFiles).length > 0 && (
                <a href="/resume.pdf" download>
                  RÉSUMÉ <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
        <details className="contact-form-details" onToggle={() => ScrollTrigger.refresh()}>
          <summary>
            <MessageSquare size={21} aria-hidden="true" />
            <span>Prefer to write a message here?</span>
            <ArrowUpRight className="message-toggle-icon" size={21} aria-hidden="true" />
          </summary>
          <ContactForm />
        </details>
      </div>
    </section>
  );
}
