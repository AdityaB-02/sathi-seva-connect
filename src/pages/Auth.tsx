import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Users, Briefcase, Phone, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [userType, setUserType] = useState<"client" | "worker">("client");

  const handleSendOtp = () => {
    if (phoneNumber.length === 10) {
      setShowOtp(true);
      // Here you would integrate with OTP service
    }
  };

  const handleVerifyOtp = () => {
    // Here you would verify OTP and redirect based on user type
    if (userType === "client") {
      // Redirect to client dashboard
    } else {
      // Redirect to worker onboarding
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="container-mobile sm:container-tablet py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="container-mobile sm:container-tablet py-8">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Welcome to Sathi Seva</h1>
            <p className="text-muted-foreground">Your trusted local gig platform</p>
          </div>

          {/* User Type Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Choose Your Path</CardTitle>
              <CardDescription className="text-center">
                How would you like to use Sathi Seva?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={userType} onValueChange={(value) => setUserType(value as "client" | "worker")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="client" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Find Help
                  </TabsTrigger>
                  <TabsTrigger value="worker" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Earn Money
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="client" className="mt-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold">Find a Sathi</h3>
                    <p className="text-sm text-muted-foreground">
                      Get help with household chores, errands, and daily tasks from verified local workers.
                    </p>
                    <Badge variant="outline" className="text-primary">
                      For Clients
                    </Badge>
                  </div>
                </TabsContent>
                
                <TabsContent value="worker" className="mt-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold">Be a Sathi</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn money by helping others in your neighborhood. Flexible work, fair pay.
                    </p>
                    <Badge variant="outline" className="text-secondary">
                      For Workers
                    </Badge>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Authentication Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Sign In / Sign Up
              </CardTitle>
              <CardDescription>
                We'll send you an OTP to verify your mobile number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showOtp ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <div className="flex">
                      <div className="px-3 py-2 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                        +91
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="rounded-l-none"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSendOtp} 
                    className="w-full" 
                    variant={userType === "client" ? "client" : "worker"}
                    disabled={phoneNumber.length !== 10}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send OTP
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                    <p className="text-sm text-muted-foreground">
                      OTP sent to +91 {phoneNumber}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleVerifyOtp} 
                      className="w-full" 
                      variant={userType === "client" ? "client" : "worker"}
                      disabled={otp.length !== 6}
                    >
                      <Shield className="w-4 h-4" />
                      Verify & Continue
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowOtp(false)}
                      className="w-full"
                    >
                      Change Number
                    </Button>
                  </div>
                </>
              )}

              <div className="text-center text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;