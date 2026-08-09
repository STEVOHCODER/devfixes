import type { Metadata } from "next";
import { AskQuestionForm } from "@/components/ask-question-form";

export const metadata: Metadata = { title: "Ask a programming question", description: "Create a minimal, reproducible debugging question with an exact error, code example, and relevant tags.", robots: { index: false, follow: true } };

export default function AskQuestionPage() { return <AskQuestionForm />; }
