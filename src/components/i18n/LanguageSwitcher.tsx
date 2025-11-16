"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const [lang, setLang] = useState<string>(languages[0].code);

  const handleChange = (locale: string) => {
    setLang(locale);
    // Simple client-only switch: append ?lang=
    const params = new URLSearchParams(search?.toString());
    params.set("lang", locale);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select value={lang} onChange={(e) => handleChange(e.target.value)} className="rounded-lg border px-4 py-2">
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.flag} {l.name}
        </option>
      ))}
    </select>
  );
}


