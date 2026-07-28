import { LayoutGrid } from "lucide-react";
import { apps } from "@/os/registry";
import { useOs } from "@/os/os-context";
import { cn } from "@/lib/utils";

export function Dock() {
  const { openApp, windows, settings, setLauncherOpen, launcherOpen } = useOs();
  const pinned = apps.filter((a) => a.pinned);
  const size = settings.dockSize;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
      <div className="pointer-events-auto flex items-end gap-2 rounded-2xl px-3 py-2 shadow-panel glass-panel">
        <button
          aria-label="Open launcher"
          onClick={() => setLauncherOpen(!launcherOpen)}
          style={{ width: size, height: size }}
          className={cn(
            "flex items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform hover:-translate-y-1",
            launcherOpen && "bg-primary/30",
          )}
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
        <div className="mx-1 h-8 w-px self-center bg-glass-border" />
        {pinned.map((app) => {
          const running = windows.some((w) => w.appId === app.id);
          return (
            <button
              key={app.id}
              title={app.name}
              aria-label={app.name}
              onClick={() => openApp(app.id)}
              style={{ width: size, height: size }}
              className="relative flex items-center justify-center rounded-xl bg-secondary/60 text-foreground transition-transform hover:-translate-y-1 hover:bg-secondary"
            >
              <app.icon className="h-5 w-5" />
              {running && (
                <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary" aria-hidden />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
