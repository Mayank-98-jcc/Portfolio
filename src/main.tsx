import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/anton/latin-400.css';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import 'lenis/dist/lenis.css';
import './styles/variables.css';
import './styles/globals.css';
import './styles/projects.css';
import './styles/hero-video.css';
import './styles/animations.css';
import './styles/editorial-refinement.css';
import './styles/sections.css';
import './styles/hero-composition.css';
import App from './App';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
