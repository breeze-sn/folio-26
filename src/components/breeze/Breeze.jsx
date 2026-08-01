import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
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

const spotifyStorageKey = "breeze-spotify-state";

function readSpotifyState() {
  if (typeof window === "undefined") return null;

  try {
    const rawState = window.localStorage.getItem(spotifyStorageKey);
    if (!rawState) return null;

    const parsedState = JSON.parse(rawState);
    if (!parsedState?.track?.url) return null;

    return parsedState;
  } catch {
    return null;
  }
}

function writeSpotifyState(state) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(spotifyStorageKey, JSON.stringify(state));
  } catch {
    // Ignore storage failures.
  }
}

async function extractAlbumAccent(imageUrl) {
  if (typeof window === "undefined" || !imageUrl) return null;

  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 32;
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) {
          resolve(null);
          return;
        }

        context.drawImage(image, 0, 0, size, size);
        const { data } = context.getImageData(0, 0, size, size);

        let redTotal = 0;
        let greenTotal = 0;
        let blueTotal = 0;
        let weightTotal = 0;

        for (let index = 0; index < data.length; index += 4) {
          const alpha = data[index + 3] / 255;
          if (alpha < 0.1) continue;

          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const brightness = (red + green + blue) / 3;
          const saturation = Math.max(red, green, blue) - Math.min(red, green, blue);
          const weight = alpha * (0.55 + saturation / 255) * (0.35 + brightness / 255);

          redTotal += red * weight;
          greenTotal += green * weight;
          blueTotal += blue * weight;
          weightTotal += weight;
        }

        if (!weightTotal) {
          resolve(null);
          return;
        }

        const red = Math.round(redTotal / weightTotal);
        const green = Math.round(greenTotal / weightTotal);
        const blue = Math.round(blueTotal / weightTotal);
        resolve(`rgb(${red}, ${green}, ${blue})`);
      } catch {
        resolve(null);
      }
    };

    image.onerror = () => resolve(null);
    image.src = imageUrl;
  });
}

