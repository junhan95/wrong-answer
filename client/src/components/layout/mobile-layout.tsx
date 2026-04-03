import { ReactNode } from "react";
import { Home, History, Camera, BarChart2, User as UserIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { UploadDialog } from "@/components/upload-dialog";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { name: "홈", path: "/", icon: Home },
    { name: "오답기록", path: "/history", icon: History },
    { name: "추가", path: "/camera", icon: Camera, isFab: true },
    { name: "성과", path: "/dashboard", icon: BarChart2 },
    { name: "설정", path: "/settings", icon: UserIcon },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 dark:bg-slate-950 font-sans mx-auto max-w-md relative shadow-2xl overflow-hidden border-x border-slate-200 dark:border-slate-800">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {children}
      </main>

      {/* Persistent Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 px-2 pb-safe pt-2">
        <ul className="flex items-center justify-between pb-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;

            if (item.isFab) {
              return (
                <li key={item.name} className="flex-1 flex justify-center -mt-6">
                  <UploadDialog>
                    <button className="flex flex-col items-center justify-center min-w-[60px] min-h-[60px] rounded-full bg-teal-600 border-2 border-slate-50 dark:border-slate-900 shadow-none text-white transform transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/50">
                      <Icon className="h-7 w-7" />
                    </button>
                  </UploadDialog>
                </li>
              );
            }

            return (
              <li key={item.name} className="flex-1 flex justify-center">
                <Link href={item.path}>
                  <a className={cn(
                    "flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] p-2 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    isActive 
                      ? "text-blue-700 dark:text-blue-400 font-bold" 
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium"
                  )}>
                    <Icon className={cn("h-6 w-6", isActive && "fill-blue-50 dark:fill-blue-900/40")} />
                    <span className="text-[10px] sm:text-xs">{item.name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
