import Projects from "../ui/Projects";
import Heading from "../ui/Heading";
import projects from "../../data";

export default function Works({ forwardedRef }) {
  const layout = [
    "col-span-1 pt-0 md:col-span-7 md:pt-16",
    "col-span-1 pt-0 md:col-span-5 md:pt-80",
    "col-span-1 h-fit pt-0 md:col-span-8 md:pt-20",
    "col-span-1 h-fit md:col-span-4",
    "col-span-1 md:col-span-6",
    "col-span-1 md:col-span-6 md:pt-32",
    "col-span-1 md:col-span-12",
  ];

  return (
    <section
      ref={forwardedRef}
      id="works"
      className="nav-change overflow-hidden my-[10%]"
    >
      <Heading title="Projects" />

      <div className="mt-10 grid grid-cols-1 gap-16 gap-y-10 md:grid-cols-12">
        {projects.map((project, index) => (
          <div key={project.name + index} className={layout[index % layout.length]}>
            <Projects
              link={project.link}
              img={project.img}
              alt={project.alt}
              name={project.name}
              type={project.type}
              year={project.year}
              tools={project.tools}
            />
          </div>
        ))}
      </div>
    </section>
  );
}