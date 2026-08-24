import { cx } from "@/lib/utils";

export function LogoMark({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cx("shrink-0", className)}
      aria-hidden
    >
      <rect width="40" height="40" rx="11" fill="#c1f84e" />
      <path
        d="M23.5 7L12 23h7l-2.5 10L28 18h-7l2.5-11z"
        fill="#05080a"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-lg font-bold tracking-tight text-white">
        Nova<span className="text-volt-400">Bank</span>
      </span>
    </span>
  );
}
