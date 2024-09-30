// import Link from "next/link";
import { Play, Pause, ChevronRight, Music } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Slider } from "@/components/ui/slider";

function AudioPlayer({ title, src }: { title: string; src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const updateProgress = () => {
      const calculatedProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(calculatedProgress) ? 0 : calculatedProgress);
    };

    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current && duration > 0) {
      const time = (value[0] / 100) * duration;
      if (isFinite(time) && time >= 0 && time <= duration) {
        audioRef.current.currentTime = time;
        setProgress(value[0]);
      }
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-secondary p-4 rounded-lg">
      <button
        // size="icon"
        // variant="secondary"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>
      <div className="flex-grow">
        <h3 className="text-sm font-medium">{title}</h3>
        {/* <Slider
          value={[progress]}
          max={100}
          step={1}
          className="w-full"
          onValueChange={handleSliderChange}
        /> */}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <Music className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">SampleVault</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Pricing
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </a>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 m-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Your Perfect Sound
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Access thousands of high-quality music samples. Create, mix,
                  and produce with ease.
                </p>
              </div>
              <div className="space-x-4">
                <button>Get Started</button>
                <button className="outline-btn">Learn More</button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6 m-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Featured Samples
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <AudioPlayer
                title="Epic Orchestral Hit"
                src="/samples/orchestral-hit.mp3"
              />
              <AudioPlayer
                title="Deep House Bass"
                src="/samples/house-bass.mp3"
              />
              <AudioPlayer
                title="Trap Snare Roll"
                src="/samples/snare-roll.mp3"
              />
              <AudioPlayer title="Ambient Pad" src="/samples/ambient-pad.mp3" />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 m-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">
              Choose Your Plan
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* <Card>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>For hobbyists and beginners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$9.99/mo</div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4" /> Access to 1000+
                      samples
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4" /> Basic mixing
                      tools
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4" /> Community forum
                      access
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <button className="w-full">Choose Basic</button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>
                    For serious producers and professionals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$24.99/mo</div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4" /> Access to
                      10,000+ samples
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4" /> Advanced mixing
                      and effects
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4" /> Exclusive pro
                      community
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="mr-2 h-4 w-4" /> Early access to
                      new samples
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <button className="w-full">Choose Pro</button>
                </CardFooter>
              </Card> */}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 SampleVault. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
