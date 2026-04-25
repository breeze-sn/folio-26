import { processSteps } from "../data/siteData";

export default function ProcessRail() {
  return (
    <section className="process" id="process" data-reveal>
      <p className="eyebrow">How I Work</p>
      <div className="process-items">
        {processSteps.map((step, index) => (
          <article className="process-item" key={step.title}>
            <p className="step-index">0{index + 1}</p>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
