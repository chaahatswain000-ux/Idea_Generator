import { GoogleGenAI, Type } from '@google/genai';
import { ProjectIdea, UserPreferences } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateProjectIdeas(
  prefs: UserPreferences,
  refinementPrompt?: string,
  existingIdea?: ProjectIdea
): Promise<ProjectIdea[]> {
  const prompt = refinementPrompt && existingIdea
    ? `I have this project idea: "${existingIdea.title}". ${refinementPrompt}. Make it more unique, practical, and non-generic. Ensure it has a clear implementation path. Elaborate extensively on the problem, relevance, and roadmap.`
    : `Generate exactly 5 highly detailed, unique, practical, and non-generic engineering project ideas for a student with the following profile:
    - Branch: ${prefs.branch}
    - Skill Level: ${prefs.skillLevel}
    - Domain: ${prefs.domain}
    ${prefs.timeAvailable ? `- Time Available: ${prefs.timeAvailable}` : ''}
    ${prefs.teamSize ? `- Team Size: ${prefs.teamSize}` : ''}
    ${prefs.keywords ? `- Interest Keywords: ${prefs.keywords}` : ''}

    Avoid overused ideas like basic chat apps or simple CRUD systems unless significantly enhanced. The ideas must be tailored to their skill level and branch. Provide a complete, structured, and practical project plan for each. Make them highly informative, well-explained, and elaborated.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      systemInstruction:
        'You are an expert engineering mentor and product designer. Your goal is to provide highly practical, unique, and resume-worthy project ideas for students. Structure your response clearly and elaborate deeply on each idea.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: 'A unique identifier (e.g., a short slug).' },
            title: { type: Type.STRING, description: 'The project title.' },
            category: { type: Type.STRING, description: 'The broad category or domain of the project.' },
            problemStatement: { type: Type.STRING, description: 'A detailed explanation of the problem this project solves.' },
            solution: { type: Type.STRING, description: 'A comprehensive explanation of the proposed solution and how it works.' },
            relevance: { type: Type.STRING, description: 'A deep dive into why this project matters in the real world and its impact.' },
            difficulty: { type: Type.STRING, description: 'Beginner, Intermediate, or Advanced.' },
            timeToComplete: { type: Type.STRING, description: 'Estimated time to complete (e.g., 2 weeks).' },
            resumeValue: { type: Type.STRING, description: 'A detailed explanation of how this helps their career or resume.' },
            techStack: {
              type: Type.OBJECT,
              properties: {
                frontend: { type: Type.ARRAY, items: { type: Type.STRING } },
                backend: { type: Type.ARRAY, items: { type: Type.STRING } },
                tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                database: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING, description: 'e.g., Phase 1' },
                  title: { type: Type.STRING, description: 'e.g., Research & Setup' },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['phase', 'title', 'tasks'],
              },
            },
            datasetSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            expectedChallenges: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            'id',
            'title',
            'category',
            'problemStatement',
            'solution',
            'relevance',
            'difficulty',
            'timeToComplete',
            'resumeValue',
            'techStack',
            'roadmap',
            'expectedChallenges',
          ],
        },
      },
    },
  });

  try {
    let text = response.text || '[]';
    // Strip markdown code blocks if the model wraps the JSON
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const ideas: ProjectIdea[] = JSON.parse(text);
    return ideas;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return [];
  }
}
