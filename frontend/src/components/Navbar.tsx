import { Music } from "lucide-react";

export default function NavBar() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <a
        className="flex items-center justify-center text-reset text-decoration-none"
        href="/"
      >
        <Music className="h-6 w-6" />
        <span className="ml-2 text-lg font-semibold">beatgems</span>
      </a>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <a
          className="text-reset text-decoration-none text-sm font-medium hover-underline underline-offset-4"
          href="/#samples"
        >
          Features
        </a>
        <a
          className="text-reset text-decoration-none text-sm font-medium hover-underline underline-offset-4"
          href="/#plans"
        >
          Pricing
        </a>
        <a
          className="text-reset text-decoration-none text-sm font-medium hover-underline underline-offset-4"
          href="/soon"
        >
          About
        </a>
      </nav>
    </header>
  );
}
