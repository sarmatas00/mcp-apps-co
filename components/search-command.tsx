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
import { searchApps, getCategories } from "@/lib/supabase/client";

interface App {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: { name: string; slug: string } | null;
  compatibility_claude: boolean;
  compatibility_chatgpt: boolean;
  compatibility_vscode: boolean;
  compatibility_goose: boolean;
}

const popularSearches = [
  "filesystem",
  "github",
  "database",
  "search",
  "notion",
  "slack",
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
  const [results, setResults] = React.useState<App[]>([]);
  const [categories, setCategories] = React.useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [loading, setLoading] = React.useState(false);
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

  // Load categories on mount
  React.useEffect(() => {
    async function loadCategories() {
      const cats = await getCategories();
      setCategories(
        cats.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      );
    }
    if (open) {
      loadCategories();
    }
  }, [open]);

  // Search when query changes
  React.useEffect(() => {
    async function doSearch() {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      const apps = await searchApps(query);
      setResults(apps as App[]);
      setLoading(false);
    }

    const timeout = setTimeout(doSearch, 150);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (slug: string) => {
    setOpen(false);
    router.push(`/app/${slug}`);
  };

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
            {loading ? "Searching..." : "No apps found."}
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
                {categories.slice(0, 5).map((category) => (
                  <CommandItem
                    key={category.slug}
                    onSelect={() => {
                      setOpen(false);
                      router.push(`/category/${category.slug}`);
                    }}
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

          {results.length > 0 && (
            <CommandGroup heading="Apps" className="text-[#666]">
              {results.map((app) => (
                <CommandItem
                  key={app.id}
                  onSelect={() => handleSelect(app.slug)}
                  className="flex items-start gap-3 py-3 hover:bg-[#1a1a1a] cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{app.name}</span>
                      <span className="text-[10px] text-[#dc2626] uppercase tracking-wide">
                        {formatCategory(app.category?.slug || "")}
                      </span>
                    </div>
                    <p className="text-xs text-[#888] truncate">
                      {app.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {app.compatibility_claude && (
                        <span className="text-[#555]" title="Works with Claude">
                          {getClientIcon("claude")}
                        </span>
                      )}
                      {app.compatibility_chatgpt && (
                        <span
                          className="text-[#555]"
                          title="Works with ChatGPT"
                        >
                          {getClientIcon("chatgpt")}
                        </span>
                      )}
                      {app.compatibility_vscode && (
                        <span
                          className="text-[#555]"
                          title="Works with VS Code"
                        >
                          {getClientIcon("vscode")}
                        </span>
                      )}
                      {app.compatibility_goose && (
                        <span className="text-[#555]" title="Works with Goose">
                          {getClientIcon("goose")}
                        </span>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
