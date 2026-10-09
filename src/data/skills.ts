import type { SkillCategory } from '../types/skill';
export const skillCategories: SkillCategory[] = [
  {
    name: 'Languages',
    description:
      'Building programming foundations through problem solving, object-oriented concepts, and typed applications.',
    skills: [
      {
        name: 'Java',
        symbol: '♨',
        color: '#f39976',
        description: 'Programming and object-oriented concepts',
      },
      {
        name: 'C++',
        symbol: 'C++',
        color: '#76b7ff',
        description: 'Programming and problem solving',
      },
      {
        name: 'Python',
        symbol: 'Py',
        color: '#f2cf6f',
        description: 'Programming and AI exploration',
      },
      {
        name: 'C',
        symbol: 'C',
        color: '#9aa6ff',
        description: 'Programming foundations',
      },
      {
        name: 'JavaScript',
        symbol: 'JS',
        color: '#efd969',
        description: 'Web development',
      },
      {
        name: 'TypeScript',
        symbol: 'TS',
        color: '#71b2ff',
        description: 'Typed application development',
      },
    ],
  },
  {
    name: 'Frontend',
    description:
      'Turning ideas into responsive interfaces with semantic structure, reusable components, and attention to accessibility.',
    skills: [
      { name: 'Tailwind CSS', symbol: '~', color: '#38bdf8', description: 'Utility-first styling' },
      {
        name: 'HTML',
        symbol: '5',
        color: '#ff9679',
        description: 'Semantic web structure',
      },
      {
        name: 'CSS',
        symbol: '3',
        color: '#7abfff',
        description: 'Responsive visual design',
      },
      {
        name: 'React',
        symbol: '⚛',
        color: '#61dafb',
        description: 'Component-based interfaces',
      },
      {
        name: 'Next.js',
        symbol: 'N',
        color: '#e3e7f5',
        description: 'React application framework',
      },
    ],
  },
  {
    name: 'Backend',
    description:
      'Connecting interfaces to data through APIs and server-side logic, while strengthening Java web fundamentals.',
    skills: [
      { name: 'JDBC', symbol: 'J', color: '#a75d23', description: 'Java database connectivity' },
      { name: 'Servlets', symbol: 'S', color: '#a75d23', description: 'Java web fundamentals' },
      { name: 'JSP', symbol: 'J', color: '#a75d23', description: 'Server-rendered Java pages' },
      {
        name: 'Node.js',
        symbol: '⬡',
        color: '#8cce9f',
        description: 'JavaScript on the server',
      },
      {
        name: 'Express.js',
        symbol: 'ex',
        color: '#d1d9ec',
        description: 'Web APIs and services',
      },
      {
        name: 'Java',
        symbol: '♨',
        color: '#f39976',
        description: 'Backend and OOP foundations',
      },
      {
        name: 'REST APIs',
        symbol: '⇄',
        color: '#b49cff',
        description: 'Connecting applications',
      },
    ],
  },
  {
    name: 'Databases',
    description:
      'Working with document and relational data, and learning how to model, query, and connect application information.',
    skills: [
      {
        name: 'MySQL',
        symbol: 'my',
        color: '#75bfe4',
        description: 'Relational data',
      },
      {
        name: 'MongoDB',
        symbol: '◈',
        color: '#67dba7',
        description: 'Document databases',
      },
      {
        name: 'PostgreSQL',
        symbol: 'pg',
        color: '#91b4e3',
        description: 'Relational and spatial data',
      },
    ],
  },
  {
    name: 'AI / ML',
    description:
      'Exploring AI-powered applications and learning machine learning, deep learning, and computer vision tools.',
    skills: [
      {
        name: 'AI',
        symbol: 'AI',
        color: '#a75d23',
        description: 'Artificial intelligence foundations',
      },
      {
        name: 'Machine Learning',
        symbol: 'ML',
        color: '#a75d23',
        description: 'Learning from data',
      },
      {
        name: 'Python',
        symbol: 'Py',
        color: '#f2cf6f',
        description: 'Programming for AI',
      },
      {
        name: 'TensorFlow',
        symbol: 'TF',
        color: '#ffb274',
        description: 'Learning machine learning tools',
      },
      {
        name: 'PyTorch',
        symbol: '◉',
        color: '#ff9379',
        description: 'Exploring deep learning',
      },
      {
        name: 'OpenCV',
        symbol: 'cv',
        color: '#8be5c2',
        description: 'Computer vision fundamentals',
      },
      {
        name: 'Keras',
        symbol: 'K',
        color: '#f3879c',
        description: 'Learning neural network APIs',
      },
      {
        name: 'Generative AI',
        symbol: '✧',
        color: '#b499ff',
        description: 'Exploring intelligent applications',
      },
    ],
  },
  {
    name: 'Tools',
    description:
      'Keeping projects organized with version control, a focused development environment, and application containers.',
    skills: [
      {
        name: 'Git',
        symbol: '◇',
        color: '#ff9784',
        description: 'Version control',
      },
      {
        name: 'GitHub',
        symbol: 'gh',
        color: '#dae2fa',
        description: 'Code collaboration',
      },
      {
        name: 'VS Code',
        symbol: '⌁',
        color: '#79bfff',
        description: 'Development environment',
      },
      {
        name: 'Docker',
        symbol: '▤',
        color: '#75c8ff',
        description: 'Application containers',
      },
    ],
  },
];
