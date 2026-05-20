import ServiceUi from "../ui/ServiceUi";
import Heading from "../ui/Heading";

export default function Services() {
  const expertiseItems = [
    "Game Design",
    "Game Testing",
    "Visual Design",
    "Product Design",
    "Web Design",
    "UX Research",
  ];

  const toolBoxItems = [
    "Figma",
    "Procreate",
    "Unity",
    "Adobe Illustrator",
    "JavaScript",
    "HTML",
    "CSS",
    "GSAP",
    "TailwindCSS",
    "ReactJS",
  ];

  return (
    <section id="services" className="my-[10%]" aria-label="services">
      <Heading title="services" />
      <div className="space-y-14">
        <ServiceUi
          title="my expertises."
          description="I create experiences through design, 
          development, and a little bit of creative chaos, crafting visuals, 
          interactions, and products that feel meaningful, 
          and hopefully make people go &apos;yo, this is cool.&apos;"
          items={expertiseItems}
          />
        <ServiceUi
          title="my digital tool box."
           description="These are my favorite creative weapons of choice.
           The tools, tech, and software I use to turn ideas into interactive experiences. 
           Always learning, always experimenting, and occasionally fighting bugs at 2AM."
           items={toolBoxItems}
        />
      </div>
    </section>
  );
}
