import { useRef } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/hero/Hero';
import { Projects } from './components/projects/Projects';
import { About } from './components/about/About';
import { Process } from './components/process/Process';
import { Skills } from './components/skills/Skills';
import { Education } from './components/education/Education';
import { Learning } from './components/learning/Learning';
import { Achievements } from './components/achievements/Achievements';
import { Workstation } from './components/workstation/Workstation';
import { Services } from './components/services/Services';
import { Contact } from './components/contact/Contact';
import { Experience } from './components/experience/Experience';
export default function App() {
  const root = useRef<HTMLDivElement>(null);
  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Experience root={root} />
      <Navbar />
      <main id="main">
        <Hero />
        <Projects />
        <About />
        <Process />
        <Skills />
        <Education />
        <Learning />
        <Achievements />
        <Workstation />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
