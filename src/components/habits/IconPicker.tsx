"use client";

import { useState, useEffect, useMemo } from "react";
import {
  // Fitness & Exercise
  Dumbbell, Heart, Footprints, Bike, PersonStanding, Timer, Flame, Activity,
  // Health & Wellness
  Apple, Salad, Droplets, Moon, Sun, Bed, Brain, Smile, Sparkles,
  // Productivity & Work
  BookOpen, Pencil, Target, Clock, Calendar, CheckSquare, ListTodo, Briefcase,
  // Learning & Education
  GraduationCap, Lightbulb, Languages, Code, Music, Palette, Camera,
  // Mindfulness & Meditation
  Wind, Leaf, TreePine, Mountain, Sunrise, CloudSun, Star, Gem,
  // Social & Communication
  Users, MessageCircle, Phone, Mail, Share2, HandHeart, Gift,
  // Finance & Money
  DollarSign, PiggyBank, TrendingUp, Wallet, CreditCard, Calculator,
  // Home & Lifestyle
  Home, Coffee, UtensilsCrossed, ShoppingCart, Shirt, Trash2, Recycle,
  // Technology
  Smartphone, Laptop, Wifi, Battery, Zap, Settings, Shield,
  // Travel & Outdoors
  Map, Compass, Car, Plane, Tent, Globe, Anchor,
  // Misc
  Award, Trophy, Medal, Crown, Flag, Rocket, Puzzle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Icon categories for organization
const iconCategories = {
  "Fitness & Exercise": [
    { name: "Dumbbell", icon: Dumbbell, keywords: ["gym", "workout", "exercise", "lift", "strength", "weights", "fitness"] },
    { name: "Heart", icon: Heart, keywords: ["cardio", "health", "love", "run", "heart rate"] },
    { name: "Footprints", icon: Footprints, keywords: ["walk", "steps", "running", "hiking", "move"] },
    { name: "Bike", icon: Bike, keywords: ["cycling", "bicycle", "ride", "commute"] },
    { name: "PersonStanding", icon: PersonStanding, keywords: ["stretch", "yoga", "posture", "standing"] },
    { name: "Timer", icon: Timer, keywords: ["hiit", "interval", "time", "workout"] },
    { name: "Flame", icon: Flame, keywords: ["calories", "burn", "hot", "streak", "fire"] },
    { name: "Activity", icon: Activity, keywords: ["exercise", "pulse", "active", "movement"] },
  ],
  "Health & Wellness": [
    { name: "Apple", icon: Apple, keywords: ["eat", "fruit", "healthy", "nutrition", "diet"] },
    { name: "Salad", icon: Salad, keywords: ["vegetables", "healthy eating", "diet", "greens"] },
    { name: "Droplets", icon: Droplets, keywords: ["water", "hydrate", "drink", "hydration"] },
    { name: "Moon", icon: Moon, keywords: ["sleep", "night", "rest", "bedtime"] },
    { name: "Sun", icon: Sun, keywords: ["morning", "wake", "sunlight", "vitamin d"] },
    { name: "Bed", icon: Bed, keywords: ["sleep", "rest", "nap", "bedtime"] },
    { name: "Brain", icon: Brain, keywords: ["think", "mental", "mind", "cognitive", "focus"] },
    { name: "Smile", icon: Smile, keywords: ["happy", "mood", "gratitude", "positive"] },
    { name: "Sparkles", icon: Sparkles, keywords: ["skincare", "glow", "self-care", "beauty"] },
  ],
  "Productivity & Work": [
    { name: "BookOpen", icon: BookOpen, keywords: ["read", "study", "learn", "book", "reading"] },
    { name: "Pencil", icon: Pencil, keywords: ["write", "journal", "notes", "writing", "draw"] },
    { name: "Target", icon: Target, keywords: ["goal", "focus", "aim", "objective"] },
    { name: "Clock", icon: Clock, keywords: ["time", "schedule", "routine", "morning"] },
    { name: "Calendar", icon: Calendar, keywords: ["plan", "schedule", "organize", "daily"] },
    { name: "CheckSquare", icon: CheckSquare, keywords: ["task", "todo", "complete", "check"] },
    { name: "ListTodo", icon: ListTodo, keywords: ["tasks", "list", "organize", "plan"] },
    { name: "Briefcase", icon: Briefcase, keywords: ["work", "job", "career", "professional"] },
  ],
  "Learning & Education": [
    { name: "GraduationCap", icon: GraduationCap, keywords: ["study", "learn", "education", "school", "course"] },
    { name: "Lightbulb", icon: Lightbulb, keywords: ["idea", "creative", "think", "learn"] },
    { name: "Languages", icon: Languages, keywords: ["language", "speak", "duolingo", "foreign"] },
    { name: "Code", icon: Code, keywords: ["programming", "coding", "developer", "tech"] },
    { name: "Music", icon: Music, keywords: ["practice", "instrument", "piano", "guitar", "sing"] },
    { name: "Palette", icon: Palette, keywords: ["art", "draw", "paint", "creative"] },
    { name: "Camera", icon: Camera, keywords: ["photo", "photography", "picture", "shoot"] },
  ],
  "Mindfulness & Meditation": [
    { name: "Wind", icon: Wind, keywords: ["breathe", "breathing", "meditation", "calm", "relax"] },
    { name: "Leaf", icon: Leaf, keywords: ["nature", "plant", "green", "eco", "garden"] },
    { name: "TreePine", icon: TreePine, keywords: ["nature", "outdoors", "forest", "hike"] },
    { name: "Mountain", icon: Mountain, keywords: ["climb", "hike", "challenge", "outdoors"] },
    { name: "Sunrise", icon: Sunrise, keywords: ["morning", "wake", "early", "routine"] },
    { name: "CloudSun", icon: CloudSun, keywords: ["weather", "outside", "walk", "fresh air"] },
    { name: "Star", icon: Star, keywords: ["gratitude", "wish", "goal", "dream", "achieve"] },
    { name: "Gem", icon: Gem, keywords: ["valuable", "precious", "self-worth", "special"] },
  ],
  "Social & Communication": [
    { name: "Users", icon: Users, keywords: ["social", "friends", "group", "team", "people"] },
    { name: "MessageCircle", icon: MessageCircle, keywords: ["chat", "talk", "communicate", "call"] },
    { name: "Phone", icon: Phone, keywords: ["call", "contact", "reach out", "family"] },
    { name: "Mail", icon: Mail, keywords: ["email", "write", "correspond", "message"] },
    { name: "Share2", icon: Share2, keywords: ["share", "social", "post", "connect"] },
    { name: "HandHeart", icon: HandHeart, keywords: ["volunteer", "help", "charity", "give"] },
    { name: "Gift", icon: Gift, keywords: ["give", "present", "kindness", "surprise"] },
  ],
  "Finance & Money": [
    { name: "DollarSign", icon: DollarSign, keywords: ["money", "save", "budget", "finance", "spend"] },
    { name: "PiggyBank", icon: PiggyBank, keywords: ["save", "savings", "money", "budget"] },
    { name: "TrendingUp", icon: TrendingUp, keywords: ["invest", "grow", "stocks", "progress"] },
    { name: "Wallet", icon: Wallet, keywords: ["money", "spend", "budget", "cash"] },
    { name: "CreditCard", icon: CreditCard, keywords: ["spend", "pay", "purchase", "track"] },
    { name: "Calculator", icon: Calculator, keywords: ["budget", "calculate", "finance", "math"] },
  ],
  "Home & Lifestyle": [
    { name: "Home", icon: Home, keywords: ["clean", "organize", "house", "chores"] },
    { name: "Coffee", icon: Coffee, keywords: ["morning", "caffeine", "wake", "routine", "limit"] },
    { name: "UtensilsCrossed", icon: UtensilsCrossed, keywords: ["cook", "meal", "food", "kitchen"] },
    { name: "ShoppingCart", icon: ShoppingCart, keywords: ["shop", "groceries", "buy", "list"] },
    { name: "Shirt", icon: Shirt, keywords: ["laundry", "clothes", "dress", "outfit"] },
    { name: "Trash2", icon: Trash2, keywords: ["declutter", "clean", "remove", "organize"] },
    { name: "Recycle", icon: Recycle, keywords: ["eco", "environment", "green", "sustainable"] },
  ],
  "Technology": [
    { name: "Smartphone", icon: Smartphone, keywords: ["phone", "screen time", "limit", "digital"] },
    { name: "Laptop", icon: Laptop, keywords: ["computer", "work", "screen", "code"] },
    { name: "Wifi", icon: Wifi, keywords: ["disconnect", "offline", "digital detox"] },
    { name: "Battery", icon: Battery, keywords: ["energy", "recharge", "rest", "power"] },
    { name: "Zap", icon: Zap, keywords: ["energy", "power", "quick", "fast", "electric"] },
    { name: "Settings", icon: Settings, keywords: ["adjust", "optimize", "configure", "routine"] },
    { name: "Shield", icon: Shield, keywords: ["protect", "secure", "safe", "defense"] },
  ],
  "Travel & Outdoors": [
    { name: "Map", icon: Map, keywords: ["explore", "travel", "adventure", "navigate"] },
    { name: "Compass", icon: Compass, keywords: ["direction", "navigate", "explore", "adventure"] },
    { name: "Car", icon: Car, keywords: ["drive", "commute", "travel", "transport"] },
    { name: "Plane", icon: Plane, keywords: ["travel", "fly", "trip", "vacation"] },
    { name: "Tent", icon: Tent, keywords: ["camp", "outdoor", "adventure", "nature"] },
    { name: "Globe", icon: Globe, keywords: ["world", "travel", "explore", "global"] },
    { name: "Anchor", icon: Anchor, keywords: ["stability", "grounded", "steady", "boat"] },
  ],
  "Achievement": [
    { name: "Award", icon: Award, keywords: ["achievement", "win", "success", "prize"] },
    { name: "Trophy", icon: Trophy, keywords: ["win", "champion", "goal", "first"] },
    { name: "Medal", icon: Medal, keywords: ["achievement", "award", "win", "compete"] },
    { name: "Crown", icon: Crown, keywords: ["king", "queen", "best", "top", "leader"] },
    { name: "Flag", icon: Flag, keywords: ["goal", "milestone", "checkpoint", "finish"] },
    { name: "Rocket", icon: Rocket, keywords: ["launch", "start", "fast", "growth", "boost"] },
    { name: "Puzzle", icon: Puzzle, keywords: ["solve", "think", "game", "challenge", "brain"] },
  ],
};

// Flatten all icons for searching
const allIcons = Object.entries(iconCategories).flatMap(([category, icons]) =>
  icons.map((icon) => ({ ...icon, category }))
);

// AI-like icon suggestion based on habit name
function suggestIcons(habitName: string): typeof allIcons {
  if (!habitName.trim()) return [];

  const searchTerms = habitName.toLowerCase().split(/\s+/);

  // Score each icon based on keyword matches
  const scored = allIcons.map((icon) => {
    let score = 0;
    const iconNameLower = icon.name.toLowerCase();
    const keywordsLower = icon.keywords.map((k) => k.toLowerCase());

    for (const term of searchTerms) {
      // Exact name match (highest priority)
      if (iconNameLower === term) score += 100;
      // Name contains term
      else if (iconNameLower.includes(term)) score += 50;
      // Exact keyword match
      else if (keywordsLower.includes(term)) score += 30;
      // Keyword contains term
      else if (keywordsLower.some((k) => k.includes(term))) score += 15;
      // Term contains keyword (partial match)
      else if (keywordsLower.some((k) => term.includes(k) && k.length > 2)) score += 10;
    }

    return { ...icon, score };
  });

  // Return top matches sorted by score
  return scored
    .filter((icon) => icon.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  habitName?: string;
}

export function IconPicker({ value, onChange, habitName = "" }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get AI suggestions based on habit name
  const suggestions = useMemo(() => suggestIcons(habitName), [habitName]);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!search.trim()) return allIcons;
    const searchLower = search.toLowerCase();
    return allIcons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(searchLower) ||
        icon.keywords.some((k) => k.toLowerCase().includes(searchLower)) ||
        icon.category.toLowerCase().includes(searchLower)
    );
  }, [search]);

  // Get the selected icon component
  const SelectedIcon = useMemo(() => {
    const found = allIcons.find((i) => i.name === value);
    return found?.icon || CheckSquare;
  }, [value]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-icon-picker]")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" data-icon-picker>
      {/* Selected icon button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-2 flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm text-gray-900 transition hover:border-slate-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-orange-100">
          <SelectedIcon className="h-5 w-5 text-amber-600" />
        </div>
        <span className="flex-1">{value || "Select an icon"}</span>
        <span className="text-slate-400">Click to change</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[400px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          {/* Search */}
          <div className="border-b border-slate-100 p-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              autoFocus
            />
          </div>

          <div className="max-h-[320px] overflow-y-auto p-3">
            {/* AI Suggestions */}
            {suggestions.length > 0 && !search && (
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold text-slate-600">Suggested for "{habitName}"</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {suggestions.map((icon) => {
                    const Icon = icon.icon;
                    return (
                      <button
                        key={`suggestion-${icon.name}`}
                        type="button"
                        onClick={() => {
                          onChange(icon.name);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-xl p-3 text-xs transition hover:bg-amber-50",
                          value === icon.name && "bg-amber-100 ring-2 ring-amber-500"
                        )}
                      >
                        <Icon className="h-6 w-6 text-amber-600" />
                        <span className="truncate text-slate-600">{icon.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search Results or Categories */}
            {search ? (
              <div>
                <div className="mb-2 text-xs font-semibold text-slate-600">
                  {filteredIcons.length} results
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {filteredIcons.map((icon) => {
                    const Icon = icon.icon;
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => {
                          onChange(icon.name);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-xl p-3 text-xs transition hover:bg-slate-50",
                          value === icon.name && "bg-amber-100 ring-2 ring-amber-500"
                        )}
                      >
                        <Icon className="h-6 w-6 text-slate-600" />
                        <span className="truncate text-slate-600">{icon.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(iconCategories).map(([category, icons]) => (
                  <div key={category}>
                    <button
                      type="button"
                      onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                      className="mb-2 flex w-full items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      <span>{category}</span>
                      <span className="text-slate-400">{icons.length}</span>
                    </button>
                    {(activeCategory === category || activeCategory === null) && (
                      <div className="grid grid-cols-4 gap-2">
                        {icons.slice(0, activeCategory === category ? undefined : 4).map((icon) => {
                          const Icon = icon.icon;
                          return (
                            <button
                              key={icon.name}
                              type="button"
                              onClick={() => {
                                onChange(icon.name);
                                setIsOpen(false);
                              }}
                              className={cn(
                                "flex flex-col items-center gap-1 rounded-xl p-3 text-xs transition hover:bg-slate-50",
                                value === icon.name && "bg-amber-100 ring-2 ring-amber-500"
                              )}
                            >
                              <Icon className="h-6 w-6 text-slate-600" />
                              <span className="truncate text-slate-600">{icon.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to get icon component by name
export function getIconByName(name: string): LucideIcon {
  const found = allIcons.find((i) => i.name === name);
  return found?.icon || CheckSquare;
}

// Export icon names for schema validation
export const validIconNames = allIcons.map((i) => i.name);
