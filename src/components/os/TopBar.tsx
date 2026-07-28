import { useEffect, useState } from "react";
import { Circle, Wifi } from "lucide-react";
import { useOs } from "@/os/os-context";

export function TopBar() {
  const { settings, windows, activeId } = useOs();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const active = windows.find((w) => w.id === activeId);

  return (
    <header className="flex h-9 shrink-0 items-center gap-3 border-b border-glass-border px-4 text-xs glass-panel">
      <span className="font-display text-sm font-semibold tracking-tight text-primary">Dara</span>
      <span className="text-muted-foreground">{active ? active.title : "Desktop"}</span>
      <div className="flex-1" />
      <span className="hidden items-center gap-1.5 text-muted-foreground sm:flex">
        <Circle className="h-2 w-2 fill-success text-success" />
        {settings.userName}
      </span>
      <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
      <time className="tabular-nums text-muted-foreground">
        {now
          ? now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              ...(settings.showSeconds ? { second: "2-digit" as const } : {}),
            })
          : "--:--"}
      </time>
    </header>
  );
}
