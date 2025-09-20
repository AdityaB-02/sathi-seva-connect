import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Upload, 
  CheckCircle, 
  Clock,
  AlertCircle,
  User,
  FileText,
  Camera,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";

const WorkerOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    address: "",
    skills: "",
    aadhaarNumber: "",
    panNumber: "",
    profilePhoto: null as File | null,
    aadhaarPhoto: null as File | null,
    panPhoto: null as File | null,
  });
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "processing" | "verified" | "rejected">("pending");

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    // Mock API call for verification
    setVerificationStatus("processing");
    
    // Simulate API call
    setTimeout(() => {
      // Mock response - in real app, this would be based on actual verification
      const mockVerificationResult = {
        is_verified: true,
        risk_score: 0.2
      };
      
      if (mockVerificationResult.is_verified && mockVerificationResult.risk_score < 0.5) {
        setVerificationStatus("verified");
      } else {
        setVerificationStatus("rejected");
      }
    }, 3000);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Tell us about yourself to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Enter your full name as per Aadhaar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="Your age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Your complete address"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills & Experience</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  placeholder="Tell us about your skills (e.g., cleaning, cooking, gardening, repairs)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Profile Photo
              </CardTitle>
              <CardDescription>
                Upload a clear photo of yourself for your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Click to upload or drag and drop your photo
                </p>
                <Button variant="outline">
                  Choose Photo
                </Button>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Photo Guidelines:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Clear, well-lit photo</li>
                  <li>• Face clearly visible</li>
                  <li>• No sunglasses or hats</li>
                  <li>• Professional appearance</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Identity Verification
              </CardTitle>
              <CardDescription>
                Upload your Aadhaar and PAN for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                <Input
                  id="aadhaar"
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({...formData, aadhaarNumber: e.target.value})}
                  placeholder="Enter 12-digit Aadhaar number"
                  maxLength={12}
                />
              </div>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload Aadhaar Card</p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number *</Label>
                <Input
                  id="pan"
                  value={formData.panNumber}
                  onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                  placeholder="Enter 10-character PAN number"
                  maxLength={10}
                />
              </div>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload PAN Card</p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>

              <div className="bg-warning-light p-4 rounded-lg border border-warning/20">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Secure Verification</p>
                    <p className="text-xs text-muted-foreground">
                      Your documents are encrypted and used only for verification. We comply with Indian data protection laws.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {verificationStatus === "pending" && <Clock className="w-5 h-5 text-pending" />}
                {verificationStatus === "processing" && <Clock className="w-5 h-5 text-pending animate-spin" />}
                {verificationStatus === "verified" && <CheckCircle className="w-5 h-5 text-verified" />}
                {verificationStatus === "rejected" && <AlertCircle className="w-5 h-5 text-destructive" />}
                Verification Status
              </CardTitle>
              <CardDescription>
                {verificationStatus === "pending" && "Ready to submit for verification"}
                {verificationStatus === "processing" && "We're verifying your documents..."}
                {verificationStatus === "verified" && "Congratulations! Your profile is verified"}
                {verificationStatus === "rejected" && "Verification failed. Please check your documents"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {verificationStatus === "pending" && (
                <div className="space-y-4">
                  <div className="bg-primary-light p-4 rounded-lg border border-primary/20">
                    <h4 className="font-medium mb-2">Review Your Information:</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {formData.fullName}</p>
                      <p><strong>Age:</strong> {formData.age}</p>
                      <p><strong>Aadhaar:</strong> ****-****-{formData.aadhaarNumber.slice(-4)}</p>
                      <p><strong>PAN:</strong> ******{formData.panNumber.slice(-4)}</p>
                    </div>
                  </div>
                  <Button onClick={handleSubmit} className="w-full" variant="worker" size="lg">
                    <Shield className="w-4 h-4" />
                    Submit for Verification
                  </Button>
                </div>
              )}

              {verificationStatus === "processing" && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-pending/10 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-pending animate-spin" />
                  </div>
                  <div>
                    <p className="font-medium">Verification in Progress</p>
                    <p className="text-sm text-muted-foreground">
                      This usually takes 2-5 minutes. Please don't close this page.
                    </p>
                  </div>
                </div>
              )}

              {verificationStatus === "verified" && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-success-light rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-verified" />
                  </div>
                  <div>
                    <p className="font-medium text-verified">Verification Successful!</p>
                    <p className="text-sm text-muted-foreground">
                      Welcome to Sathi Seva! You can now start accepting jobs.
                    </p>
                  </div>
                  <Button variant="success" size="lg" className="w-full">
                    Start Earning
                  </Button>
                </div>
              )}

              {verificationStatus === "rejected" && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium text-destructive">Verification Failed</p>
                    <p className="text-sm text-muted-foreground">
                      Please check your documents and try again, or contact support.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button variant="destructive" size="lg" className="w-full">
                      Try Again
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Support
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="container-mobile sm:container-tablet py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Worker Onboarding
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="container-mobile sm:container-tablet mb-8">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container-mobile sm:container-tablet pb-8">
        <div className="max-w-2xl mx-auto">
          {renderStepContent()}

          {/* Navigation */}
          {verificationStatus === "pending" && step < totalSteps ? (
            <div className="flex justify-between mt-6">
              <Button 
                variant="ghost" 
                onClick={handleBack}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button 
                variant="worker" 
                onClick={handleNext}
                disabled={
                  (step === 1 && (!formData.fullName || !formData.age || !formData.address)) ||
                  (step === 3 && (!formData.aadhaarNumber || !formData.panNumber))
                }
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default WorkerOnboarding;