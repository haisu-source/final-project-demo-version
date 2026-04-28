import { EyeIcon, HeartIcon, MessageIcon } from "./icons";
import type { EngagementStats } from "@/lib/types";

interface Props {
  stats: EngagementStats;
  size?: "sm" | "md";
  className?: string;
}

function format(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function EngagementMetrics({ stats, size = "sm", className }: Props) {
  const iconSize = size === "md" ? 18 : 14;
  const text = size === "md" ? "text-sm" : "text-xs";
  return (
    <div
      className={`flex items-center gap-3 text-[var(--muted)] ${text} ${className ?? ""}`}
    >
      <span className="flex items-center gap-1">
        <EyeIcon size={iconSize} />
        <span>{format(stats.views)}</span>
      </span>
      <span className="flex items-center gap-1">
        <MessageIcon size={iconSize} />
        <span>{format(stats.comments)}</span>
      </span>
      <span className="flex items-center gap-1">
        <HeartIcon size={iconSize} />
        <span>{format(stats.likes)}</span>
      </span>
    </div>
  );
}
