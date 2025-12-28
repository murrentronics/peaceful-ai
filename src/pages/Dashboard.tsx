import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
  Github,
  Clock,
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: FolderGit2, label: "Projects" },
    { icon: MessageSquare, label: "AI Chat" },
    { icon: Settings, label: "Settings" },
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
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              item.active 
                ? "bg-sage-light text-sage-dark font-medium" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
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
          <Button variant="ghost" size="icon-sm">
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

const ProjectCard = ({ 
  name, 
  description, 
  lastUpdated, 
  commits 
}: { 
  name: string; 
  description: string; 
  lastUpdated: string; 
  commits: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="bg-card border border-border rounded-2xl p-6 hover:shadow-card transition-all duration-300 group cursor-pointer"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center">
        <FolderGit2 className="w-6 h-6 text-sage" />
      </div>
      <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{name}</h3>
    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {lastUpdated}
      </span>
      <span className="flex items-center gap-1">
        <Github className="w-3 h-3" />
        {commits} commits
      </span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const projects = [
    {
      name: "E-commerce Platform",
      description: "Full-stack online store with payment integration and inventory management",
      lastUpdated: "2 hours ago",
      commits: 47,
    },
    {
      name: "Portfolio Website",
      description: "Personal portfolio showcasing projects and skills with a modern design",
      lastUpdated: "1 day ago",
      commits: 23,
    },
    {
      name: "Task Manager App",
      description: "Collaborative task management tool with real-time updates and notifications",
      lastUpdated: "3 days ago",
      commits: 89,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
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
              <Button variant="hero" size="default">
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
                <Button variant="hero" size="lg">
                  <MessageSquare className="w-4 h-4" />
                  Start AI Chat
                </Button>
                <Button variant="glass" size="lg">
                  <Github className="w-4 h-4" />
                  Connect GitHub
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Total Projects", value: "12", icon: FolderGit2, color: "sage" },
              { label: "AI Generations", value: "248", icon: Sparkles, color: "sky" },
              { label: "GitHub Commits", value: "159", icon: Github, color: "lavender" },
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
                    stat.color === 'sky' ? 'bg-sky-light text-sky' :
                    'bg-lavender text-lavender-dark'
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
              <Button variant="ghost" className="text-sage">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
