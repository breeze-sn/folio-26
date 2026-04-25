export default function HeroSection() {
  return (
    <section className="hero" data-reveal id="work">
      <p className="eyebrow">Design + Frontend Portfolio</p>
      <h1>I build digital spaces that feel sharp, human, and impossible to ignore.</h1>
      <p className="lede">
        Selected work across brand systems, product surfaces, and motion-first web
        experiences. Built for impact, measured with behavior.
      </p>

      <div className="hero-actions">
        <a className="btn-solid" href="#grid">
          View Projects
        </a>
        <a className="btn-ghost" href="#process">
          See Process
        </a>
      </div>

      <ul className="hero-facts" aria-label="Highlights">
        <li>
          <span>12</span>
          launches
        </li>
        <li>
          <span>4</span>
          industries
        </li>
        <li>
          <span>98%</span>
          client return rate
        </li>
      </ul>
    </section>
  );
}
