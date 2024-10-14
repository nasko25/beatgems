import { Music } from "lucide-react";
import Navbar from "./Navbar";

export default function ComingSoonMessage() {
  return (
    <div>
      <Navbar />
      <div
        id="coming-soon-msg"
        className="flex flex-col items-center justify-center w-full"
      >
        <div className="flex flex-row">
          <h3>Coming soon. Stay tuned! </h3>
          <Music className="h-8 w-8 ml-2" />
        </div>
      </div>
    </div>
  );
}
