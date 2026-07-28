import { apps } from "../registry";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const LAYERS = [
  { name: "Shell", detail: "Desktop, window manager, dock, launcher" },
  { name: "Modules", detail: "Self-contained apps registered in one place" },
  { name: "Core", detail: "Session state, settings, virtual file system" },
  { name: "Design system", detail: "Semantic tokens in src/styles.css" },
];

export default function AboutApp() {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-2xl font-semibold">Dara OS</h2>
          <p className="text-sm text-muted-foreground">
            Version 0.1.0 · a lightweight, human-friendly desktop for the web
          </p>
        </div>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Architecture
          </h3>
          <div className="space-y-2">
            {LAYERS.map((l) => (
              <div key={l.name} className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <p className="text-sm font-medium">{l.name}</p>
                <p className="text-xs text-muted-foreground">{l.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Installed modules ({apps.length})
          </h3>
          <div className="space-y-2">
            {apps.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg px-2 py-2">
                <a.icon className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.description}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  {a.category}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-muted-foreground">
          Extending Dara: create a component in <code>src/os/apps</code> and add an entry to{" "}
          <code>src/os/registry.ts</code>. The dock, launcher and search pick it up automatically.
        </p>
      </div>
    </ScrollArea>
  );
}
