import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { socialLinks } from '../../data/socials';
export function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 MAYANK THAPLIYAL</span>
      <div>
        {socialLinks.map((link) => (
          <a key={link.kind} href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label}
            <ArrowUpRight size={12} />
          </a>
        ))}
      </div>
      <a href="#home">
        BACK TO TOP <ArrowUp size={14} />
      </a>
    </footer>
  );
}
