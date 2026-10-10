import { ProjectConcept } from './ProjectConcept';
import { useState } from 'react';
import { Code2, FileText, Globe2 } from 'lucide-react';
import type { Project } from '../../types/project';
const fallbackIcons = { resumeiq: FileText, oceanxplore: Globe2, 'codementor-ai': Code2 };
export function ProjectArtwork({
  project,
  showStatus = false,
}: {
  project: Project;
  showStatus?: boolean;
}) {
  const [stage, setStage] = useState<'primary' | 'fallback' | 'unavailable'>('primary');
  const isScreenshot = project.imageKind === 'screenshot' && stage === 'primary';
  const FallbackIcon = fallbackIcons[project.id as keyof typeof fallbackIcons] ?? Code2;
  if (project.imageKind === 'concept' || (project.id === 'codementor-ai' && stage !== 'primary'))
    return (
      <div className="project-artwork artwork-codementor-ai preview-concept">
        <ProjectConcept />
        {showStatus && <span className="concept-status">{project.status}</span>}
      </div>
    );
  return (
    <div
      className={`project-artwork artwork-${project.id} ${isScreenshot ? 'preview-screenshot' : 'preview-concept'}`}
    >
      <div className="project-preview-frame">
        <div className="project-preview-header">
          <span className="preview-window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="preview-page-label">{project.previewLabel}</span>
          <span
            className={`badge ${project.status === 'Completed' ? 'status-completed' : 'status-progress'}`}
          >
            <span />
            {project.status}
          </span>
        </div>
        <div className="project-preview-image">
          {stage === 'unavailable' ? (
            <div className="artwork-fallback">
              <FallbackIcon size={48} />
              <span>{project.title}</span>
            </div>
          ) : (
            <img
              src={stage === 'primary' ? project.image : project.fallbackImage}
              alt={
                stage === 'primary'
                  ? project.imageAlt
                  : `${project.title} concept artwork; screenshot unavailable`
              }
              loading="lazy"
              width="1536"
              height="874"
              onError={() =>
                setStage(
                  stage === 'primary' && project.image !== project.fallbackImage
                    ? 'fallback'
                    : 'unavailable',
                )
              }
            />
          )}
          {!isScreenshot && (
            <span className="artwork-label">
              {stage === 'primary'
                ? 'CONCEPT VISUAL · IN DEVELOPMENT'
                : 'PREVIEW UNAVAILABLE · CONCEPT VISUAL'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