function SpotifyNowPlaying({
  track,
  isPlaying,
  progressMs = 0,
  accentColor = "#121212",
  className = "",
}) {
  if (!track?.url) {
    return (
      <article
        className={`group relative flex min-h-[12rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)] ${className}`}
        style={{}}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,185,84,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_30%)]" />
        <div className="relative z-10 flex items-start justify-end">
          <Icon icon="lucide:arrow-up-right" className="text-xl text-white/60 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
        </div>

        <div className="relative z-10 space-y-2">
          <p className="font-grotesk text-[11px] uppercase tracking-[0.18em] text-white/45">Last played</p>
          <h2 className="font-general text-[1.05rem] font-semibold leading-tight text-white/85 sm:text-[1.25rem]">
            Spotify is unavailable
          </h2>
          <p className="font-grotesk text-sm text-white/55 sm:text-[0.95rem]">
            Live playback is unavailable.
          </p>
        </div>

        <span className="absolute right-5 bottom-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl text-[#1DB954] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
          <Icon icon="mdi:spotify" />
        </span>

      </article>
    );
  }

  const progress = track.durationMs > 0 ? Math.min(100, Math.max(0, (progressMs / track.durationMs) * 100)) : 0;

  return (
    <article
      className={`group relative flex min-h-[12rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 p-5 text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)] ${className}`}
      style={{
        backgroundColor: accentColor,
        backgroundImage: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor} 50%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.05) 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,185,84,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_30%)]" />

      <div className="relative z-10 flex items-start justify-end">
        <Icon icon="lucide:arrow-up-right" className="text-xl text-white/60 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
      </div>

      <div className="relative z-10 flex items-center gap-4 sm:gap-5">
        <div className="relative shrink-0">
          <img
            src={track.albumArt || Me}
            alt={track.title}
            crossOrigin="anonymous"
            className="h-20 w-20 rounded-[1.125rem] object-cover ring-1 ring-white/10 sm:h-24 sm:w-24"
          />
          <div className="absolute inset-0 rounded-[1.125rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
        </div>

        <div className="min-w-0 flex-1">
          {!isPlaying && (
            <p className="font-grotesk text-[11px] uppercase tracking-[0.18em] text-white/45">
              Last played
            </p>
          )}

          <h2 className="mt-1 truncate font-general text-[1.1rem] font-semibold leading-tight text-white sm:text-[1.35rem]">
            {track.title}
          </h2>
          <p className="mt-1 truncate font-grotesk text-sm text-white/70 sm:text-[0.95rem]">
            {track.artist}
          </p>
        </div>
      </div>

      {isPlaying && (
        <div className="relative z-10 mt-4 h-[3px] overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#1DB954] transition-[width] duration-700 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <span className="absolute right-5 bottom-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl text-[#1DB954] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <Icon icon="mdi:spotify" />
      </span>
    </article>
  );
}

const defaultSpotify = {
  track: null,
  isPlaying: false,
  progressMs: 0,
  syncedAt: Date.now(),
  accentColor: "#121212",
};

export default function Breeze() {
  const [spotify, setSpotify] = useState(() => readSpotifyState() || defaultSpotify);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSpotify((current) => {
        if (!current.isPlaying || !current.track?.durationMs) return current;

        const elapsed = Date.now() - current.syncedAt;
        const nextProgress = Math.min(current.track.durationMs, current.progressMs + elapsed);

        return {
          ...current,
          progressMs: nextProgress,
          syncedAt: Date.now(),
        };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [spotify.isPlaying, spotify.track?.durationMs]);

  useEffect(() => {
    const controller = new AbortController();

    const loadSpotify = async () => {
      try {
        const response = await fetch(`/api/spotify/now-playing?t=${Date.now()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const track = data?.track;

        if (!track?.url) {
          return;
        }

        const accentColor = (await extractAlbumAccent(track.albumArt)) || (data?.connected ? "#121212" : defaultSpotify.accentColor);

        setSpotify({
          track,
          isPlaying: Boolean(data?.isPlaying),
          progressMs: data?.progressMs || 0,
          syncedAt: Date.now(),
          accentColor,
        });

        writeSpotifyState({
          track,
          isPlaying: Boolean(data?.isPlaying),
          progressMs: data?.progressMs || 0,
          syncedAt: Date.now(),
          accentColor,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load Spotify playback:", error);
        }
      }
    };

    loadSpotify();
    const intervalId = window.setInterval(loadSpotify, 1000);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

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
              <span className="w-fit rounded-full border border-secondary-100/40 px-3 py-1 font-grotesk text-body-4">About</span>
              <div>
                <h1 className="text-heading-2 font-medium leading-[0.88]">Simran Nagekar</h1>
                <p className="mt-4 max-w-xs font-grotesk text-body-4 text-secondary-200">Product Engineer &amp; Game Designer based in Bengaluru, India.</p>
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
            detail="Professional life"
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
            href="https://instagram.com/simran.nagekar"
            icon="mdi:instagram"
            title="Instagram"
            detail="Outdated Social Life"
            className="bg-primary-100"
          />
          <BentoLink
            href="https://medium.com/@breezesn"
            icon="mdi:medium"
            title="Medium"
            detail="Words & ideas"
            className="bg-secondary-100"
          />
          <BentoLink
            href="https://twitter.com/s1mran0"
            icon="mdi:twitter"
            title="Twitter"
            detail="Thoughts & updates"
            className="bg-secondary-100"
          />
          <BentoLink
            href="https://reddit.com/user/BreezieXD"
            icon="mdi:reddit"
            title="Reddit"
            detail="inactive :')"
            className="bg-secondary-100"
          />
          <BentoLink
            href="https://in.pinterest.com/simran_nagekar"
            icon="mdi:pinterest"
            title="Pinterest"
            detail="cool stuff"
            className="bg-secondary-100"
          />
          <BentoLink
            href="https://open.spotify.com/user/31trbfvupfmba4dkc4o445srjxfa"
            icon="mdi:spotify"
            title="Spotify"
            detail="Playlists & Musics <3"
            className="bg-secondary-100"
          />
          <SpotifyNowPlaying
            track={spotify.track}
            isPlaying={spotify.isPlaying}
            progressMs={spotify.progressMs}
            accentColor={spotify.accentColor}
            key={spotify.track?.url || "spotify-card"}
            className="col-span-2"
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
