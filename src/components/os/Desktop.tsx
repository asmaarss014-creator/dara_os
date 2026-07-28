import { useEffect } from "react";
import { apps } from "@/os/registry";
import { useOs } from "@/os/os-context";
import { OsWindow } from "./OsWindow";
import { TopBar } from "./TopBar";
import { Dock } from "./Dock";
import { Launcher } from "./Launcher";

export function Desktop() {
  const { windows, openApp, focusWindow, setLauncherOpen, launcherOpen } = useOs();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setLauncherOpen(!launcherOpen);
      }
      if (e.key === "Escape") setLauncherOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [launcherOpen, setLauncherOpen]);

  const minimized = windows.filter((w) => w.minimized);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden wallpaper">
      <TopBar />

      <main className="relative min-h-0 flex-1">
        {/* Desktop shortcuts */}
        <div className="absolute left-4 top-4 grid w-24 gap-2">
          {apps.slice(0, 4).map((app) => (
            <button
              key={app.id}
              onDoubleClick={() => openApp(app.id)}
              onClick={() => openApp(app.id)}
              className="flex flex-col items-center gap-1.5 rounded-lg p-2 text-center transition-colors hover:bg-glass"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-glass-border bg-glass text-primary">
                <app.icon className="h-5 w-5" />
              </span>
              <span className="text-[11px] text-foreground/80">{app.name}</span>
            </button>
          ))}
        </div>

        <p className="pointer-events-none absolute bottom-28 right-8 max-w-xs text-right text-xs text-muted-foreground">
          Press <kbd className="rounded border border-glass-border px-1">⌘</kbd>
          <kbd className="rounded border border-glass-border px-1">K</kbd> to open the launcher
        </p>

        {windows.map((w) => (
          <OsWindow key={w.id} win={w} />
        ))}

        {minimized.length > 0 && (
          <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 gap-2 rounded-xl px-2 py-1.5 glass-panel">
            {minimized.map((w) => (
              <button
                key={w.id}
                onClick={() => focusWindow(w.id)}
                className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
              >
                {w.title}
              </button>
            ))}
          </div>
        )}

        <Launcher />
        <Dock />
      </main>
    </div>
  );
}
