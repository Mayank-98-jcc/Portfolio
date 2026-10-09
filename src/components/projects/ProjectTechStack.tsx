export function ProjectTechStack({ technologies }: { technologies: string[] }) {
  return (
    <div className="tech-tags">
      {technologies.map((tech) => (
        <span key={tech}>{tech}</span>
      ))}
    </div>
  );
}
