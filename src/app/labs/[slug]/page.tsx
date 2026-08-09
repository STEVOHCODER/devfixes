import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UniversalLab } from "@/components/universal-lab";
import { getLab, labs } from "@/lib/labs-data";

export function generateStaticParams() {
  return labs.map((lab) => ({ slug: lab.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) return {};

  return {
    title: lab.name,
    description: lab.description,
    alternates: { canonical: `/labs/${lab.slug}` },
  };
}

export default async function LabPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();

  return <UniversalLab initialEnvironment={lab.slug} />;
}
