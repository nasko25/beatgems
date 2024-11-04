"use client";

import { useEffect, useState } from "react";
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
  pageSize = 10,
}: {
  songs?: Song[];
  pageSize?: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [dislikes, setDislikes] = useState<Record<string, boolean>>({});
  const [songs, setSongs] = useState<Song[]>([]);

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

  // fetch song info
  useEffect(() => {
    // TODO: url
    fetch("http://localhost:8080/songs").then(async (response) =>
      setSongs(await response.json())
    );
  }, []);

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
            variant="dark"
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
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
