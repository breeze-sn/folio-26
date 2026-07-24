import { Icon } from "@iconify/react";
import Me from "../../assets/images/Me-optimized.jpg";
import Cursor from "../ui/Cursor";
import Seo from "../ui/Seo";

function BentoLink({ href, icon, title, detail, className = "", children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group relative flex min-h-[12rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-accent-100/25 bg-primary-100 p-5 shadow-[0_8px_0_rgba(26,26,34,0.06)] transition duration-300 hover:-translate-y-1 hover:border-secondary-600 hover:shadow-[0_16px_0_rgba(47,62,255,0.14)] ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-100 text-2xl text-secondary-600">
          <Icon icon={icon} />
        </span>
        <Icon icon="lucide:arrow-up-right" className="text-xl text-accent-100 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
      </div>
      <div className="relative z-10">
        <h2 className="text-body-1 font-semibold text-accent-300">{title}</h2>
        <p className="mt-1 text-body-4 text-accent-100">{detail}</p>
      </div>
      {children}
    </a>
  );
}

export default function Breeze() {
  return (
    <div className="min-h-screen bg-secondary-100 px-5 py-5 text-accent-300 md:px-10 md:py-8 xl:px-20 2xl:px-28">
      <Seo
        title="Breeze"
        description="Links, work, and small corners of the internet from Simran Nagekar."
        url="https://simransn.tech/breeze"
      />
      <Cursor />

      <main className="mx-auto max-w-6xl pb-10">
        <header className="mb-8 flex items-center justify-between border-b border-accent-100/35 pb-4 font-grotesk text-body-4 uppercase tracking-[0.14em] text-accent-100">
          <span>Breeze</span>
          <span>Links &amp; corners</span>
        </header>

        <section className="mb-5 grid gap-5 md:grid-cols-[1.15fr_1fr]">
          <div className="relative min-h-[18rem] overflow-hidden rounded-[2rem] bg-accent-300 p-7 text-secondary-100 md:min-h-[22rem]">
            <img src={Me} alt="Simran Nagekar" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-75 mix-blend-luminosity" />
            <div className="relative flex h-full max-w-sm flex-col justify-between">
              <span className="w-fit rounded-full border border-secondary-100/40 px-3 py-1 font-grotesk text-body-4">Hello, I&apos;m Simran</span>
              <div>
                <h1 className="text-heading-2 font-medium leading-[0.88]">Designing playful, useful things.</h1>
                <p className="mt-4 max-w-xs font-grotesk text-body-4 text-secondary-200">Game &amp; product designer based in Bengaluru, India.</p>
              </div>
            </div>
          </div>

          <BentoLink
            href="mailto:nagekarsimran@outlook.com"
            icon="lucide:mail"
            title="Let&apos;s make something"
            detail="nagekarsimran@outlook.com"
            className="min-h-[18rem] bg-secondary-600 text-secondary-100 md:min-h-[22rem]"
          >
            <span className="absolute -bottom-12 -right-6 font-general text-[11rem] font-semibold leading-none text-secondary-500/50">@</span>
          </BentoLink>
        </section>

        <section className="grid auto-rows-[12rem] grid-cols-2 gap-5 md:grid-cols-4">
          <BentoLink
            href="https://www.linkedin.com/in/simransn/"
            icon="mdi:linkedin"
            title="LinkedIn"
            detail="Professional updates"
            className="col-span-2 bg-primary-100"
          />
          <BentoLink
            href="https://www.behance.net/simrannagekar"
            icon="mdi:behance"
            title="Behance"
            detail="Visual work"
            className="bg-secondary-300"
          />
          <BentoLink
            href="https://github.com/breeze-sn"
            icon="mdi:github"
            title="GitHub"
            detail="Code & experiments"
            className="bg-accent-300 text-secondary-100"
          />
          <BentoLink
            href="https://github.com/breeze-sn/Ballback"
            icon="mdi:gamepad-variant-outline"
            title="BallBack"
            detail="A game project"
            className="col-span-2 row-span-2 bg-secondary-200"
          >
            <span className="absolute -bottom-7 -right-2 font-general text-8xl font-semibold tracking-headings text-secondary-500/25">PLAY</span>
          </BentoLink>
          <BentoLink
            href="https://instagram.com/simran.nagekar"
            icon="mdi:instagram"
            title="Instagram"
            detail="Daily fragments"
            className="bg-primary-100"
          />
          <BentoLink
            href="https://medium.com/@breezesn"
            icon="mdi:medium"
            title="Medium"
            detail="Words & ideas"
            className="bg-secondary-100"
          />
          <div className="col-span-2 flex flex-col justify-between rounded-[1.75rem] border border-dashed border-accent-100/45 p-5 md:col-span-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-300 text-2xl text-secondary-100"><Icon icon="lucide:sparkles" /></span>
            <div>
              <h2 className="text-body-1 font-semibold">Next up</h2>
              <p className="mt-1 text-body-4 text-accent-100">More games, sketches, and little experiments landing soon.</p>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-3 border-t border-accent-100/35 pt-5 font-grotesk text-body-4 text-accent-100 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Simran Nagekar</span>
          <span>Made with a little breeze.</span>
        </footer>
      </main>
    </div>
  );
}
