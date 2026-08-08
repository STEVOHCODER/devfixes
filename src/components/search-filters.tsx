"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface SearchFiltersProps {
  languages?: string[];
  frameworks?: string[];
  difficulties?: string[];
}

function getInitialRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("devfixes:recent-searches");
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
    }
  } catch {
    // localStorage error, silently fail
  }
  return [];
}

export function SearchFilters({
  languages = ["JavaScript", "Python", "TypeScript", "Java", "C#", "Go", "Rust"],
  frameworks = ["React", "Vue", "Angular", "Next.js", "Django", "FastAPI", "Spring"],
  difficulties = ["Beginner", "Intermediate", "Advanced"],
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    languages: new Set(searchParams.getAll("lang")),
    frameworks: new Set(searchParams.getAll("fw")),
    difficulties: new Set(searchParams.getAll("diff")),
  });
  const [recentSearches] = useState<string[]>(getInitialRecentSearches);

  const updateFilters = (type: keyof typeof selectedFilters, value: string) => {
    const newFilters = { ...selectedFilters };
    if (newFilters[type].has(value)) {
      newFilters[type].delete(value);
    } else {
      newFilters[type].add(value);
    }
    setSelectedFilters(newFilters);

    const params = new URLSearchParams(searchParams);
    params.delete(type === "languages" ? "lang" : type === "frameworks" ? "fw" : "diff");
    newFilters[type].forEach((v) => {
      const key = type === "languages" ? "lang" : type === "frameworks" ? "fw" : "diff";
      params.append(key, v);
    });
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedFilters({
      languages: new Set(),
      frameworks: new Set(),
      difficulties: new Set(),
    });
    router.push("/search");
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-4 rounded-md border border-line bg-surface text-[11px] font-semibold text-muted hover:text-foreground hover:border-accent transition-colors md:hidden"
      >
        <Search size={14} /> Filters <ChevronDown size={14} className={isOpen ? "rotate-180" : ""} />
      </button>

      <div className={`grid gap-4 mt-4 ${isOpen ? "block" : "hidden md:grid"} md:grid-cols-3`}>
        <FilterSection 
          title="Languages" 
          category="languages" 
          options={languages} 
          selectedFilters={selectedFilters} 
          updateFilters={(value: string) => updateFilters("languages", value)} 
        />
        <FilterSection 
          title="Frameworks" 
          category="frameworks" 
          options={frameworks} 
          selectedFilters={selectedFilters} 
          updateFilters={(value: string) => updateFilters("frameworks", value)} 
        />
        <FilterSection 
          title="Difficulty" 
          category="difficulties" 
          options={difficulties} 
          selectedFilters={selectedFilters} 
          updateFilters={(value: string) => updateFilters("difficulties", value)} 
        />
      </div>

      {(selectedFilters.languages.size > 0 || selectedFilters.frameworks.size > 0 || selectedFilters.difficulties.size > 0) && (
        <button
          onClick={clearFilters}
          className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-accent hover:text-foreground transition-colors"
        >
          <X size={12} /> Clear all filters
        </button>
      )}

      {recentSearches.length > 0 && !searchParams.get("q") && (
        <div className="mt-6 pt-6 border-t border-line">
          <h3 className="text-[10px] font-bold uppercase text-faint mb-3">Recent searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => router.push(`/search?q=${encodeURIComponent(search)}`)}
                className="px-3 py-1.5 rounded-sm bg-surface border border-line text-[10px] text-muted hover:text-foreground hover:border-accent transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  category: "languages" | "frameworks" | "difficulties";
  options: string[];
  selectedFilters: Record<string, Set<string>>;
  updateFilters: (value: string) => void;
}

function FilterSection({
  title,
  category,
  options,
  selectedFilters,
  updateFilters,
}: FilterSectionProps) {
  return (
    <div className="p-4 rounded-md border border-line bg-surface/50">
      <h3 className="text-[10px] font-bold uppercase text-accent mb-3">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={selectedFilters[category].has(option)}
              onChange={() => updateFilters(option)}
              className="w-4 h-4 rounded border-line cursor-pointer"
            />
            <span className="text-[11px] text-muted">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
