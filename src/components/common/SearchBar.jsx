import { Search } from "lucide-react";

export function SearchBar({ placeholder = "Search farmers, villages, reports..." }) {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pulse-muted" />
      <input
        className="h-10 w-full rounded-md border border-pulse-border bg-slate-950 pl-10 pr-3 text-sm text-pulse-text outline-none transition placeholder:text-slate-600 focus:border-pulse-primary"
        placeholder={placeholder}
      />
    </div>
  );
}
