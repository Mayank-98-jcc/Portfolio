import { trapDialogFocus } from '../../lib/dialog';
import { Github } from '../ui/BrandIcons';
import { useEffect, useRef } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import type { Project } from '../../types/project';
import { ProjectArtwork } from './ProjectArtwork';
import { ProjectTechStack } from './ProjectTechStack';
import { ButtonLink } from '../ui/Button';
export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => {
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={`project-modal project-${project.id}`}
      aria-labelledby="project-modal-title"
      data-lenis-prevent
      onClose={onClose}
      onKeyDown={trapDialogFocus}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
    >
      <div className="modal-inner">
        <button
          className="modal-close"
          aria-label="Close project details"
          onClick={() => dialog.current?.close()}
          autoFocus
        >
          <X size={21} />
        </button>
        <ProjectArtwork project={project} showStatus />
        <div className="modal-content">
          <p className="eyebrow">PROJECT OVERVIEW</p>
          <h2 id="project-modal-title">{project.title}</h2>
          <p className="modal-subtitle">{project.subtitle}</p>
          <p>{project.description}</p>
          <div className="modal-columns">
            <div>
              <h3>The problem</h3>
              <p>{project.problem}</p>
            </div>
            <div>
              <h3>The solution</h3>
              <p>{project.solution}</p>
            </div>
          </div>
          <h3>{project.status === 'In Progress' ? 'Planned capabilities' : 'Key features'}</h3>
          <ul className="feature-list">
            {project.features.map((feature) => (
              <li key={feature}>
                <Check size={14} />
                {feature}
              </li>
            ))}
          </ul>
          <h3>Technology stack</h3>
          <ProjectTechStack technologies={project.technologies} />
          <h3>
            {project.status === 'In Progress' ? 'Planned architecture' : 'Architecture overview'}
          </h3>
          <p className="architecture-note">{project.architecture}</p>
          <h3>Screenshots & links</h3>
          <p className="muted">{project.imageNote}</p>
          {project.imageKind === 'screenshot' && (
            <a
              className="text-link screenshot-link"
              href={project.image}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open full screenshot <ArrowUpRight size={14} />
            </a>
          )}
          <div className="modal-links">
            {project.demo && project.status === 'Completed' ? (
              <ButtonLink href={project.demo} target="_blank" rel="noopener noreferrer">
                View Live Project
                <ArrowUpRight size={15} />
              </ButtonLink>
            ) : (
              <span className="link-pending">
                {project.status === 'In Progress'
                  ? 'Currently in development'
                  : 'Live demo link coming soon'}
              </span>
            )}
            {project.github ? (
              <ButtonLink
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                <Github size={15} />
                GitHub
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </div>
    </dialog>
  );
}
