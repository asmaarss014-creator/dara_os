import { Moon, Sun } from "lucide-react";
import { useOs } from "../os-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsApp() {
  const { settings, updateSettings } = useOs();

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-6">
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Appearance
          </h3>
          <Row title="Theme" description="Switch between the dark and light shell">
            <div className="flex gap-1 rounded-md border border-border/60 p-1">
              <Button
                size="sm"
                variant={settings.theme === "dark" ? "secondary" : "ghost"}
                onClick={() => updateSettings({ theme: "dark" })}
              >
                <Moon className="mr-1 h-3.5 w-3.5" /> Dark
              </Button>
              <Button
                size="sm"
                variant={settings.theme === "light" ? "secondary" : "ghost"}
                onClick={() => updateSettings({ theme: "light" })}
              >
                <Sun className="mr-1 h-3.5 w-3.5" /> Light
              </Button>
            </div>
          </Row>
          <Row title="Dock size" description={`Icon size — ${settings.dockSize}px`}>
            <Slider
              className="w-40"
              min={36}
              max={64}
              step={2}
              value={[settings.dockSize]}
              onValueChange={([v]) => updateSettings({ dockSize: v })}
            />
          </Row>
          <Row title="Reduce motion" description="Disable window and launcher animations">
            <Switch
              checked={settings.reduceMotion}
              onCheckedChange={(v) => updateSettings({ reduceMotion: v })}
            />
          </Row>
        </section>

        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Session
          </h3>
          <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
            <Label htmlFor="user-name" className="text-sm font-medium">
              Display name
            </Label>
            <p className="mb-2 text-xs text-muted-foreground">
              Shown in the top bar and used by the shell prompt
            </p>
            <Input
              id="user-name"
              value={settings.userName}
              onChange={(e) => updateSettings({ userName: e.target.value })}
              className="max-w-xs"
            />
          </div>
          <Row title="Show seconds" description="Display seconds in the status bar clock">
            <Switch
              checked={settings.showSeconds}
              onCheckedChange={(v) => updateSettings({ showSeconds: v })}
            />
          </Row>
        </section>

        <p className="pt-2 text-xs text-muted-foreground">
          Preferences live in memory for now. The settings store is a single context slice, ready to
          be wired to persistent storage later.
        </p>
      </div>
    </ScrollArea>
  );
}
