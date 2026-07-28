import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

/** A running window instance on the desktop. */
export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

/** Props every Dara OS app receives. */
export interface AppProps {
  windowId: string;
}

/**
 * An installable Dara OS module. Register new modules in `src/os/registry.ts`
 * — nothing else needs to change for a new app to appear in the launcher,
 * dock and search.
 */
export interface AppModule {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  component: ComponentType<AppProps>;
  /** Default window size in px. */
  defaultSize?: { width: number; height: number };
  /** Show in the bottom dock. */
  pinned?: boolean;
  category: "system" | "productivity" | "developer";
}

export type ThemeMode = "dark" | "light";

export interface OsSettings {
  theme: ThemeMode;
  userName: string;
  reduceMotion: boolean;
  showSeconds: boolean;
  dockSize: number;
}

/** Virtual file system node. */
export interface FsNode {
  id: string;
  name: string;
  kind: "folder" | "file";
  /** File payload; folders ignore this. */
  content?: string;
  fileType?: "text" | "markdown" | "image" | "config";
  children?: FsNode[];
  size?: number;
  modified: string;
}
