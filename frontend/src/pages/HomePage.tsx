import Button from "react-bootstrap/Button";

import { Plans } from "../components/PlansSection";
import Navbar from "../components/Navbar";
import AudioPlayer from "../components/AudioPlayer";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function HomePage() {
  // fix anchor links
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const locHash = location.hash.slice(1);

      if (document.getElementById(locHash)) {
        setTimeout(() => {
          document
            .getElementById(locHash)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 m-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Your Perfect Sound!
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Access thousands of high-quality music samples. Create, mix,
                  and produce with ease.
                </p>
              </div>
              <div className="space-x-4">
                <Button
                  variant="dark"
                  size="lg"
                  onClick={() => (window.location.href = "/contact")}
                >
                  Get Started
                </Button>
                <Button
                  variant="light"
                  size="lg"
                  className="outline-btn"
                  onClick={() => (window.location.href = "/contact")}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="samples"
          className="w-full py-12 md:py-24 lg:py-32 bg-[#f4f4f5]"
        >
          <div className="container px-4 md:px-6 m-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Featured Samples
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <AudioPlayer
                title="Epic Orchestral Hit"
                src="https://archive.org/download/rick-astley-never-gonna-give-you-up_202303/Rick-Astley-Never-Gonna-Give-You-Up.mp3"
              />
              <AudioPlayer title="Deep House Bass" src="/tmpf1u8uoge.wav" />
              <AudioPlayer
                title="Trap Snare Roll"
                src="/samples/snare-roll.mp3"
              />
              <AudioPlayer title="Ambient Pad" src="/temp2.wav" />
            </div>
          </div>
        </section>
        <section id="plans" className="w-full py-12 md:py-24 lg:py-32">
          <Plans></Plans>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 beatgems. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-reset text-decoration-none text-xs hover-underline underline-offset-4"
            href="/soon"
          >
            Terms of Service
          </a>
          <a
            className="text-reset text-decoration-none text-xs hover-underline underline-offset-4"
            href="/soon"
          >
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
