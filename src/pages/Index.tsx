import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Github, Zap, Shield, Cloud } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-sage flex items-center justify-center shadow-soft">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Peaceful</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link to="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/auth?mode=signup">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-72 h-72 bg-sage-light rounded-full blur-3xl opacity-60 animate-float" />
    <div className="absolute top-40 right-20 w-96 h-96 bg-sky-light rounded-full blur-3xl opacity-50 animate-float-slow" style={{ animationDelay: "1s" }} />
    <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-lavender rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: "2s" }} />
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-12 gradient-hero overflow-hidden">
      <FloatingShapes />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light text-sage-dark text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Development Platform
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
        >
          Build with
          <span className="text-gradient-sage"> peace </span>
          of mind
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Create beautiful web applications effortlessly with AI assistance.
          Connect your GitHub, generate code, and deploy seamlessly.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="hero" size="xl" asChild>
            <Link to="/auth?mode=signup">
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="hero-outline" size="xl" asChild>
            <Link to="#features">
              <Github className="w-5 h-5" />
              Connect GitHub
            </Link>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 relative"
        >
          <div className="glass rounded-3xl p-2 shadow-elevated max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl overflow-hidden shadow-card">
              <div className="bg-muted/50 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                  <div className="w-3 h-3 rounded-full bg-sage/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background/50 rounded-lg px-4 py-1 text-xs text-muted-foreground">
                    peaceful.dev/project
                  </div>
                </div>
              </div>
              <div className="p-8 min-h-[300px] bg-gradient-to-br from-sage-light/30 via-background to-sky-light/30">
                <div className="flex gap-6">
                  <div className="w-48 space-y-3">
                    <div className="h-8 bg-sage-light rounded-lg animate-pulse" />
                    <div className="h-6 bg-muted rounded-lg w-3/4" />
                    <div className="h-6 bg-muted rounded-lg w-1/2" />
                    <div className="h-6 bg-muted rounded-lg w-2/3" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-sage/20 rounded w-3/4" />
                    <div className="h-4 bg-sky/20 rounded w-full" />
                    <div className="h-4 bg-lavender/40 rounded w-2/3" />
                    <div className="h-24 bg-muted/50 rounded-xl mt-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Use cutting-edge AI models to generate code, content, and designs based on your natural language prompts.",
    color: "sage",
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description: "Connect your repositories seamlessly. Auto-commit changes, view history, and manage your code effortlessly.",
    color: "sky",
  },
  {
    icon: Cloud,
    title: "Cloud Backend",
    description: "Built-in database, authentication, and storage powered by Supabase. No server setup required.",
    color: "lavender",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "See changes instantly with real-time subscriptions. Collaborate with your team in perfect sync.",
    color: "sage",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Enterprise-grade security with row-level policies, encrypted secrets, and OAuth authentication.",
    color: "sky",
  },
  {
    icon: ArrowRight,
    title: "One-Click Deploy",
    description: "Deploy your projects instantly to production. Scale from prototype to millions of users.",
    color: "lavender",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-light text-sky-dark text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Powerful Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to build
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From AI assistance to deployment, Peaceful gives you all the tools for modern web development.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-8 rounded-3xl bg-card border border-border/50 hover:border-sage/30 transition-all duration-300 hover:shadow-card">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  feature.color === 'sage' ? 'bg-sage-light text-sage' :
                  feature.color === 'sky' ? 'bg-sky-light text-sky' :
                  'bg-lavender text-lavender-dark'
                }`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="gradient-peaceful rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sage/10 via-transparent to-sky/10" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to build peacefully?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of developers creating amazing applications with AI assistance. Start free, scale infinitely.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth?mode=signup">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/dashboard">
                  View Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-sage flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">Peaceful</span>
        </div>
        <p className="text-muted-foreground text-sm">
          © 2024 Peaceful. Built with ❤️ for developers.
        </p>
        <div className="flex items-center gap-6">
          <Link to="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Privacy
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Terms
          </Link>
          <Link to="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            Docs
          </Link>
        </div>
      </div>
    </footer>
  );
};

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
