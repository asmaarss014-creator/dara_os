import { FolderOpen, TerminalSquare, Settings, LayoutGrid, Info } from "lucide-react";
import type { AppModule } from "./types";
import FilesApp from "./apps/FilesApp";
import TerminalApp from "./apps/TerminalApp";
import SettingsApp from "./apps/SettingsApp";
import WorkspaceApp from "./apps/WorkspaceApp";
import AboutApp from "./apps/AboutApp";

/**
 * Dara OS module registry.
 * Add an entry here and the app instantly appears in the dock, launcher
 * and search. This is the single extension point of the system.
 */
export const apps: AppModule[] = [
  {
    id: "workspace",
    name: "Workspace",
    description: "Your daily overview: tasks, activity and system pulse",
    icon: LayoutGrid,
    component: WorkspaceApp,
    defaultSize: { width: 860, height: 560 },
    pinned: true,
    category: "productivity",
  },
  {
    id: "files",
    name: "Files",
    description: "Browse and preview the Dara virtual file system",
    icon: FolderOpen,
    component: FilesApp,
    defaultSize: { width: 880, height: 540 },
    pinned: true,
    category: "system",
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "Talk to the Dara shell with a small built-in command set",
    icon: TerminalSquare,
    component: TerminalApp,
    defaultSize: { width: 720, height: 460 },
    pinned: true,
    category: "developer",
  },
  {
    id: "settings",
    name: "Settings",
    description: "Appearance, profile and system preferences",
    icon: Settings,
    component: SettingsApp,
    defaultSize: { width: 700, height: 520 },
    pinned: true,
    category: "system",
  },
  {
    id: "about",
    name: "About Dara",
    description: "Architecture, modules and version information",
    icon: Info,
    component: AboutApp,
    defaultSize: { width: 640, height: 480 },
    pinned: false,
    category: "system",
  },
];

export const getApp = (id: string) => apps.find((a) => a.id === id);
