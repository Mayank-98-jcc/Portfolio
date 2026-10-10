import { lazy, Suspense, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../../data/projects';
import { socials } from '../../data/socials';
import type { Project } from '../../types/project';
import { ProjectArtwork } from './ProjectArtwork';
const ProjectModal = lazy(() => import('./ProjectModal'));
export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section className="section work-section" id="projects" aria-labelledby="work-title">
      <div className="section-kicker" data-reveal>
        <span>01 / SELECTED WORK</span>
        <span>IDEAS, BROUGHT TO LIFE.</span>
      </div>
      <div className="section-heading" data-reveal>
        <h2 id="work-title">
          SELECTED
          <br />
          <span className="serif">work.</span>
        </h2>
        <p>
          Things I’ve built, explored,
          <br />
          and brought to life.
          <br />
          <span className="muted">Built with curiosity. Refined with care.</span>
        </p>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <article
            className={`project-card project-${project.id}`}
            data-project={project.id}
            key={project.id}
            data-reveal
          >
            <button
              className="project-image-button"
              data-cursor="view"
              aria-label={`View ${project.title} project details`}
              onClick={(event) => {
                event.currentTarget.focus({ preventScroll: true });
                setSelected(project);
              }}
            >
              <ProjectArtwork project={project} />
              <span className="project-hover">
                VIEW PROJECT <ArrowUpRight size={17} />
              </span>
            </button>
            <div className="project-meta">
              <span className="project-number">0{index + 1}</span>
              <div>
                <h3>
                  <button
                    onClick={(event) => {
                      event.currentTarget.focus({ preventScroll: true });
                      setSelected(project);
                    }}
                  >
                    {project.title}
                  </button>
                </h3>
                <p>{project.subtitle}</p>
              </div>
              <button
                className="project-arrow circle-icon"
                aria-label={`Explore ${project.title}`}
                onClick={(event) => {
                  event.currentTarget.focus({ preventScroll: true });
                  setSelected(project);
                }}
              >
                <ArrowUpRight size={22} />
              </button>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-foot">
              <span
                className={`project-status ${project.status === 'In Progress' ? 'in-progress' : ''}`}
              >
                <i />
                {project.status}
              </span>
              <span>{project.technologies.slice(0, 3).join(' / ')}</span>
              {project.demo && project.status === 'Completed' && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Live Demo: ${project.title}`}
                >
                  LIVE <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </article>
        ))}
        <div className="project-outro" data-reveal>
          <span className="outro-asterisk" aria-hidden="true">
            ✳
          </span>
          <p>
            Always a work
            <br />
            <em>in progress.</em>
          </p>
          <span>
            More experiments. More learning.
            <br />
            More things worth building.
          </span>
          <a href={socials.github} className="text-link" target="_blank" rel="noopener noreferrer">
            EXPLORE MY GITHUB <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <Suspense
        fallback={
          selected ? (
            <div className="modal-loading" role="status">
              Opening project…
            </div>
          ) : null
        }
      >
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </Suspense>
    </section>
  );
}
