import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/contexts/AuthContext";
import { PhotoUpload } from "@/components/PhotoUpload";
import { 
  Shield, 
  LogOut, 
  User, 
  Phone, 
  Camera, 
  Upload,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, loading, signOut } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
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
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="hidden sm:flex">
                <User className="w-3 h-3 mr-1" />
                {user.phone || "User"}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-mobile sm:container-tablet lg:container-desktop py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Welcome to Your Dashboard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Manage your profile, upload photos, and track your activities on Sathi Seva.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Verified</div>
                <p className="text-xs text-muted-foreground">
                  Phone number verified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Type</CardTitle>
                <User className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Client</div>
                <p className="text-xs text-muted-foreground">
                  Ready to find help
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">New</div>
                <p className="text-xs text-muted-foreground">
                  Complete your first booking
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details and verification status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.phone}</p>
                  <p className="text-sm text-muted-foreground">Verified phone number</p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-4">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Member since</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Photo Upload
              </CardTitle>
              <CardDescription>
                Upload and manage your photos securely
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoUpload />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <Upload className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Upload Documents</div>
                    <div className="text-sm text-muted-foreground">Add ID proofs and certificates</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <User className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Complete Profile</div>
                    <div className="text-sm text-muted-foreground">Add more details to your profile</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
