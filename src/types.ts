export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ProjectIdea {
  id: string;
  title: string;
  category: string;
  problemStatement: string;
  solution: string;
  relevance: string;
  difficulty: SkillLevel;
  timeToComplete: string;
  resumeValue: string;
  techStack: {
    frontend?: string[];
    backend?: string[];
    tools?: string[];
    database?: string[];
  };
  roadmap: {
    phase: string;
    title: string;
    tasks: string[];
  }[];
  datasetSuggestions?: string[];
  expectedChallenges: string[];
}

export interface UserPreferences {
  branch: string;
  skillLevel: SkillLevel;
  domain: string;
  timeAvailable?: string;
  teamSize?: string;
  keywords?: string;
}
