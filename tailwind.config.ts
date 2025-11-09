import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        "2xl": "1.25rem",
      },
    },
  },
} satisfies Config;

export default config;

