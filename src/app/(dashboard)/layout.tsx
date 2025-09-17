"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  List,
  FileText,
  Settings,
  LogOut,
  Sun,
  Moon,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import {jwtDecode} from "jwt-decode";
import { isTokenValid } from "@/utils/jwt";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Trades", href: "/trades", icon: List },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/trades": "Trades",
  "/notes": "Notes",
  // "/profile": "profile",
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Token validation and auto logout
  useEffect(() => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("token");
    router.replace("/auth/login");
    return;
  }

  // Optional: auto logout when token actually expires
  const decoded: any = jwtDecode(token);
  const now = Date.now() / 1000;
  const timeLeft = decoded.exp - now;

  const timeout = setTimeout(() => {
    localStorage.removeItem("token");
    router.replace("/auth/login");
  }, timeLeft * 1000);

  return () => clearTimeout(timeout);
}, [router]);


  // ✅ Handle responsive layout
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Initialize theme from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // ✅ Toggle theme
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("theme");
    document.documentElement.classList.remove("dark");
    router.replace("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar (Desktop) */}
      {!isMobile && (
        <aside className="w-64 bg-card border-r flex flex-col">
          <div className="px-6 py-4 font-bold text-xl border-b">
            Trading Journal
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg w-full transition"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b flex items-center justify-between px-6 bg-background">
          <div className="font-semibold text-lg">
            {pageTitles[pathname] || "Trading Journal"}
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/settings">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
          <Toaster richColors position="top-right" />
        </main>
      </div>

      {/* Bottom Nav (Mobile) */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center text-xs transition",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
