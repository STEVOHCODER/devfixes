export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ErrorSolution = {
  title: string;
  description: string;
  probability: number;
  commands?: string[];
};

export type ErrorAlternative = {
  environment: string;
  commands: string[];
  note: string;
};

export type ErrorFaq = {
  question: string;
  answer: string;
};

export type ErrorReference = {
  label: string;
  url: string;
  type: "Official docs" | "GitHub" | "Discussion";
};

export type ErrorArticle = {
  slug: string;
  title: string;
  excerpt: string;
  language: string;
  framework?: string;
  category: string;
  severity: "Low" | "Medium" | "High";
  difficulty: Difficulty;
  fixTime: string;
  popularity: number;
  views: number;
  trend: number;
  tags: string[];
  whatItMeans: string;
  causes: string[];
  aiExplanation: string;
  quickFix: {
    commands: string[];
    expected: string;
  };
  solutions: ErrorSolution[];
  alternatives: ErrorAlternative[];
  brokenCode: string;
  fixedCode: string;
  codeLanguage: string;
  relatedSlugs: string[];
  faqs: ErrorFaq[];
  references: ErrorReference[];
  verifiedAt: string;
};

export type TutorialArticle = {
  slug: string;
  title: string;
  excerpt: string;
  technology: string;
  category: string;
  difficulty: Difficulty;
  estimatedTime: string;
  tags: string[];
  prerequisites: string[];
  outcomes: string[];
  body: string;
  relatedErrorSlugs: string[];
  faqs: ErrorFaq[];
  references: ErrorReference[];
  publishedAt: string;
};

export type Fingerprint = {
  language: string;
  framework?: string;
  errorType: string;
  rootCause: string;
  confidence: number;
  severity: ErrorArticle["severity"];
  relevantLines: number[];
  matchedSlug?: string;
};

export type DebugAnalysis = {
  language: string;
  framework?: string;
  errorType: string;
  summary: string;
  explanation: string;
  rootCause: string;
  confidence: number;
  suspiciousLines: Array<{
    line: number;
    reason: string;
  }>;
  fixes: Array<{
    title: string;
    probability: number;
    explanation: string;
    commands: string[];
    correctedCode?: string;
  }>;
  beginnerMistakes: string[];
  prevention: string[];
  relatedSlugs: string[];
  source: "ai" | "local";
};
