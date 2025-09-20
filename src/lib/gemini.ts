import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface TagGenerationRequest {
  description: string;
  title?: string;
}

export interface TagGenerationResponse {
  tags: string[];
  success: boolean;
  error?: string;
}

export class GeminiTagGenerator {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateTags(request: TagGenerationRequest): Promise<TagGenerationResponse> {
    try {
      const prompt = this.createPrompt(request);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response to extract tags
      const tags = this.parseTagsFromResponse(text);
      
      return {
        tags,
        success: true
      };
    } catch (error) {
      console.error("Error generating tags with Gemini:", error);
      return {
        tags: [],
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  private createPrompt(request: TagGenerationRequest): string {
    return `
You are an AI assistant that helps generate relevant skill tags for job postings in a local services marketplace called "Sathi Seva". 

Job Title: ${request.title || "Not provided"}
Job Description: ${request.description}

Based on the job title and description above, generate a list of 5-8 relevant skill tags that would help workers find this job. These tags should represent the skills, tools, or expertise needed to complete this job.

Guidelines:
1. Focus on specific skills and tools required
2. Use common, searchable terms
3. Include both general and specific skills
4. Consider the Indian local services context
5. Keep tags concise (1-3 words each)
6. Avoid generic terms like "good" or "reliable"

Examples of good tags:
- "House Cleaning", "Deep Cleaning", "Kitchen Cleaning"
- "Plumbing", "Pipe Repair", "Bathroom Fitting"
- "Electrical Work", "Wiring", "Fan Installation"
- "Cooking", "Indian Cuisine", "Meal Prep"
- "Gardening", "Plant Care", "Lawn Mowing"

Return only the tags as a comma-separated list, nothing else.
Example format: House Cleaning, Deep Cleaning, Bathroom Cleaning, Kitchen Cleaning, Vacuum Cleaning
`;
  }

  private parseTagsFromResponse(response: string): string[] {
    try {
      // Clean the response and split by commas
      const cleanedResponse = response.trim().replace(/['"]/g, '');
      const tags = cleanedResponse
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0 && tag.length <= 30) // Filter out empty or too long tags
        .slice(0, 10); // Limit to 10 tags maximum
      
      return tags;
    } catch (error) {
      console.error("Error parsing tags from response:", error);
      return [];
    }
  }
}

// Fallback tag generation for when Gemini API is not available
export const generateFallbackTags = (description: string, title?: string): string[] => {
  const text = `${title || ""} ${description}`.toLowerCase();
  const fallbackTags: string[] = [];
  
  // Common service categories and their related tags
  const serviceKeywords = {
    "cleaning": ["House Cleaning", "Deep Cleaning", "Office Cleaning"],
    "cook": ["Cooking", "Meal Prep", "Indian Cuisine"],
    "plumb": ["Plumbing", "Pipe Repair", "Bathroom Fitting"],
    "electric": ["Electrical Work", "Wiring", "Appliance Repair"],
    "garden": ["Gardening", "Plant Care", "Landscaping"],
    "paint": ["Painting", "Wall Painting", "Interior Design"],
    "repair": ["Home Repair", "Maintenance", "Handyman"],
    "delivery": ["Delivery", "Pickup", "Transportation"],
    "tutor": ["Tutoring", "Teaching", "Education"],
    "beauty": ["Beauty Services", "Salon", "Grooming"],
    "massage": ["Massage", "Therapy", "Wellness"],
    "laundry": ["Laundry", "Dry Cleaning", "Ironing"],
    "baby": ["Babysitting", "Child Care", "Nanny"],
    "elder": ["Elder Care", "Nursing", "Companion"],
    "pet": ["Pet Care", "Dog Walking", "Pet Sitting"]
  };
  
  // Check for keywords and add relevant tags
  Object.entries(serviceKeywords).forEach(([keyword, tags]) => {
    if (text.includes(keyword)) {
      fallbackTags.push(...tags);
    }
  });
  
  // Remove duplicates and limit to 6 tags
  return [...new Set(fallbackTags)].slice(0, 6);
};
