import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  FolderKanban, 
  Target, 
  BookOpen, 
  Archive, 
  Home,
  Plus,
  Search,
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const menuItems = [
  { 
    title: "Inicio", 
    url: "/", 
    icon: Home,
    description: "Vista general del sistema PARA"
  },
  { 
    title: "Proyectos", 
    url: "/proyectos", 
    icon: FolderKanban,
    description: "Gestiona tus proyectos activos",
    color: "para-projects"
  },
  { 
    title: "Áreas", 
    url: "/areas", 
    icon: Target,
    description: "Responsabilidades continuas",
    color: "para-areas"
  },
  { 
    title: "Recursos", 
    url: "/recursos", 
    icon: BookOpen,
    description: "Base de conocimiento personal",
    color: "para-resources"
  },
  { 
    title: "Archivo", 
    url: "/archivo", 
    icon: Archive,
    description: "Elementos archivados",
    color: "para-archive"
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const filteredItems = menuItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn(
      "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-72",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-para-areas flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground">PARA OS</h1>
              <p className="text-xs text-sidebar-foreground/60">Código Abierto</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60" />
            <Input
              placeholder="Buscar en PARA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-sidebar-accent border-0 text-sidebar-foreground placeholder:text-sidebar-foreground/60"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.url);
          
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                active 
                  ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-sm" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 transition-colors",
                  active && item.color && `text-${item.color}`,
                  !active && "group-hover:scale-110"
                )} 
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-sidebar-foreground/60 truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button variant="para" size="sm" className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Proyecto
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent">
            <Settings className="h-4 w-4" />
            Configuración
          </Button>
        </div>
      )}

      {/* Collapsed quick actions */}
      {isCollapsed && (
        <div className="p-2 border-t border-sidebar-border space-y-2">
          <Button variant="ghost" size="icon" className="w-full text-sidebar-foreground hover:bg-sidebar-accent">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-full text-sidebar-foreground hover:bg-sidebar-accent">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}