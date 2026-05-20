import { Icon } from "@iconify/react";
import { useEffect, useState, useRef } from "react";
import { ScrollTrigger } from "gsap/all";
import { gsap } from "gsap";
import Heading from "../ui/Heading";

export default function Contact() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [submissionStatus, setSubmissionStatus] = useState("idle");
  const defaultAppsScriptUrl = "https://script.google.com/macros/s/AKfycbwMG71JQDope-8utwNojUqOc2j2nXJTo4K8mHTlGWdvRb8Z4PonqjHkZhAwahSjOh2tEg/exec";
  const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL?.trim() || defaultAppsScriptUrl;

  const heading = useRef(null)
  const body = useRef(null)
  const contactSection = useRef(null)
  const formRef = useRef(null)
  const hasSubmittedRef = useRef(false)

  useEffect(() => {
    ScrollTrigger.create({
      trigger: contactSection.current,
      start:"180px bottom",

      // markers: true,
      animation: gsap
        .timeline()
        .to(heading.current, { opacity: 1, y: 0, ease: "power4.out", duration: 1.25 }, 0)
        .to(body.current, { opacity: 1, y: 0, ease: "power4.out", duration: 1.25 }, 0.2),

      toggleActions: "play none none none",
    });
    ScrollTrigger.refresh();

  }, [contactSection])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  });

  const handleSubmit = (event) => {
    if (!appsScriptUrl) {
      event.preventDefault();
      setSubmissionStatus("error");
      return;
    }

    hasSubmittedRef.current = true;
    setSubmissionStatus("sending");
  };

  const handleFrameLoad = () => {
    if (!hasSubmittedRef.current) {
      return;
    }

    hasSubmittedRef.current = false;
    formRef.current?.reset();
    setSubmissionStatus("success");
  };

  return (
    <section
      id="contact"
      className="my-[10%] overflow-hidden"
      aria-label="contact me"
    >
      
      
      <Heading title="Contact" />
      <div ref={contactSection} className="mt-10 flex flex-col gap-20 md:grid md:grid-cols-6 md:px-12">
        <div className="col-span-4">
          <h3 ref={heading} className="max-w-lg 2xl:max-w-3xl text-heading-3 2xl:text-7xl font-semibold leading-tight translate-y-10 opacity-0">
            Have an awesome idea? Let&apos;s bring it to life.
          </h3>
          <form
            ref={formRef}
            name="contact"
            action={appsScriptUrl}
            autoComplete="off"
            className="mt-10 font-grotesk"
            method="POST" 
            target="contact-submit-frame"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="form-name" value="contact"/>
            <input type="hidden" name="source" value="portfolio-contact" />
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2">
              <div className="relative z-0">
                  <input
                    required
                    type="text"
                    id="name"
                    name="name"
                    className="peer block w-full appearance-none border-0 border-b border-accent-100 bg-transparent px-0 py-2.5 focus:outline-none focus:ring-0"
                    placeholder=" "
                  />
                <label
                  htmlFor="name"
                  className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-body-3 2xl:text-body-2 text-secondary-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75"
                >
                  Your name
                </label>
              </div>
              <div className="relative z-0">
                <input
                  required
                  type="text"
                  name="email"
                  id="email"
                  className="peer block w-full appearance-none border-0 border-b border-accent-100 bg-transparent px-0 py-2.5 focus:outline-none focus:ring-0"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-body-3 2xl:text-body-2 text-secondary-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75"
                >
                  Your email
                </label>
              </div>
              <div className="relative z-0 sm:col-span-2">
                <textarea
                  required
                  id="message"
                  name="message"
                  rows="5"
                  className="peer block w-full appearance-none border-0 border-b border-accent-100 bg-transparent px-0 py-2.5 focus:outline-none focus:ring-0"
                  placeholder=" "
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-body-3 2xl:text-body-2 text-secondary-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75"
                >
                  Your message
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={submissionStatus === "sending"}
              className="button group mt-10 border duration-200 hover:border-accent-400 hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="relative">
                <span className="absolute bottom-2 h-1 w-0 bg-secondary-700 opacity-90 duration-300 ease-out group-hover:w-full"></span>
                <span className="group-hover:text-accent-400">
                  {submissionStatus === "sending" ? "Sending..." : "Send Message"}
                </span>
              </span>
            </button>
            <p className="mt-4 min-h-6 text-body-4 text-secondary-600">
              {submissionStatus === "success" && "Message sent. I’ll get back to you soon."}
              {submissionStatus === "error" && !appsScriptUrl && "Add VITE_APPS_SCRIPT_URL to connect this form to Apps Script."}
            </p>
          </form>
          <iframe
            name="contact-submit-frame"
            title="Contact form submission frame"
            className="hidden"
            onLoad={handleFrameLoad}
          />
        </div>
        <div className="col-span-2 grid grid-cols-1 gap-x-4 gap-y-8 text-accent-300 sm:grid-cols-2 sm:gap-y-0 md:grid-cols-1">
          <div className="space-y-3 ">
            <h4 className="text-body-1 2xl:text-4xl font-semibold">Contact Details</h4>
            <div className="flex flex-col space-y-3 text-body-2 2xl:text-3xl">
              <a
                href="mailto:nagekarsimran@outlook.com"
                className="group relative w-fit cursor-pointer"
                target="_blank"
                rel="noreferrer"
              >
                <span>nagekarsimran@outlook.com</span>
                <span className="absolute bottom-0 left-0 h-[0.12em] w-0 rounded-full bg-secondary-600 duration-300 ease-in-out group-hover:w-full"></span>
              </a>
             
            </div>
          </div>
          <div className="space-y-3 ">
            <h4 className="text-body-1 2xl:text-4xl font-semibold">My Digital Spaces</h4>
            <div className="flex items-center space-x-4 text-body-2 2xl:text-3xl">
              
              <a
                href="https://github.com/breeze-sn"
                className="group flex items-center space-x-2"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <Icon icon="mdi:github" color="#666" />
              </a>
              <a
                href="https://www.linkedin.com/in/simransn/"
                className="group group flex w-fit items-center space-x-2"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Icon icon="mdi:linkedin" color="#666" />
              </a>
              <a
                href="https://www.behance.net/simrannagekar"
                className="group flex items-center"
                target="_blank"
                rel="noreferrer"
                aria-label="Behance"
                title="Behance"
              >
                <Icon icon="simple-icons:behance" color="#666" />
              </a>
              <a
                href="https://medium.com/@breezesn"
                className="group flex items-center"
                target="_blank"
                rel="noreferrer"
                aria-label="Medium"
                title="Medium"
              >
                <Icon icon="simple-icons:medium" color="#666" />
              </a>
              <a
                href="https://instagram.com/simran.nagekar"
                className="group flex items-center"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <Icon icon="mdi:instagram" color="#666" />
              </a>
              <a
                href="https://twitter.com/s1mran0"
                className="group flex items-center"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                title="Twitter"
              >
                <Icon icon="mdi:twitter" color="#666" />
              </a>
              <a
                href="https://reddit.com/user/BreezieXD"
                className="group flex items-center"
                target="_blank"
                rel="noreferrer"
                aria-label="Reddit"
                title="Reddit"
              >
                <Icon icon="simple-icons:reddit" color="#666" />
              </a>
              <a
                href="https://in.pinterest.com/simran_nagekar"
                className="group flex items-center"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                title="Pinterest"
              >
                <Icon icon="simple-icons:pinterest" color="#666" />
              </a>
              <a
                href="https://open.spotify.com/user/31trbfvupfmba4dkc4o445srjxfa"
                className="group flex items-center"
                target="_blank"
                rel="noreferrer"
                aria-label="Spotify"
                title="Spotify"
              >
                <Icon icon="mdi:spotify" color="#666" />
              </a>
            </div>
          </div>
          <div className="space-y-3 ">
            <h4 className="text-body-1 font-semibold 2xl:text-4xl">Location</h4>
            <div className="space-y-2 text-body-2 2xl:text-3xl">
              <p>
                Bengaluru, India <br></br>
                {time}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
