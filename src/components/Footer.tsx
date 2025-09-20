import { Button } from "@/components/ui/button";
import { Shield, Mail, Phone, MapPin, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-card border-t border-border">
      <div className="container-mobile sm:container-tablet lg:container-desktop py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Sathi Seva</h3>
                <p className="text-xs text-muted-foreground">Trusted Local Help</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              India's most trusted peer-to-peer gig economy platform. 
              Connecting communities, empowering livelihoods.
            </p>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* For Clients */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">For Clients</h4>
            <div className="space-y-2 text-sm">
              <Button variant="link" className="p-0 h-auto text-left justify-start">
                Find Workers
              </Button>
              <Button variant="link" className="p-0 h-auto text-left justify-start">
                Post a Job
              </Button>
              <Button variant="link" className="p-0 h-auto text-left justify-start">
                Safety Guidelines
              </Button>
              <Button variant="link" className="p-0 h-auto text-left justify-start">
                Pricing
              </Button>
            </div>
          </div>

          {/* For Workers */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">For Workers</h4>
            <div className="space-y-2 text-sm">
              <Button variant="link" className="p-0 h-auto text-left justify-start">
                Join as Worker
              </Button>
              <Button variant="link" className="p-0 h-auto text-left justify-start">
                Verification Process
              </Button>
              <Button variant="link" className="p-0 h-auto text-left justify-start">
                Earnings Guide
              </Button>
              <Button variant="link" className="p-0 h-auto text-left justify-start">
                Worker Resources
              </Button>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+91-800-SATHI</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>help@sathiseva.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm pt-2">
              <Button variant="link" className="p-0 h-auto text-left justify-start">
                Help Center
              </Button>
              <Button variant="link" className="p-0 h-auto text-left justify-start">
                Terms of Service
              </Button>
              <Button variant="link" className="p-0 h-auto text-left justify-start">
                Privacy Policy
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Sathi Seva. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Made with ❤️ in India</span>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-verified" />
              <span>Trusted Platform</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;