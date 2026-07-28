import type { FsNode } from "./types";

/**
 * Seed of the Dara OS virtual file system. Purely in-memory today; the shape
 * maps 1:1 to a future persistence layer (cloud table or IndexedDB).
 */
export const fileSystem: FsNode = {
  id: "root",
  name: "dara",
  kind: "folder",
  modified: "2026-07-20",
  children: [
    {
      id: "documents",
      name: "Documents",
      kind: "folder",
      modified: "2026-07-24",
      children: [
        {
          id: "welcome",
          name: "welcome.md",
          kind: "file",
          fileType: "markdown",
          size: 1240,
          modified: "2026-07-24",
          content:
            "# Welcome to Dara OS\n\nDara is a lightweight, human-friendly desktop environment for the web.\n\n- Open apps from the dock or the launcher\n- Drag window title bars to move them\n- Everything is modular: add an app in src/os/registry.ts\n",
        },
        {
          id: "roadmap",
          name: "roadmap.md",
          kind: "file",
          fileType: "markdown",
          size: 860,
          modified: "2026-07-26",
          content:
            "# Roadmap\n\n1. Window manager (done)\n2. File manager concept (done)\n3. Terminal concept (done)\n4. Settings + workspace (done)\n5. Persistence layer\n6. Third-party module SDK\n",
        },
      ],
    },
    {
      id: "projects",
      name: "Projects",
      kind: "folder",
      modified: "2026-07-27",
      children: [
        {
          id: "kernel",
          name: "kernel.ts",
          kind: "file",
          fileType: "text",
          size: 2048,
          modified: "2026-07-27",
          content:
            "// Dara kernel concept\nexport const boot = () => ({ status: 'ready', modules: 5 });\n",
        },
        {
          id: "notes",
          name: "notes.txt",
          kind: "file",
          fileType: "text",
          size: 420,
          modified: "2026-07-25",
          content: "Keep it lightweight. Keep it human.",
        },
      ],
    },
    {
      id: "system",
      name: "System",
      kind: "folder",
      modified: "2026-07-18",
      children: [
        {
          id: "config",
          name: "dara.config.json",
          kind: "file",
          fileType: "config",
          size: 310,
          modified: "2026-07-18",
          content: '{\n  "name": "Dara OS",\n  "version": "0.1.0",\n  "modules": "auto"\n}',
        },
      ],
    },
    {
      id: "readme",
      name: "README.md",
      kind: "file",
      fileType: "markdown",
      size: 640,
      modified: "2026-07-28",
      content:
        "# Dara OS\n\nA modular desktop shell built with React, TypeScript and Tailwind.\nExport-ready and organised for future expansion.",
    },
  ],
};

/** Find a folder anywhere in the tree by id. */
export function findNode(node: FsNode, id: string): FsNode | undefined {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const hit = findNode(child, id);
    if (hit) return hit;
  }
  return undefined;
}

/** Build the breadcrumb path of folder ids leading to `id`. */
export function pathTo(node: FsNode, id: string, trail: FsNode[] = []): FsNode[] | undefined {
  const next = [...trail, node];
  if (node.id === id) return next;
  for (const child of node.children ?? []) {
    const hit = pathTo(child, id, next);
    if (hit) return hit;
  }
  return undefined;
}
