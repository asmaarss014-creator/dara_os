import { useState } from "react";
import { ChevronRight, File, FileCode, FileJson, FileText, Folder } from "lucide-react";
import { fileSystem, findNode, pathTo } from "../filesystem";
import type { FsNode } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function iconFor(node: FsNode) {
  if (node.kind === "folder") return Folder;
  if (node.fileType === "config") return FileJson;
  if (node.fileType === "markdown") return FileText;
  if (node.name.endsWith(".ts") || node.name.endsWith(".tsx")) return FileCode;
  return File;
}

export default function FilesApp() {
  const [folderId, setFolderId] = useState("root");
  const [selected, setSelected] = useState<FsNode | null>(null);

  const folder = findNode(fileSystem, folderId) ?? fileSystem;
  const trail = pathTo(fileSystem, folderId) ?? [fileSystem];
  const children = folder.children ?? [];

  return (
    <div className="flex h-full">
      <aside className="hidden w-48 shrink-0 border-r border-border/60 bg-muted/30 p-3 sm:block">
        <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Places
        </p>
        {(fileSystem.children ?? [])
          .filter((c) => c.kind === "folder")
          .map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setFolderId(c.id);
                setSelected(null);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                folderId === c.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
              )}
            >
              <Folder className="h-4 w-4" />
              {c.name}
            </button>
          ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1 border-b border-border/60 px-4 py-2 text-xs text-muted-foreground">
          {trail.map((n, i) => (
            <span key={n.id} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              <button
                className="rounded px-1 py-0.5 hover:text-foreground"
                onClick={() => {
                  setFolderId(n.id);
                  setSelected(null);
                }}
              >
                {n.name}
              </button>
            </span>
          ))}
        </div>

        <div className="flex min-h-0 flex-1">
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-3">
              {children.map((node) => {
                const Icon = iconFor(node);
                return (
                  <button
                    key={node.id}
                    onDoubleClick={() => node.kind === "folder" && setFolderId(node.id)}
                    onClick={() => setSelected(node.kind === "file" ? node : null)}
                    className={cn(
                      "group flex flex-col items-start gap-2 rounded-lg border border-transparent p-3 text-left transition-colors",
                      selected?.id === node.id
                        ? "border-primary/40 bg-primary/10"
                        : "hover:border-border hover:bg-secondary/50",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        node.kind === "folder" ? "text-accent" : "text-primary",
                      )}
                    />
                    <span className="truncate text-sm font-medium">{node.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {node.kind === "folder"
                        ? `${node.children?.length ?? 0} items`
                        : `${node.size ?? 0} B`}
                    </span>
                  </button>
                );
              })}
              {children.length === 0 && (
                <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                  This folder is empty.
                </p>
              )}
            </div>
          </ScrollArea>

          {selected && (
            <aside className="hidden w-72 shrink-0 border-l border-border/60 bg-muted/20 md:block">
              <div className="border-b border-border/60 px-4 py-3">
                <p className="truncate text-sm font-semibold">{selected.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Modified {selected.modified} · {selected.size ?? 0} B
                </p>
              </div>
              <ScrollArea className="h-[calc(100%-3.5rem)]">
                <pre className="whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-muted-foreground">
                  {selected.content ?? "No preview available."}
                </pre>
              </ScrollArea>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
