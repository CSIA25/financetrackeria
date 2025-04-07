
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  PiggyBank,
  BarChart4,
  Wallet,
  Settings,
  Tag
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ElementType;
}

const links: SidebarLink[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: Wallet,
  },
  {
    title: "Savings Goals",
    href: "/savings",
    icon: PiggyBank,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Tag,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart4,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  
  return (
    <div className={cn("pb-12 w-64 bg-white shadow-sm h-screen", className)}>
      <div className="py-4 space-y-4">
        <div className="px-4 py-2">
          <h2 className="px-2 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1 mt-2">
            {links.map((link) => (
              <Button
                key={link.href}
                asChild
                variant={location.pathname === link.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  location.pathname === link.href
                    ? "bg-finance-navy text-white hover:bg-finance-navy/90"
                    : ""
                )}
              >
                <Link to={link.href}>
                  <link.icon className="w-4 h-4 mr-2" />
                  {link.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
