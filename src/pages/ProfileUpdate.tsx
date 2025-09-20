import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/contexts/AuthContext";
import { SupabaseService } from "@/integrations/supabase/service";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Tag, 
  X,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

const ProfileUpdate = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    age: "",
    address: "",
    phone: "",
    skills: [] as string[],
  });

  // Available skill tags
  const availableTags = [
    "House Cleaning", "Cooking", "Child Care", "Elderly Care", "Pet Care",
    "Gardening", "Plumbing", "Electrical Work", "Carpentry", "Painting",
    "Laundry", "Ironing", "Shopping", "Driving", "Delivery",
    "Office Work", "Data Entry", "Teaching", "Tutoring", "Translation",
    "Event Planning", "Photography", "Beauty Services", "Massage", "Yoga"
  ];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user) {
      loadUserProfile();
    }
  }, [user, loading, navigate]);

  const loadUserProfile = async () => {
    if (!user) return;

    const userProfile = await SupabaseService.getUserProfile(user.id);
    if (userProfile) {
      setProfile({
        full_name: userProfile.full_name || "",
        age: userProfile.age?.toString() || "",
        address: userProfile.address || "",
        phone: userProfile.phone || "",
        skills: userProfile.skills || [],
      });
    }
  };

  const handleTagToggle = (tag: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(tag)
        ? prev.skills.filter(t => t !== tag)
        : [...prev.skills, tag]
    }));
  };

  const removeTag = (tag: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(t => t !== tag)
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    if (!profile.full_name || !profile.age || !profile.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (profile.skills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        full_name: profile.full_name,
        age: parseInt(profile.age),
        address: profile.address,
        phone: profile.phone,
        skills: profile.skills,
        updated_at: new Date().toISOString()
      };

      const updatedProfile = await SupabaseService.updateUserProfile(user.id, updateData);
      
      if (updatedProfile) {
        toast.success("Profile updated successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white animate-pulse" />
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
      <div className="container-mobile sm:container-tablet lg:container-desktop py-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile Update
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-mobile sm:container-tablet lg:container-desktop pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Update Your Profile</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Keep your profile information up to date to get better job matches and opportunities.
            </p>
          </div>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({...profile, age: e.target.value})}
                    placeholder="Your age"
                    min="18"
                    max="65"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="Your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  placeholder="Your complete address"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Skills & Services
              </CardTitle>
              <CardDescription>
                Select the services you can provide. This helps match you with relevant jobs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Tags */}
              {profile.skills.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Skills ({profile.skills.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((tag) => (
                      <Badge key={tag} variant="default" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:bg-white/20 rounded-full" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Tags */}
              <div className="space-y-2">
                <Label>Available Skills</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                  {availableTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag}
                        checked={profile.skills.includes(tag)}
                        onCheckedChange={() => handleTagToggle(tag)}
                      />
                      <Label 
                        htmlFor={tag} 
                        className="text-sm cursor-pointer flex-1"
                      >
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary-light p-4 rounded-lg border border-primary/20">
                <div className="flex items-start gap-2">
                  <Tag className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Why update your skills?</p>
                    <p className="text-xs text-muted-foreground">
                      Updating your skills helps us show you more relevant job opportunities and helps clients find the right person for their needs.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your account details and verification status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.phone || "Not provided"}</p>
                  <p className="text-sm text-muted-foreground">Phone number</p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-4">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Member since</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleSave} 
              disabled={saving || !profile.full_name || !profile.age || !profile.address || profile.skills.length === 0}
              size="lg"
              className="min-w-48"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
