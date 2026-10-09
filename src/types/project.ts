export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'Completed' | 'In Progress';
  technologies: string[];
  features: string[];
  problem: string;
  solution: string;
  architecture: string;
  image: string;
  imageKind: 'screenshot' | 'concept';
  imageAlt: string;
  imageNote: string;
  previewLabel: string;
  fallbackImage: string;
  github: string;
  demo: string;
}
