"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
} from "lucide-react";
import Button from "react-bootstrap/Button";
import NavBar from "../components/Navbar";
import BeatsList from "../components/BeatsList";
// import { Button } from "@/components/ui/button";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";

interface Song {
  id: string;
  name: string;
  plays: number;
  waveform: number[];
  similarSongs: Song[];
}

export default function LibraryPage({
  songs = mockSongs,
  pageSize = 10,
}: {
  songs?: Song[];
  pageSize?: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [playingSong, setPlayingSong] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [dislikes, setDislikes] = useState<Record<string, boolean>>({});

  const totalPages = Math.ceil(songs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleSongs = songs.slice(startIndex, startIndex + pageSize);

  const togglePlay = (id: string) => {
    setPlayingSong(playingSong === id ? null : id);
  };

  const handleLike = (id: string) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
    setDislikes((prev) => ({ ...prev, [id]: false }));
  };

  const handleDislike = (id: string) => {
    setDislikes((prev) => ({ ...prev, [id]: !prev[id] }));
    setLikes((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-grow overflow-auto">
        <BeatsList />
        {visibleSongs.map((song) => (
          <div
            key={song.id}
            className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4 items-center border-b border-muted hover:bg-muted/50"
          >
            <Button variant="ghost" onClick={() => togglePlay(song.id)}>
              {playingSong === song.id ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <svg className="w-auto h-12" viewBox="0 0 100 20">
              {song.waveform.map((value, index) => (
                <rect
                  key={index}
                  x={index * 2}
                  y={10 - value / 2}
                  width="1"
                  height={value}
                  fill="currentColor"
                  className="text-primary"
                />
              ))}
            </svg>
            {/* <div className="font-medium">{song.name}</div> */}
            {/* should somehow be able to indicate which beats have a very good human-created beat.
            Maybe instead of plays this number could be next to the dropdown arrow and could indicate how liked the beats originating
            from this AI beat are? Maybe like a sum => higher is better. And could be sorted based on that. */}
            <div className="text-sm text-muted-foreground">{song.plays}</div>
            <div className="flex space-x-2">
              {/* <Button
                size="sm"
                variant={likes[song.id] ? "default" : "outline"}
                onClick={() => handleLike(song.id)}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Like
              </Button>
              <Button
                size="sm"
                variant={dislikes[song.id] ? "default" : "outline"}
                onClick={() => handleDislike(song.id)}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Dislike
              </Button> */}
              <Button size="sm" variant="dark">
                Improve
              </Button>
            </div>
            {/* <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  Similar <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="mt-2 space-y-2">
                  {song.similarSongs.map((similarSong) => (
                    <li
                      key={similarSong.id}
                      className="text-sm text-muted-foreground"
                    >
                      {similarSong.name}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible> */}
          </div>
        ))}
      </main>
      <footer className="p-4 bg-card shadow-sm mt-auto">
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            variant="dark"
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

// Mock data for demonstration
const mockSongs: Song[] = [
  {
    id: "1",
    name: "Sunset Serenade",
    plays: 1234,
    waveform: Array.from({ length: 50 }, () => Math.random() * 20),
    similarSongs: [
      {
        id: "1a",
        name: "Moonlight Sonata",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
      {
        id: "1b",
        name: "Ocean Waves",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
    ],
  },
  {
    id: "2",
    name: "Urban Rhythm",
    plays: 5678,
    waveform: Array.from({ length: 50 }, () => Math.random() * 20),
    similarSongs: [
      {
        id: "2a",
        name: "City Lights",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
      {
        id: "2b",
        name: "Street Beat",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
    ],
  },
  {
    id: "3",
    name: "Acoustic Dreams",
    plays: 9012,
    waveform: Array.from({ length: 50 }, () => Math.random() * 20),
    similarSongs: [
      {
        id: "3a",
        name: "Wooden Melodies",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
      {
        id: "3b",
        name: "Unplugged Journey",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
    ],
  },
  {
    id: "4",
    name: "Electronic Pulse",
    plays: 3456,
    waveform: Array.from({ length: 50 }, () => Math.random() * 20),
    similarSongs: [
      {
        id: "4a",
        name: "Synth Wave",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
      {
        id: "4b",
        name: "Digital Dreams",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
    ],
  },
  {
    id: "5",
    name: "Jazz Fusion",
    plays: 7890,
    waveform: Array.from({ length: 50 }, () => Math.random() * 20),
    similarSongs: [
      {
        id: "5a",
        name: "Smooth Sax",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
      {
        id: "5b",
        name: "Trumpet Tales",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
    ],
  },
  {
    id: "6",
    name: "Classical Overture",
    plays: 2345,
    waveform: Array.from({ length: 50 }, () => Math.random() * 20),
    similarSongs: [
      {
        id: "6a",
        name: "Symphony No. 5",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
      {
        id: "6b",
        name: "Baroque Concerto",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
    ],
  },
  {
    id: "7",
    name: "Rock Anthem",
    plays: 6789,
    waveform: Array.from({ length: 50 }, () => Math.random() * 20),
    similarSongs: [
      {
        id: "7a",
        name: "Guitar Solo",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
      {
        id: "7b",
        name: "Drum Beats",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
    ],
  },
  {
    id: "8",
    name: "Pop Sensation",
    plays: 8901,
    waveform: Array.from({ length: 50 }, () => Math.random() * 20),
    similarSongs: [
      {
        id: "8a",
        name: "Catchy Chorus",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
      {
        id: "8b",
        name: "Dance Remix",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
    ],
  },
  {
    id: "9",
    name: "Country Roads",
    plays: 3456,
    waveform: Array.from({ length: 50 }, () => Math.random() * 20),
    similarSongs: [
      {
        id: "9a",
        name: "Banjo Ballad",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
      {
        id: "9b",
        name: "Fiddle Frenzy",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
    ],
  },
  {
    id: "10",
    name: "Reggae Vibes",
    plays: 7890,
    waveform: Array.from({ length: 50 }, () => Math.random() * 20),
    similarSongs: [
      {
        id: "10a",
        name: "Island Groove",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
      {
        id: "10b",
        name: "Dub Echoes",
        plays: 0,
        waveform: [],
        similarSongs: [],
      },
    ],
  },
];
