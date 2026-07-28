import { useCallback, useEffect, useRef } from "react";
import { Minus, Square, X } from "lucide-react";
import { useOs } from "@/os/os-context";
import { getApp } from "@/os/registry";
import type { WindowInstance } from "@/os/types";
import { cn } from "@/lib/utils";

export function OsWindow({ win }: { win: WindowInstance }) {
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximize, moveWindow, activeId, settings } =
    useOs();
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const app = getApp(win.appId);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!drag.current) return;
      moveWindow(
        win.id,
        Math.max(0, e.clientX - drag.current.dx),
        Math.max(0, e.clientY - drag.current.dy),
      );
    },
    [moveWindow, win.id],
  );

  useEffect(() => {
    const up = () => (drag.current = null);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", up);
    };
  }, [onPointerMove]);

  if (!app || win.minimized) return null;
  const Body = app.component;
  const active = activeId === win.id;

  return (
    <div
      role="dialog"
      aria-label={win.title}
      onPointerDown={() => focusWindow(win.id)}
      style={
        win.maximized
          ? { left: 8, top: 44, width: "calc(100% - 16px)", height: "calc(100% - 140px)", zIndex: win.zIndex }
          : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex }
      }
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-xl border shadow-window glass-panel",
        active ? "border-primary/40" : "border-glass-border",
        !settings.reduceMotion && "animate-in fade-in zoom-in-95 duration-150",
      )}
    >
      <header
        onPointerDown={(e) => {
          if (win.maximized) return;
          drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
        }}
        onDoubleClick={() => toggleMaximize(win.id)}
        className="flex h-10 shrink-0 cursor-grab items-center gap-2 border-b border-glass-border bg-secondary/40 px-3 active:cursor-grabbing"
      >
        <app.icon className="h-4 w-4 text-primary" />
        <span className="flex-1 truncate text-sm font-medium">{win.title}</span>
        <div className="flex items-center gap-1">
          <button
            aria-label="Minimize"
            onClick={() => minimizeWindow(win.id)}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label="Maximize"
            onClick={() => toggleMaximize(win.id)}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Square className="h-3 w-3" />
          </button>
          <button
            aria-label="Close"
            onClick={() => closeWindow(win.id)}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden bg-card/60">
        <Body windowId={win.id} />
      </div>
    </div>
  );
}
