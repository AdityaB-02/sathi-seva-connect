import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="w-full py-12 md:py-20 lg:py-24 gradient-subtle">
      <div className="container-mobile sm:container-tablet lg:container-desktop">
        {/* Main Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Find Your Local{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Sathi
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Connect with verified local workers for household chores, errands, and more. 
                India's most trusted peer-to-peer gig economy platform.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-verified" />
                <span>Verified Workers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-verified" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-verified" />
                <span>Community Trusted</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="client" size="xl" className="flex-1 sm:flex-none" asChild>
                  <Link to="/auth">
                    Find a Sathi
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="worker" size="xl" className="flex-1 sm:flex-none" asChild>
                  <Link to="/worker-onboarding">
                    Be a Sathi
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                Join thousands of satisfied users across India
              </p>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Sathi Seva - Connecting local workers with clients across India"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Stats Cards */}
            <Card className="absolute -bottom-6 -left-4 p-4 shadow-lg bg-card/95 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Verified Workers</div>
              </div>
            </Card>
            
            <Card className="absolute -top-6 -right-4 p-4 shadow-lg bg-card/95 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">50K+</div>
                <div className="text-sm text-muted-foreground">Jobs Completed</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;