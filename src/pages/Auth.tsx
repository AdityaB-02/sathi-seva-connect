import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Users, Briefcase, Mail, Lock, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<"client" | "worker">("client");
  const [loading, setLoading] = useState(false);
  
  const { signInWithEmail, signUpWithEmail } = useAuthContext();
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    const { error } = isSignUp 
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);
    
    if (error) {
      toast.error(error.message || "Authentication failed. Please try again.");
      console.error("Auth error:", error);
    } else {
      toast.success(isSignUp ? "Account created successfully!" : "Successfully logged in!");
      // Redirect based on user type
      if (userType === "client") {
        navigate("/dashboard");
      } else {
        navigate("/worker-onboarding");
      }
    }
    setLoading(false);
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
                <Mail className="w-5 h-5" />
                {isSignUp ? "Create Account" : "Sign In"}
              </CardTitle>
              <CardDescription>
                {isSignUp ? "Create your account to get started" : "Welcome back! Please sign in to your account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleAuth} 
                className="w-full" 
                variant={userType === "client" ? "default" : "secondary"}
                disabled={!email || !password || loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {loading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
              </Button>

              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </Button>
              </div>

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