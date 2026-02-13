"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Search,
  Sparkles,
  Code,
  MessageCircle,
  Bird,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface App {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  compatibility: {
    claude: boolean;
    chatgpt: boolean;
    vscode: boolean;
    goose: boolean;
  };
}

const sampleApps: App[] = [
  {
    id: "1",
    slug: "interactive-charts",
    name: "Interactive Charts",
    description: "Beautiful data visualizations for AI conversations",
    category: "data-visualization",
    compatibility: { claude: true, chatgpt: true, vscode: false, goose: true },
  },
  {
    id: "2",
    slug: "code-review-assistant",
    name: "Code Review Assistant",
    description: "Intelligent code reviews with inline comments",
    category: "developer-tools",
    compatibility: { claude: true, chatgpt: true, vscode: true, goose: true },
  },
  {
    id: "3",
    slug: "mind-map-canvas",
    name: "Mind Map Canvas",
    description: "Create and collaborate on mind maps",
    category: "productivity",
    compatibility: { claude: true, chatgpt: false, vscode: false, goose: true },
  },
  {
    id: "4",
    slug: "sql-query-builder",
    name: "SQL Query Builder",
    description: "Visual SQL query builder",
    category: "developer-tools",
    compatibility: { claude: true, chatgpt: true, vscode: true, goose: false },
  },
  {
    id: "5",
    slug: "markdown-preview-pro",
    name: "Markdown Preview Pro",
    description: "Advanced markdown renderer",
    category: "productivity",
    compatibility: { claude: true, chatgpt: true, vscode: true, goose: true },
  },
  {
    id: "6",
    slug: "api-tester",
    name: "API Tester",
    description: "Test and debug APIs",
    category: "developer-tools",
    compatibility: { claude: true, chatgpt: false, vscode: true, goose: false },
  },
];

const popularSearches = [
  "charts",
  "code review",
  "markdown",
  "sql",
  "mind map",
  "api",
];

const categories = [
  { id: "data-visualization", name: "Data Visualization" },
  { id: "developer-tools", name: "Developer Tools" },
  { id: "productivity", name: "Productivity" },
];

function getClientIcon(client: string) {
  const icons: Record<string, React.ReactNode> = {
    claude: <Sparkles className="w-3 h-3" />,
    chatgpt: <MessageCircle className="w-3 h-3" />,
    vscode: <Code className="w-3 h-3" />,
    goose: <Bird className="w-3 h-3" />,
  };
  return icons[client] || null;
}

function formatCategory(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (slug: string) => {
    setOpen(false);
    router.push(`/app/${slug}`);
  };

  const filteredApps = React.useMemo(() => {
    if (!query) return sampleApps;
    const lowerQuery = query.toLowerCase();
    return sampleApps.filter(
      (app) =>
        app.name.toLowerCase().includes(lowerQuery) ||
        app.description.toLowerCase().includes(lowerQuery) ||
        app.category.toLowerCase().includes(lowerQuery),
    );
  }, [query]);

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 text-left",
          "bg-[#1a1a1a] border border-[#333] hover:border-[#555]",
          "transition-colors w-full sm:w-[400px]",
        )}
      >
        <Search className="w-4 h-4 text-[#666]" />
        <span className="flex-1 text-sm text-[#666]">Search apps...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-[#666] border border-[#333]">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search apps, categories, or clients..."
          value={query}
          onValueChange={setQuery}
          className="border-b border-[#333] bg-transparent text-white placeholder:text-[#666]"
        />
        <CommandList className="bg-[#111] text-white">
          <CommandEmpty className="py-6 text-center text-[#666]">
            No apps found.
          </CommandEmpty>

          {!query && (
            <>
              <CommandGroup heading="Popular Searches" className="text-[#666]">
                {popularSearches.map((search) => (
                  <CommandItem
                    key={search}
                    onSelect={() => setQuery(search)}
                    className="text-[#aaa] hover:bg-[#1a1a1a] cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 mr-2 text-[#666]" />
                    {search}
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator className="bg-[#333]" />

              <CommandGroup heading="Categories" className="text-[#666]">
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    onSelect={() => setQuery(category.name)}
                    className="text-[#aaa] hover:bg-[#1a1a1a] cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mr-2 text-[#666]" />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator className="bg-[#333]" />
            </>
          )}

          <CommandGroup heading="Apps" className="text-[#666]">
            {filteredApps.map((app) => (
              <CommandItem
                key={app.id}
                onSelect={() => handleSelect(app.slug)}
                className="flex items-start gap-3 py-3 hover:bg-[#1a1a1a] cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{app.name}</span>
                    <span className="text-[10px] text-[#dc2626] uppercase tracking-wide">
                      {formatCategory(app.category)}
                    </span>
                  </div>
                  <p className="text-xs text-[#888] truncate">
                    {app.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {Object.entries(app.compatibility).map(
                      ([client, supported]) =>
                        supported ? (
                          <span
                            key={client}
                            className="text-[#555]"
                            title={`Works with ${client}`}
                          >
                            {getClientIcon(client)}
                          </span>
                        ) : null,
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
