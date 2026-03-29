"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn, TOOL_LABELS, TOOL_BADGE_CLASS } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/jobs", label: "Live Jobs", icon: "🔍" },
  { href: "/interview", label: "Mock Interview", icon: "🎤" },
  { href: "/learn", label: "Learning Tracks", icon: "📚" },
  { href: "/resume", label: "Resume Builder", icon: "📄" },
];

interface SidebarProps {
  user: { name: string; email: string; primaryTool: string };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 border-r border-border bg-surface min-h-screen shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <span className="font-heading font-bold text-lg text-white">
          WA<span className="text-accent">Careers</span>
        </span>
      </div>

      {/* Tool badge */}
      <div className="px-5 py-3 border-b border-border">
        <p className="text-xs text-slate-500 mb-1">Your tool</p>
        <span className={cn("badge", TOOL_BADGE_CLASS[user.primaryTool])}>
          {TOOL_LABELS[user.primaryTool]}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150",
                active
                  ? "bg-accent/15 text-white font-medium"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-border flex items-center gap-3">
        <UserButton />
        <div className="min-w-0">
          <p className="text-sm text-white truncate">{user.name}</p>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
      </div>
    </aside>
  );
}
