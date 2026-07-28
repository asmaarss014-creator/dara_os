import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getApp } from "./registry";
import type { OsSettings, WindowInstance } from "./types";

interface OsContextValue {
  windows: WindowInstance[];
  activeId: string | null;
  settings: OsSettings;
  launcherOpen: boolean;
  setLauncherOpen: (open: boolean) => void;
  openApp: (appId: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  updateSettings: (patch: Partial<OsSettings>) => void;
}

const OsContext = createContext<OsContextValue | null>(null);

const DEFAULT_SETTINGS: OsSettings = {
  theme: "dark",
  userName: "Explorer",
  reduceMotion: false,
  showSeconds: false,
  dockSize: 48,
};

let seq = 0;

export function OsProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const zRef = useRef(10);
  const [settings, setSettings] = useState<OsSettings>(DEFAULT_SETTINGS);
  const [launcherOpen, setLauncherOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", settings.theme === "light");
  }, [settings.theme]);

  const focusWindow = useCallback((id: string) => {
    const next = ++zRef.current;
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, zIndex: next, minimized: false } : w)),
    );
    setActiveId(id);
  }, []);

  const openApp = useCallback(
    (appId: string) => {
      const app = getApp(appId);
      if (!app) return;
      setLauncherOpen(false);
      const existing = windows.find((w) => w.appId === appId);
      if (existing) {
        focusWindow(existing.id);
        return;
      }
      const size = app.defaultSize ?? { width: 780, height: 520 };
      const offset = (seq++ % 6) * 26;
      const id = `${appId}-${Date.now()}-${seq}`;
      const next = ++zRef.current;
      setWindows((ws) =>
        ws.some((w) => w.appId === appId)
          ? ws
          : [
              ...ws,
              {
                id,
                appId,
                title: app.name,
                x: 90 + offset,
                y: 70 + offset,
                width: size.width,
                height: size.height,
                zIndex: next,
                minimized: false,
                maximized: false,
              },
            ],
      );
      setActiveId(id);
    },
    [windows, focusWindow],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)));
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resizeWindow = useCallback((id: string, width: number, height: number) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, width, height } : w)));
  }, []);

  const updateSettings = useCallback((patch: Partial<OsSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const value = useMemo<OsContextValue>(
    () => ({
      windows,
      activeId,
      settings,
      launcherOpen,
      setLauncherOpen,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      toggleMaximize,
      moveWindow,
      resizeWindow,
      updateSettings,
    }),
    [
      windows,
      activeId,
      settings,
      launcherOpen,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      toggleMaximize,
      moveWindow,
      resizeWindow,
      updateSettings,
    ],
  );

  return <OsContext.Provider value={value}>{children}</OsContext.Provider>;
}

export function useOs() {
  const ctx = useContext(OsContext);
  if (!ctx) throw new Error("useOs must be used inside <OsProvider>");
  return ctx;
}
