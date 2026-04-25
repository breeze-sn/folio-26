import { projectCards } from "../data/siteData";

export default function WorkGrid() {
  return (
    <section className="work-grid" id="grid" data-reveal>
      {projectCards.map((project) => (
        <article className="project-card" key={project.title}>
          <p className="project-type">{project.type}</p>
          <h2>{project.title}</h2>
          <p className="project-summary">{project.summary}</p>
          <div className="project-meta">
            <span>{project.metrics}</span>
            <span>{project.year}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
