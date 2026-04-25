import { navLinks } from "../data/siteData";

export default function NavBar() {
  return (
    <header className="topbar" data-reveal>
      <p className="brand">folio'26</p>

      <nav aria-label="Primary">
        <ul className="menu">
          {navLinks.map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`}>{item}</a>
            </li>
          ))}
        </ul>
      </nav>

      <a className="menu-cta" href="#contact">
        Book Intro
      </a>
    </header>
  );
}
