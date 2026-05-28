// projects data (canonical source for project lists)
import ByteMeImg from "./assets/images/ByteMe.svg";
import RiftImg from "./assets/images/Rift.svg";
import GDGImg from "./assets/images/GDG.svg";
import QuickAirImg from "./assets/images/Quick Air.svg";
import BallBackImg from "./assets/images/BallBack.svg";
import OXOImg from "./assets/images/OXO.svg";
import Folio25Img from "./assets/images/folio'25.svg";

const projects = [
  {
    name: 'ByteMe',
    link: 'https://breeze-sn.github.io/ByteMe/',
    img: ByteMeImg,
    alt: 'ByteMe project cover',
    type: 'Web Design • Frontend Development',
    year: '2026',
    tools: 'HTML • CSS • JavaScript • Figma',
  },
  {
    name: 'RIFT Design',
    link: 'https://www.revarift.tech',
    img: RiftImg,
    alt: 'RIFT design showcase',
    type: 'Branding • UI/UX • Product Design',
    year: '2026',
    tools: 'Figma • Illustrator • Photoshop',
  },
  {
    name: 'GDG Community Design & Identity',
    link: 'https://www.behance.net/gallery/238530857/GDGoC-REVA-University-Community-Design-Identity',
    img: GDGImg,
    alt: 'GDG community design project',
    type: 'Brand & Visual Identity • Community Design',
    year: '2025',
    tools: 'Figma • Illustrator • Photoshop',
  },
  {
    name: 'Quick Air',
    link: 'https://www.behance.net/gallery/230187655/Quick-Air',
    img: QuickAirImg,
    alt: 'Quick Air project showcase',
    type: 'UX Research • Product Design',
    year: '2025',
    tools: 'Figma • Photoshop',
  },
  {
    name: 'Ballback',
    link: 'https://github.com/breeze-sn/Ballback',
    img: BallBackImg,
    alt: 'Ballback game project',
    type: 'Game Design • Development',
    year: '2025',
    tools: 'Unity • C# • Figma • Adobe Illustrator',
  },
  {
    name: 'OXO',
    link: 'https://oxo.figma.site',
    img: OXOImg,
    alt: 'OXO project showcase',
    type: 'Interactive Design • UI/UX',
    year: '2025',
    tools: 'Figma Make',
  },
  {
    name: "Folio'25 | Simran Nagekar",
    link: 'https://www.simrann.dev',
    img: Folio25Img,
    alt: 'Folio 25 portfolio cover',
    type: 'Portfolio • Product Design • Development',
    year: '2025',
    tools: 'React • GSAP • TailwindCSS • Figma',
  },
];

export default projects;