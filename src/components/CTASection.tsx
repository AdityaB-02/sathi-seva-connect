import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Smartphone, Download } from "lucide-react";

const CTASection = () => {
  return (
    <section className="w-full py-16 md:py-24 gradient-hero relative overflow-hidden">
      <div className="container-mobile sm:container-tablet lg:container-desktop relative z-10">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="space-y-6">
              <div className="flex justify-center">
                <Smartphone className="w-16 h-16 text-white/90" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to Get Started?
                </h2>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                  Join thousands of Indians who trust Sathi Seva for their daily needs. 
                  Whether you need help or want to earn, we've got you covered.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <Button 
                  variant="secondary" 
                  size="xl" 
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Download className="w-5 h-5" />
                  Get the App
                </Button>
                <Button 
                  variant="outline" 
                  size="xl" 
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>100% Free to Join</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>Instant Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-lg"></div>
      </div>
    </section>
  );
};

export default CTASection;