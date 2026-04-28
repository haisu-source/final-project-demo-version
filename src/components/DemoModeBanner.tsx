import { IS_DEMO_MODE_AI, IS_DEMO_MODE_DB } from "@/lib/demo-mode";
import { InfoIcon } from "./icons";

export default function DemoModeBanner() {
  if (!IS_DEMO_MODE_DB && !IS_DEMO_MODE_AI) return null;

  const parts: string[] = [];
  if (IS_DEMO_MODE_DB) parts.push("mock data (no Supabase)");
  if (IS_DEMO_MODE_AI) parts.push("hand-written AI replies (no Anthropic key)");

  const tooltip = [
    IS_DEMO_MODE_DB &&
      "Articles, comments, likes, and views are stored in memory and reset on server restart. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to connect a real database.",
    IS_DEMO_MODE_AI &&
      "Explore and Catch-me-up return canned responses. Set ANTHROPIC_API_KEY to use real Claude.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="border-b border-amber-300 bg-amber-100 text-amber-900">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs sm:px-6">
        <span className="rounded bg-amber-200 px-1.5 py-0.5 font-semibold uppercase tracking-wide">
          Demo
        </span>
        <span>
          Demo mode — using {parts.join(" and ")}.
        </span>
        <span
          className="group relative ml-1 cursor-help"
          tabIndex={0}
          aria-label="What is mocked?"
        >
          <InfoIcon size={14} className="opacity-70" />
          <span
            className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden w-72 whitespace-pre-wrap rounded-md border border-amber-300 bg-amber-50 p-2 text-[11px] leading-snug shadow group-hover:block group-focus:block"
          >
            {tooltip}
          </span>
        </span>
      </div>
    </div>
  );
}
