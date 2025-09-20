import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  DollarSign, 
  Wand2,
  Loader2,
  Tag
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TagGenerationService } from "@/services/tagGeneration";

interface JobCreationFormProps {
  onJobCreated: (jobData: any) => Promise<void>;
}

export const JobCreationForm = ({ onJobCreated }: JobCreationFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    amount: "",
    duration: "",
    scheduled_date: undefined as Date | undefined,
    scheduled_time: "",
    required_tags: [] as string[],
  });
  
  const [newTag, setNewTag] = useState("");
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateTagsFromDescription = async () => {
    if (!formData.description.trim()) {
      toast.error("Please enter a job description first");
      return;
    }

    setIsGeneratingTags(true);
    try {
      const result = await TagGenerationService.generateTags({
        description: formData.description,
        title: formData.title
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate tags');
      }

      const generatedTags = result.tags || [];
      
      // Merge with existing tags, avoiding duplicates
      const uniqueTags = [...new Set([...formData.required_tags, ...generatedTags])];
      
      setFormData(prev => ({
        ...prev,
        required_tags: uniqueTags
      }));
      
      toast.success(`Generated ${generatedTags.length} tags from description`);
    } catch (error) {
      console.error('Error generating tags:', error);
      toast.error("Failed to generate tags. You can add them manually.");
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.required_tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        required_tags: [...prev.required_tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      required_tags: prev.required_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.scheduled_date) {
      toast.error("Please select a scheduled date");
      return;
    }

    setIsSubmitting(true);
    try {
      await onJobCreated({
        ...formData,
        amount: parseFloat(formData.amount),
        scheduled_date: format(formData.scheduled_date, 'yyyy-MM-dd'),
      });
      toast.success("Job created successfully!");
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error("Failed to create job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Job
        </CardTitle>
        <CardDescription>
          Fill in the details for your new job posting. Use AI to generate relevant tags automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g., House Cleaning Service"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the job requirements, tasks, and any specific instructions..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateTagsFromDescription}
              disabled={isGeneratingTags || !formData.description.trim()}
              className="mt-2"
            >
              {isGeneratingTags ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              {isGeneratingTags ? "Generating..." : "Generate Tags with AI"}
            </Button>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="e.g., Sector 15, Noida"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Amount and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="500"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="2 hours">2 hours</SelectItem>
                  <SelectItem value="3 hours">3 hours</SelectItem>
                  <SelectItem value="4 hours">4 hours</SelectItem>
                  <SelectItem value="Half day">Half day</SelectItem>
                  <SelectItem value="Full day">Full day</SelectItem>
                  <SelectItem value="Multiple days">Multiple days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Scheduled Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.scheduled_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduled_date ? format(formData.scheduled_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.scheduled_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, scheduled_date: date }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduled_time: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Required Skills/Tags
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill or tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {formData.required_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.required_tags.map((tag) => (
                  <Badge key={tag} variant="default" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? "Creating..." : "Create Job"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
