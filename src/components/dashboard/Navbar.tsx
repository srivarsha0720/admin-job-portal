import { Menu, Briefcase } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:hidden">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-foreground hover:bg-muted"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Briefcase className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-semibold">JobBoard</span>
      </div>
      <div className="w-9" />
    </header>
  );
}
