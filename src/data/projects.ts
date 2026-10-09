import type { Project } from '../types/project';
export const projects: Project[] = [
  {
    id: 'resumeiq',
    title: 'ResumeIQ',
    subtitle: 'AI Resume Analyzer & Job Matcher',
    status: 'Completed',
    description:
      'An AI-powered resume analysis platform designed to help users evaluate resumes, measure ATS compatibility, identify improvement areas, and improve their profiles with intelligent suggestions.',
    technologies: [
      'React',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Gemini API',
      'Razorpay',
      'SMTP',
      'JavaScript',
    ],
    features: [
      'Authentication',
      'Resume upload',
      'ATS scoring',
      'AI analysis',
      'Improvement suggestions',
      'Job matching',
      'Subscription plans',
      'Admin features',
      'Payment integration',
      'Email functionality',
    ],
    problem:
      'Understanding how a resume aligns with a role can be difficult without clear, actionable feedback.',
    solution:
      'Bring resume evaluation, improvement suggestions, and job matching together in one platform.',
    architecture:
      'React interface · Node.js / Express.js backend · MongoDB storage · Gemini API analysis · Razorpay payments · SMTP email',
    image: '/images/projects/resumeiq/preview.png',
    imageKind: 'screenshot',
    imageAlt: 'ResumeIQ landing page with AI resume analysis and ATS compatibility interface',
    imageNote:
      'Captured from the deployed ResumeIQ app. Scores and numbers shown in the interface are demonstration content, not verified product performance statistics.',
    previewLabel: 'ResumeIQ / Landing page',
    fallbackImage: '/images/projects/resumeiq/concept.svg',
    github: '',
    demo: 'https://ai-resume-analyzer-job-matcher-mu.vercel.app/',
  },
  {
    id: 'oceanxplore',
    title: 'OceanXplore',
    subtitle: '3D Ocean Data Visualization Platform',
    status: 'Completed',
    description:
      'A web-based platform for exploring oceanographic data through an interactive 3D environment, including ocean variables, depth slices, and observation overlays.',
    technologies: [
      'React',
      'Cesium.js',
      'Node.js',
      'FastAPI',
      'PostgreSQL',
      'PostGIS',
      'Supabase',
      'Redis',
      'Python',
      'xarray',
    ],
    features: [
      '3D ocean visualization',
      'Temperature visualization',
      'Salinity visualization',
      'Current velocity',
      'Depth-based exploration',
      'Observation overlays',
      'Scientific data processing',
      'NetCDF / xarray workflow',
      'Interactive Cesium environment',
    ],
    problem: 'Complex oceanographic datasets are difficult to explore as raw numerical data.',
    solution:
      'Make ocean data spatial and interactive through a three-dimensional visualization environment.',
    architecture:
      'React / Cesium.js visualization · Node.js and FastAPI services · PostgreSQL / PostGIS · Supabase · Redis · Python / xarray data processing',
    image: '/images/projects/oceanxplore/preview.png',
    imageKind: 'screenshot',
    imageAlt:
      'OceanXplore Cesium globe with ocean variables, surface temperature, and observation controls',
    imageNote:
      'Captured from the deployed OceanXplore app at the surface temperature view. The public demo uses demonstration observations and a synthetic ocean model.',
    previewLabel: 'OceanXplore / Temperature',
    fallbackImage: '/images/projects/oceanxplore/concept.svg',
    github: '',
    demo: 'https://3d-ocean-virid.vercel.app/?variable=temperature&depth=0',
  },
  {
    id: 'codementor-ai',
    title: 'CodeMentor AI',
    subtitle: 'AI-Assisted Coding Review & Interview Platform',
    status: 'In Progress',
    description:
      'An AI-assisted coding review and interview platform under development, combining deterministic code analysis with AI-powered feedback.',
    technologies: [
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Prisma',
      'Docker',
      'AI APIs',
      'Monaco Editor',
    ],
    features: [
      'AI code review',
      'Static analysis',
      'Complexity analysis',
      'Security analysis',
      'Code quality analysis',
      'Improved-code suggestions',
      'Coding interview environment',
      'Secure code execution',
    ],
    problem:
      'Learning from code requires feedback on quality, complexity, and potential issues, beyond whether it runs.',
    solution:
      'Combine deterministic analysis with AI feedback in a coding and interview workspace. These capabilities are in development.',
    architecture:
      'Planned: React / Monaco Editor interface · Node.js services · PostgreSQL / Prisma · Docker execution environment · AI APIs',
    image: '/images/projects/codementor-ai/concept.svg',
    imageKind: 'concept',
    imageAlt: 'Conceptual code and AI illustration for CodeMentor AI, not a product screenshot',
    imageNote:
      'This project is under development. The visual is concept artwork; product screenshots and a public demo are not available yet.',
    previewLabel: 'CodeMentor AI / In development',
    fallbackImage: '/images/projects/codementor-ai/concept.svg',
    github: '',
    demo: '',
  },
];
