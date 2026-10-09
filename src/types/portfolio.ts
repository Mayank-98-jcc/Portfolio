export interface NavigationItem {
  id: string;
  label: string;
}
export interface SocialLink {
  label: string;
  href: string;
  contactText: string;
  kind: 'github' | 'linkedin' | 'email';
}
export interface Education {
  degree: string;
  institution: string;
  university: string;
  branch: string;
  duration: string;
  semester: string;
  focus: string[];
}
export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  image?: string;
}
