import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  LayoutDashboard, 
  FolderGit2, 
  MessageSquare, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Bell,
  ChevronRight,
  Clock,
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import Header from "@/components/Header";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useProjects } from "@/hooks/useProjects";
import { formatDistanceToNow } from "date-fns";

const Sidebar = ({ onLogout }: { onLogout: () => void }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FolderGit2, label: "Projects", href: "/chat" },
    { icon: MessageSquare, label: "AI Chat", href: "/chat" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-sage flex items-center justify-center shadow-soft">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Peaceful</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.href || 
            (item.href === "/chat" && currentPath === "/chat");
          
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-sage-light text-sage-dark font-medium" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
            <span className="text-sage-dark font-semibold">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">User</p>
            <p className="text-xs text-muted-foreground truncate">user@example.com</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

const ProjectCard = ({ 
  name, 
  lastUpdated,
  onClick,
}: { 
  name: string; 
  lastUpdated: string; 
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    onClick={onClick}
    className="bg-card border border-border rounded-2xl p-6 hover:shadow-card transition-all duration-300 group cursor-pointer"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center">
        <MessageSquare className="w-6 h-6 text-sage" />
      </div>
      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{name}</h3>
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {lastUpdated}
      </span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { stats } = useDashboardStats(user?.id);
  const { projects } = useProjects(user?.id);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar onLogout={handleLogout} />
      
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search projects..." 
                    className="pl-10 h-11 rounded-xl border-border/50 bg-muted/50"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button variant="hero" size="default" onClick={() => navigate('/chat')}>
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-8">
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gradient-peaceful rounded-3xl p-8 mb-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back! 👋
                </h1>
                <p className="text-muted-foreground text-lg mb-6">
                  Continue building your projects with AI assistance.
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/chat">
                      <MessageSquare className="w-4 h-4" />
                      Start AI Chat
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                { label: "Total Projects", value: stats.loading ? "..." : stats.totalProjects.toString(), icon: FolderGit2, color: "sage" },
                { label: "AI Generations", value: stats.loading ? "..." : stats.aiGenerations.toString(), icon: Sparkles, color: "sky" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      stat.color === 'sage' ? 'bg-sage-light text-sage' :
                      'bg-sky-light text-sky'
                    }`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <Zap className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Projects */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Recent Projects</h2>
                <Button variant="ghost" className="text-sage" onClick={() => navigate('/chat')}>
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              {projects.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">Start your first AI chat to create a project</p>
                  <Button variant="hero" onClick={() => navigate('/chat')}>
                    <Plus className="w-4 h-4" />
                    New Project
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice(0, 6).map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProjectCard 
                        name={project.name}
                        lastUpdated={formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                        onClick={() => navigate('/chat')}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
