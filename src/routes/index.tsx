import { createFileRoute } from "@tanstack/react-router";
import { OsProvider } from "@/os/os-context";
import { Desktop } from "@/components/os/Desktop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dara OS — A Lightweight Web Desktop Environment" },
      {
        name: "description",
        content:
          "Dara OS is a modern, lightweight desktop-style interface with a window manager, file manager, terminal, workspace and settings modules.",
      },
      { property: "og:title", content: "Dara OS — A Lightweight Web Desktop Environment" },
      {
        property: "og:description",
        content:
          "Explore Dara OS: windows, files, terminal, workspace and settings in a clean, extensible web desktop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <OsProvider>
      <h1 className="sr-only">Dara OS — lightweight web desktop environment</h1>
      <Desktop />
    </OsProvider>
  );
}
