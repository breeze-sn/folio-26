import folio25Image from "/vite.svg";
import bytemeTempImage from "/vite.svg";
import riftImage from "/vite.svg";
import gdgTempImage from "/vite.svg";
import quickAirTempImage from "/vite.svg";
import ballbackTempImage from "/vite.svg";
import oxoTempImage from "/vite.svg";

import Projects from "../ui/Projects";
import Heading from "../ui/Heading";

export default function Works({ forwardedRef }) {
  return (
    <section
      ref={forwardedRef}
      id="works"
      className="nav-change overflow-hidden my-[10%]"
    >
      <Heading title="Projects" />

      <div className="mt-10 grid grid-cols-1 gap-16 gap-y-10 md:grid-cols-12">
        
        {/* Project #1 */}
        <div className="col-span-1 md:col-span-12">
          <Projects
            link="https://www.simrann.dev"
            img={folio25Image}
            alt="Folio 25 portfolio cover"
            name="Folio'25 | Simran Nagekar"
            type="Portfolio • Product Design • Development"
            year="2025"
            tools="React • GSAP • TailwindCSS • Figma"
          />
        </div>

        {/* Project #2 */}
        <div className="col-span-1 pt-0 md:col-span-7 md:pt-16">
          <Projects
            link="https://breeze-sn.github.io/ByteMe/"
            img={bytemeTempImage}
            alt="ByteMe project cover"
            name="ByteMe"
            type="Web Design • Frontend Development"
            year="2026"
            tools="HTML • CSS • JavaScript • Figma"
          />
        </div>

        {/* Project #3 */}
        <div className="col-span-1 pt-0 md:col-span-5 md:pt-80">
          <Projects
            link="https://www.revarift.tech"
            img={riftImage}
            alt="RIFT design showcase"
            name="RIFT Design"
            type="Branding • UI/UX • Product Design"
            year="2026"
            tools="Figma • Illustrator • Photoshop"
          />
        </div>

        {/* Project #4 */}
        <div className="col-span-1 h-fit pt-0 md:col-span-8 md:pt-20">
          <Projects
            link="https://www.behance.net/gallery/238530857/GDGoC-REVA-University-Community-Design-Identity"
            img={gdgTempImage}
            alt="GDG community design project"
            name="GDG Community Design & Identity"
            type="Brand & Visual Identity • Community Design"
            year="2025"
            tools="Figma • Illustrator • Photoshop"
          />
        </div>

        {/* Project #5 */}
        <div className="col-span-1 h-fit md:col-span-4">
          <Projects
            link="https://www.behance.net/gallery/230187655/Quick-Air"
            img={quickAirTempImage}
            alt="Quick Air project showcase"
            name="Quick Air"
            type="UX Research • Product Design"
            year="2025"
            tools="Figma • Photoshop"
          />
        </div>

        {/* Project #6 */}
        <div className="col-span-1 md:col-span-6">
          <Projects
            link="https://github.com/breeze-sn/Ballback"
            img={ballbackTempImage}
            alt="Ballback game project"
            name="Ballback"
            type="Game Design • Development"
            year="2025"
            tools="Unity • C# • Figma • Adobe Illustrator"
          />
        </div>

        {/* Project #7 */}
        <div className="col-span-1 md:col-span-6 md:pt-32">
          <Projects
            link="https://oxo.figma.site"
            img={oxoTempImage}
            alt="OXO project showcase"
            name="OXO"
            type="Interactive Design • UI/UX"
            year="2025"
            tools="Figma Make"
          />
        </div>

      </div>
    </section>
  );
}