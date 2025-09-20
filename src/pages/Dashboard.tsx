import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/contexts/AuthContext";
import { SupabaseService } from "@/integrations/supabase/service";
import { 
  Shield, 
  LogOut, 
  User, 
  Phone, 
  Camera, 
  Upload,
  CheckCircle,
  Clock,
  Star,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  Filter,
  Search,
  Plus
} from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, loading, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch user profile and jobs data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setDataLoading(true);
      try {
        // Fetch user profile
        let profile = await SupabaseService.getUserProfile(user.id);
        
        // If no profile exists, create a basic one
        if (!profile) {
          console.log("No profile found, creating basic profile...");
          profile = await SupabaseService.createUserProfile({
            user_id: user.id,
            full_name: null,
            age: null,
            address: null,
            skills: [],
            phone: user.phone || null,
            verification_status: 'pending'
          });
        }
        
        setUserProfile(profile);

        if (profile?.skills && profile.skills.length > 0) {
          // Fetch jobs matching user skills
          const jobs = await SupabaseService.getJobsByUserSkills(profile.skills);
          setAvailableJobs(jobs);
        } else {
          // If no skills, fetch all available jobs
          const jobs = await SupabaseService.getAvailableJobs();
          setAvailableJobs(jobs);
        }

        // Fetch user's jobs
        const userJobs = await SupabaseService.getUserJobs(user.id);
        setMyJobs(userJobs);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data. Please check your database connection.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const userSkills = userProfile?.skills || [];

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

  if (loading || dataLoading) {
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
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Available Jobs</CardTitle>
                 <Briefcase className="h-4 w-4 text-blue-500" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">{availableJobs.length}</div>
                 <p className="text-xs text-muted-foreground">
                   Matching your skills
                 </p>
               </CardContent>
             </Card>

             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">My Skills</CardTitle>
                 <Tag className="h-4 w-4 text-green-500" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">{userSkills.length}</div>
                 <p className="text-xs text-muted-foreground">
                   Services you offer
                 </p>
               </CardContent>
             </Card>

             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                 <CheckCircle className="h-4 w-4 text-green-500" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">{myJobs.filter(job => job.status === 'completed').length}</div>
                 <p className="text-xs text-muted-foreground">
                   Successfully completed
                 </p>
               </CardContent>
             </Card>

             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Rating</CardTitle>
                 <Star className="h-4 w-4 text-yellow-500" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">4.8</div>
                 <p className="text-xs text-muted-foreground">
                   Based on {myJobs.filter(job => job.rating).length} reviews
                 </p>
               </CardContent>
             </Card>
           </div>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Your Skills
              </CardTitle>
              <CardDescription>
                Services you can provide to clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill) => (
                  <Badge key={skill} variant="default" className="flex items-center gap-1">
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Jobs matching these skills will appear in your feed. You can update your skills anytime.
              </p>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">My Jobs</TabsTrigger>
              <TabsTrigger value="available">Available Jobs</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Jobs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Jobs</CardTitle>
                    <CardDescription>Your latest job activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {myJobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">Job ID: {job.id.slice(0, 8)}...</p>
                            <div className="flex gap-1 mt-1">
                              {job.required_tags?.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            job.status === 'completed' ? 'default' : 
                            job.status === 'pending' ? 'secondary' : 'outline'
                          }>
                            {job.status}
                          </Badge>
                          <p className="text-sm font-medium mt-1">₹{job.amount}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your account and jobs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => navigate("/profile")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Update Skills
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Schedule
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <User className="w-4 h-4 mr-2" />
                      Complete Profile
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documents
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* My Jobs Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Jobs</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {myJobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{job.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {job.scheduled_date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.scheduled_time}
                            </div>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {job.required_tags?.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge variant={
                            job.status === 'completed' ? 'default' : 
                            job.status === 'pending' ? 'secondary' : 'outline'
                          }>
                            {job.status}
                          </Badge>
                          <p className="text-lg font-semibold">₹{job.amount}</p>
                          {job.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm">{job.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Available Jobs Tab */}
            <TabsContent value="available" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Available Jobs ({availableJobs.length})</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {availableJobs.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No matching jobs found</h3>
                    <p className="text-muted-foreground">
                      No jobs match your current skills. Consider updating your skills or check back later.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {availableJobs.map((job) => (
                    <Card key={job.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h4 className="font-semibold">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">{job.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {job.scheduled_date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.scheduled_time}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.duration}
                              </div>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {job.required_tags?.map((tag) => (
                                <Badge key={tag} variant="default" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <p className="text-lg font-semibold">₹{job.amount}</p>
                            <Button size="sm">Apply</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
