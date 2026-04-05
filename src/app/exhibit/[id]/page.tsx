import { FAILURES } from "@/data/companies";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ExhibitPage from "./ExhibitPage";

export function generateStaticParams() {
  return FAILURES.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const failure = FAILURES.find((f) => f.id === id);
  if (!failure) return {};
  return {
    title: `${failure.company} — YCOMBINATOR.FYI`,
    description: failure.oneLiner,
    openGraph: {
      title: `${failure.company} — YCOMBINATOR.FYI`,
      description: failure.oneLiner,
      siteName: "YCOMBINATOR.FYI",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const failure = FAILURES.find((f) => f.id === id);
  if (!failure) notFound();
  const index = FAILURES.indexOf(failure);
  const prev = index > 0 ? FAILURES[index - 1] : null;
  const next = index < FAILURES.length - 1 ? FAILURES[index + 1] : null;
  return <ExhibitPage failure={failure} prev={prev} next={next} />;
}
