import { generateFallbackTags } from "@/lib/gemini";

export interface TagGenerationRequest {
  description: string;
  title?: string;
}

export interface TagGenerationResponse {
  tags: string[];
  success: boolean;
  error?: string;
}

export class TagGenerationService {
  private static readonly GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
  
  static async generateTags(request: TagGenerationRequest): Promise<TagGenerationResponse> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // If no API key is available, use fallback
    if (!apiKey) {
      console.warn("Gemini API key not found, using fallback tag generation");
      return this.generateFallbackTags(request);
    }

    try {
      const prompt = this.createPrompt(request);
      
      const response = await fetch(`${this.GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error("Invalid response format from Gemini API");
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      const tags = this.parseTagsFromResponse(generatedText);
      
      return {
        tags,
        success: true
      };
    } catch (error) {
      console.error("Error generating tags with Gemini:", error);
      
      // Fallback to local tag generation
      console.log("Falling back to local tag generation");
      return this.generateFallbackTags(request);
    }
  }

  private static generateFallbackTags(request: TagGenerationRequest): TagGenerationResponse {
    const tags = generateFallbackTags(request.description, request.title);
    return {
      tags,
      success: true
    };
  }

  private static createPrompt(request: TagGenerationRequest): string {
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

  private static parseTagsFromResponse(response: string): string[] {
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
