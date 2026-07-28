import { useEffect, useRef, useState } from "react";
import { apps } from "../registry";
import { fileSystem } from "../filesystem";
import { useOs } from "../os-context";

interface Line {
  kind: "input" | "output";
  text: string;
}

const BANNER = "Dara Shell 0.1.0 — type `help` to get started.";

export default function TerminalApp() {
  const { openApp, settings } = useOs();
  const [lines, setLines] = useState<Line[]>([{ kind: "output", text: BANNER }]);
  const [value, setValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const run = (raw: string) => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const out: string[] = [];

    switch (cmd) {
      case "":
        break;
      case "help":
        out.push(
          "Available commands:",
          "  help            show this message",
          "  ls              list files at the root of the workspace",
          "  apps            list installed modules",
          "  open <app>      launch a module by id",
          "  whoami          current session user",
          "  version         Dara OS build info",
          "  clear           clear the screen",
        );
        break;
      case "ls":
        (fileSystem.children ?? []).forEach((n) =>
          out.push(`${n.kind === "folder" ? "d" : "-"}  ${n.name}`),
        );
        break;
      case "apps":
        apps.forEach((a) => out.push(`${a.id.padEnd(12)} ${a.description}`));
        break;
      case "open": {
        const target = args[0];
        if (!target) out.push("usage: open <app-id>");
        else if (!apps.some((a) => a.id === target)) out.push(`unknown module: ${target}`);
        else {
          openApp(target);
          out.push(`launching ${target}…`);
        }
        break;
      }
      case "whoami":
        out.push(settings.userName.toLowerCase().replace(/\s+/g, "-") + "@dara");
        break;
      case "version":
        out.push("Dara OS 0.1.0 · kernel concept · React + TypeScript");
        break;
      case "clear":
        setLines([]);
        return;
      default:
        out.push(`command not found: ${cmd}`);
    }

    setLines((l) => [
      ...l,
      { kind: "input", text: raw },
      ...out.map((text) => ({ kind: "output" as const, text })),
    ]);
  };

  return (
    <div
      className="h-full overflow-auto bg-background/70 p-4 font-mono text-[13px] leading-relaxed scrollbar-thin"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div key={i} className={line.kind === "input" ? "text-foreground" : "text-muted-foreground"}>
          {line.kind === "input" && <span className="text-primary">dara ❯ </span>}
          {line.text}
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
          setValue("");
        }}
        className="flex items-center gap-2"
      >
        <span className="text-primary">dara ❯</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal input"
          className="flex-1 bg-transparent text-foreground caret-primary outline-none"
        />
      </form>
      <div ref={endRef} />
    </div>
  );
}
