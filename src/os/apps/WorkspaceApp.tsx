import { useState } from "react";
import { Activity, Check, Cpu, HardDrive, Plus, Zap } from "lucide-react";
import { apps } from "../registry";
import { useOs } from "../os-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  label: string;
  done: boolean;
}

const INITIAL: Task[] = [
  { id: 1, label: "Sketch the Dara module SDK", done: true },
  { id: 2, label: "Design the window manager", done: true },
  { id: 3, label: "Wire persistence for the file system", done: false },
  { id: 4, label: "Draft the theming guide", done: false },
];

const METRICS = [
  { label: "Kernel load", value: 24, icon: Cpu },
  { label: "Memory", value: 41, icon: Activity },
  { label: "Storage", value: 18, icon: HardDrive },
];

export default function WorkspaceApp() {
  const { openApp, settings, windows } = useOs();
  const [tasks, setTasks] = useState(INITIAL);
  const [draft, setDraft] = useState("");

  const open = tasks.filter((t) => !t.done).length;

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-6">
        <header>
          <h2 className="text-2xl font-semibold">Good day, {settings.userName}</h2>
          <p className="text-sm text-muted-foreground">
            {open} open task{open === 1 ? "" : "s"} · {windows.length} window
            {windows.length === 1 ? "" : "s"} running
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          {METRICS.map((m) => (
            <div key={m.label} className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <m.icon className="h-3.5 w-3.5 text-primary" />
                {m.label}
              </div>
              <p className="mt-2 text-2xl font-semibold">{m.value}%</p>
              <Progress value={m.value} className="mt-2 h-1.5" />
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-border/60 bg-muted/20 p-4">
          <h3 className="mb-3 text-sm font-semibold">Today</h3>
          <div className="space-y-1">
            {tasks.map((t) => (
              <button
                key={t.id}
                onClick={() =>
                  setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))
                }
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-secondary/60"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border",
                    t.done ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {t.done && <Check className="h-3 w-3" />}
                </span>
                <span className={cn(t.done && "text-muted-foreground line-through")}>{t.label}</span>
              </button>
            ))}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              setTasks((ts) => [...ts, { id: Date.now(), label: draft.trim(), done: false }]);
              setDraft("");
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a task…"
              className="h-9"
            />
            <Button type="submit" size="sm" className="h-9">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </section>

        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Zap className="h-4 w-4 text-accent" /> Quick launch
          </h3>
          <div className="flex flex-wrap gap-2">
            {apps
              .filter((a) => a.id !== "workspace")
              .map((a) => (
                <Button key={a.id} variant="outline" size="sm" onClick={() => openApp(a.id)}>
                  <a.icon className="mr-1.5 h-4 w-4" />
                  {a.name}
                </Button>
              ))}
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}
