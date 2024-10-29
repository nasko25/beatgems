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
import Song from "../components/Song";
// import { Button } from "@/components/ui/button";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";

export default function LibraryPage({
  songs = mockSongs,
  pageSize = 10,
}: {
  songs?: Song[];
  pageSize?: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [dislikes, setDislikes] = useState<Record<string, boolean>>({});

  const totalPages = Math.ceil(songs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleSongs = songs.slice(startIndex, startIndex + pageSize);

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
        <BeatsList visibleSongs={visibleSongs} />
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

// NOTE: song id should be unique!!!
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
        similarSongs: [
          {
            id: "10aa",
            name: "Island Groove",
            plays: 0,
            waveform: [],
            similarSongs: [],
          },
        ],
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
