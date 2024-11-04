import WaveSurfer from "wavesurfer.js";

import WavesurferPlayer from "@wavesurfer/react";
import { Play, Pause } from "lucide-react";
import { useState } from "react";

export default function AudioPlayer({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

  const togglePlay = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (wavesurfer) {
      if (isPlaying) {
        wavesurfer.pause();
      } else {
        wavesurfer.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onReady = (ws: WaveSurfer) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center space-x-4 p-1 rounded-lg">
      <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>
      <div className="flex-grow" onClick={(e) => e.stopPropagation()}>
        <WavesurferPlayer
          dragToSeek={true}
          height={60}
          waveColor="rgba(84, 88, 171, 1)"
          url={src}
          onReady={onReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}
