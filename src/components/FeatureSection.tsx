import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  MapPin, 
  CreditCard, 
  Star, 
  Smartphone, 
  Users,
  Clock,
  Award
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Workers",
    description: "Every worker is verified with Aadhaar and background checks for your safety.",
    badge: "Trust First",
    color: "text-verified"
  },
  {
    icon: MapPin,
    title: "Hyper-Local",
    description: "Find workers in your immediate neighborhood for quick and convenient service.",
    badge: "Location Based",
    color: "text-primary"
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Escrow system ensures payment is only released after job completion.",
    badge: "Safe & Secure",
    color: "text-success"
  },
  {
    icon: Star,
    title: "Rating System",
    description: "Community-driven ratings help you choose the best workers for your needs.",
    badge: "Community Driven",
    color: "text-warning"
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Easy-to-use app designed specifically for Indian users with any digital literacy level.",
    badge: "User Friendly",
    color: "text-secondary"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Local admin oversight and community reporting ensure platform quality.",
    badge: "Community Managed",
    color: "text-accent-foreground"
  }
];

const stats = [
  { icon: Clock, value: "< 30 min", label: "Average Response Time" },
  { icon: Award, value: "4.8/5", label: "Average Rating" },
  { icon: Users, value: "100K+", label: "Active Users" },
  { icon: Shield, value: "99.9%", label: "Verification Rate" }
];

const FeatureSection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container-mobile sm:container-tablet lg:container-desktop">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="mb-4">
            Why Choose Sathi Seva?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Built for Trust, Safety & Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've designed every feature with Indian users in mind, prioritizing trust, 
            security, and ease of use for everyone.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;