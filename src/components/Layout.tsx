import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  BarChart3,
  FilePlus
} from "lucide-react";
import { User } from "@supabase/supabase-js";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const menuItems = [
    { path: "/", label: "Tableau de bord", icon: LayoutDashboard },
    { path: "/nouvelle-affaire", label: "Nouvelle Affaire", icon: FilePlus },
    { path: "/historique", label: "Historique", icon: History },
    { path: "/configuration", label: "Configuration", icon: Settings },
    { path: "/statistiques", label: "Statistiques", icon: BarChart3 },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar-background text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border`}
      >
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-sm">Douanes</h2>
                <p className="text-xs text-sidebar-foreground/70">Répartition</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  !sidebarOpen && "justify-center px-0"
                } ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon className={`${sidebarOpen ? "mr-3" : ""} w-5 h-5`} />
                {sidebarOpen && item.label}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
              !sidebarOpen && "justify-center px-0"
            }`}
            onClick={handleLogout}
          >
            <LogOut className={`${sidebarOpen ? "mr-3" : ""} w-5 h-5`} />
            {sidebarOpen && "Déconnexion"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
