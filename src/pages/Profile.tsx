import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/contexts/AuthContext";
import { SupabaseService } from "@/integrations/supabase/service";
import { LocationService } from "@/services/locationService";
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Upload,
  Save,
  Plus,
  X,
  Loader2,
  Camera,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Navigation
} from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    address: "",
    phone: "",
    skills: [] as string[],
    aadhaar_number: "",
    pan_number: "",
    latitude: null as number | null,
    longitude: null as number | null,
    city: "",
    state: "",
    pincode: "",
    locality: ""
  });

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        let userProfile = await SupabaseService.getUserProfile(user.id);
        
        if (!userProfile) {
          // Create basic profile if none exists
          userProfile = await SupabaseService.createOrUpdateProfile({
            user_id: user.id,
            full_name: user.email?.split('@')[0] || '',
            skills: []
          });
        }
        
        setProfile(userProfile);
        if (userProfile) {
          setFormData({
            full_name: userProfile.full_name || "",
            age: userProfile.age?.toString() || "",
            address: userProfile.address || "",
            phone: userProfile.phone || "",
            skills: userProfile.skills || [],
            aadhaar_number: userProfile.aadhaar_number || "",
            pan_number: userProfile.pan_number || "",
            latitude: userProfile.latitude || null,
            longitude: userProfile.longitude || null,
            city: userProfile.city || "",
            state: userProfile.state || "",
            pincode: userProfile.pincode || "",
            locality: userProfile.locality || ""
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const detectLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await LocationService.getCurrentLocation();
      const addressDetails = await LocationService.getAddressFromCoordinates(
        location.latitude, 
        location.longitude
      );
      
      setFormData(prev => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
        address: addressDetails.formatted_address,
        city: addressDetails.city,
        state: addressDetails.state,
        pincode: addressDetails.pincode,
        locality: addressDetails.locality
      }));
      
      toast.success("Location detected successfully!");
    } catch (error) {
      console.error("Error detecting location:", error);
      toast.error("Failed to detect location. Please enter manually.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const profileData = {
        user_id: user.id,
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age) : null,
        address: formData.address,
        phone: formData.phone,
        skills: formData.skills,
        aadhaar_number: formData.aadhaar_number,
        pan_number: formData.pan_number,
        latitude: formData.latitude,
        longitude: formData.longitude,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        locality: formData.locality,
        updated_at: new Date().toISOString()
      };

      const updatedProfile = await SupabaseService.createOrUpdateProfile(profileData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
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
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and skills</p>
            </div>
          </div>
          
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={saveProfile} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <CardTitle>{formData.full_name || "Complete Your Profile"}</CardTitle>
                <CardDescription>
                  {profile?.verification_status === 'verified' ? (
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1 text-yellow-600">
                      <AlertCircle className="w-4 h-4" />
                      Pending Verification
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {formData.phone || "No phone number"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {formData.city && formData.state ? `${formData.city}, ${formData.state}` : "No location set"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formData.age ? `${formData.age} years old` : "Age not set"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your age"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Information
                </CardTitle>
                <CardDescription>Your location helps match you with nearby jobs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <Button 
                    onClick={detectLocation} 
                    disabled={isLoadingLocation}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoadingLocation ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Navigation className="w-4 h-4 mr-2" />
                    )}
                    {isLoadingLocation ? "Detecting Location..." : "Auto-Detect Location"}
                  </Button>
                )}
                
                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      disabled={!isEditing}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      disabled={!isEditing}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Pincode"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="locality">Locality/Area</Label>
                  <Input
                    id="locality"
                    value={formData.locality}
                    onChange={(e) => handleInputChange("locality", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Your specific locality or area"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Services</CardTitle>
                <CardDescription>Add skills and services you can offer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      {isEditing && (
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeSkill(skill)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a new skill"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verification Documents
                </CardTitle>
                <CardDescription>Add your documents for verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
                    <Input
                      id="aadhaar_number"
                      value={formData.aadhaar_number}
                      onChange={(e) => handleInputChange("aadhaar_number", e.target.value)}
                      disabled={!isEditing}
                      placeholder="XXXX XXXX XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pan_number">PAN Number</Label>
                    <Input
                      id="pan_number"
                      value={formData.pan_number}
                      onChange={(e) => handleInputChange("pan_number", e.target.value)}
                      disabled={!isEditing}
                      placeholder="ABCDE1234F"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
