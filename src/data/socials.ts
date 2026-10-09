import type { SocialLink } from '../types/portfolio';

export const socials = {
  email: 'mailto:mayankthapliyal500@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mayank-thapliyal-439565386/',
  github: 'https://github.com/Mayank-98-jcc',
} as const;

export const socialLinks: SocialLink[] = [
  {
    kind: 'email',
    label: 'Email',
    href: socials.email,
    contactText: socials.email.slice('mailto:'.length),
  },
  { kind: 'linkedin', label: 'LinkedIn', href: socials.linkedin, contactText: 'LinkedIn Profile' },
  { kind: 'github', label: 'GitHub', href: socials.github, contactText: 'GitHub Profile' },
];
