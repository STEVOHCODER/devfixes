import { z } from "zod";

const solutionSchema = z.object({
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(8).max(1200),
  probability: z.number().int().min(1).max(100),
  commands: z.array(z.string().trim().min(1).max(1000)).max(20).optional(),
});

const alternativeSchema = z.object({
  environment: z.string().trim().min(2).max(80),
  commands: z.array(z.string().trim().min(1).max(1000)).min(1).max(20),
  note: z.string().trim().min(3).max(1000),
});

const faqSchema = z.object({
  question: z.string().trim().min(5).max(220),
  answer: z.string().trim().min(10).max(2000),
});

const referenceSchema = z.object({
  label: z.string().trim().min(2).max(180),
  url: z.url(),
  type: z.enum(["Official docs", "GitHub", "Discussion"]),
});

export const errorArticleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug."),
  title: z.string().trim().min(5).max(260),
  excerpt: z.string().trim().min(20).max(500),
  language: z.string().trim().min(1).max(80),
  framework: z.string().trim().max(80).optional(),
  category: z.string().trim().min(2).max(100),
  severity: z.enum(["Low", "Medium", "High"]),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  fixTime: z.string().trim().min(2).max(40),
  popularity: z.number().int().min(0).max(100),
  views: z.number().int().min(0),
  trend: z.number().int().min(-100).max(1000),
  tags: z.array(z.string().trim().min(1).max(60)).min(1).max(30),
  whatItMeans: z.string().trim().min(20).max(5000),
  causes: z.array(z.string().trim().min(3).max(1000)).min(1).max(30),
  aiExplanation: z.string().trim().min(20).max(5000),
  quickFix: z.object({
    commands: z.array(z.string().trim().min(1).max(1000)).min(1).max(30),
    expected: z.string().trim().min(3).max(2000),
  }),
  solutions: z.array(solutionSchema).min(1).max(20),
  alternatives: z.array(alternativeSchema).max(20),
  brokenCode: z.string().max(20_000),
  fixedCode: z.string().max(20_000),
  codeLanguage: z.string().trim().min(1).max(50),
  relatedSlugs: z.array(z.string().trim().min(1).max(180)).max(20),
  faqs: z.array(faqSchema).max(20),
  references: z.array(referenceSchema).max(30),
  verifiedAt: z.iso.date(),
});

export const adminErrorSchema = z.object({
  status: z.enum(["draft", "review", "published"]),
  article: errorArticleSchema,
});

export const tutorialArticleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug."),
  title: z.string().trim().min(5).max(260),
  excerpt: z.string().trim().min(20).max(500),
  technology: z.string().trim().min(1).max(80),
  category: z.string().trim().min(2).max(100),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  estimatedTime: z.string().trim().min(2).max(40),
  tags: z.array(z.string().trim().min(1).max(60)).min(1).max(30),
  prerequisites: z.array(z.string().trim().min(3).max(500)).max(30),
  outcomes: z.array(z.string().trim().min(3).max(500)).min(1).max(30),
  body: z.string().trim().min(80).max(100_000),
  relatedErrorSlugs: z.array(z.string().trim().min(1).max(180)).max(20),
  faqs: z.array(faqSchema).max(20),
  references: z.array(referenceSchema).max(30),
  publishedAt: z.iso.date(),
});

export const adminTutorialSchema = z.object({
  status: z.enum(["draft", "review", "published"]),
  tutorial: tutorialArticleSchema,
});
