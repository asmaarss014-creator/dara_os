import { useState } from "react";
import { Search } from "lucide-react";
import { apps } from "@/os/registry";
import { useOs } from "@/os/os-context";

export function Launcher() {
  const { launcherOpen, setLauncherOpen, openApp, settings } = useOs();
  const [query, setQuery] = useState("");

  if (!launcherOpen) return null;

  const results = apps.filter((a) =>
    (a.name + a.description + a.category).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="absolute inset-0 z-[9999] flex items-start justify-center bg-background/40 pt-24 backdrop-blur-sm"
      onClick={() => setLauncherOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          "w-full max-w-xl overflow-hidden rounded-2xl shadow-panel glass-panel" +
          (settings.reduceMotion ? "" : " animate-in fade-in slide-in-from-top-2 duration-150")
        }
      >
        <div className="flex items-center gap-3 border-b border-glass-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules…"
            aria-label="Search modules"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
          {results.map((app) => (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary/70"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <app.icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{app.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {app.description}
                </span>
              </span>
            </button>
          ))}
          {results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No modules found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
