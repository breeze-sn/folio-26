// projects data (canonical source for project lists)
import byteme from '/vite.svg';
import rift from '/vite.svg';
import gdg from '/vite.svg';
import quickAir from '/vite.svg';
import ballback from '/vite.svg';
import oxo from '/vite.svg';

const projects = [
  {
    name: 'ByteMe',
    link: 'https://breeze-sn.github.io/ByteMe/',
    img: byteme,
    alt: 'ByteMe project cover',
    type: 'Web Design • Frontend Development',
    year: '2026',
    tools: 'HTML • CSS • JavaScript • Figma',
  },
  {
    name: 'RIFT Design',
    link: 'https://www.revarift.tech',
    img: rift,
    alt: 'RIFT design showcase',
    type: 'Branding • UI/UX • Product Design',
    year: '2026',
    tools: 'Figma • Illustrator • Photoshop',
  },
  {
    name: 'GDG Community Design & Identity',
    link: 'https://www.behance.net/gallery/238530857/GDGoC-REVA-University-Community-Design-Identity',
    img: gdg,
    alt: 'GDG community design project',
    type: 'Brand & Visual Identity • Community Design',
    year: '2025',
    tools: 'Figma • Illustrator • Photoshop',
  },
  {
    name: 'Quick Air',
    link: 'https://www.behance.net/gallery/230187655/Quick-Air',
    img: quickAir,
    alt: 'Quick Air project showcase',
    type: 'UX Research • Product Design',
    year: '2025',
    tools: 'Figma • Photoshop',
  },
  {
    name: 'Ballback',
    link: 'https://github.com/breeze-sn/Ballback',
    img: ballback,
    alt: 'Ballback game project',
    type: 'Game Design • Development',
    year: '2025',
    tools: 'Unity • C# • Figma • Adobe Illustrator',
  },
  {
    name: 'OXO',
    link: 'https://oxo.figma.site',
    img: oxo,
    alt: 'OXO project showcase',
    type: 'Interactive Design • UI/UX',
    year: '2025',
    tools: 'Figma Make',
  },
];

export default projects;