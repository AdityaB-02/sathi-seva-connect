import { Button } from "@/components/ui/button";
import { Menu, Shield, Star } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container-mobile sm:container-tablet lg:container-desktop py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sathi Seva</h1>
              <p className="text-xs text-muted-foreground">Trusted Local Help</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span>Trusted Platform</span>
            </div>
            <Button variant="ghost" size="sm">
              How it Works
            </Button>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </nav>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;