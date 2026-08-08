import "server-only";

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { adminTutorialSchema } from "@/lib/article-schema";
import type { TutorialArticle } from "@/lib/types";

export type TutorialStatus = "draft" | "review" | "published";

export type LocalTutorialRecord = {
  status: TutorialStatus;
  tutorial: TutorialArticle;
  updatedAt: string;
};

const tutorialDirectory = path.resolve(
  process.env.DEVFIXES_CONTENT_DIR ?? path.join(process.cwd(), "content"),
  "tutorials",
);

export function localTutorialPublishingEnabled() {
  return (
    process.env.DEVFIXES_LOCAL_PUBLISHING === "true" ||
    process.env.NODE_ENV !== "production"
  );
}

function recordPath(slug: string) {
  const filePath = path.resolve(tutorialDirectory, `${slug}.json`);
  if (!filePath.startsWith(`${tutorialDirectory}${path.sep}`)) {
    throw new Error("Invalid tutorial storage path.");
  }
  return filePath;
}

export async function getLocalTutorialRecords(): Promise<LocalTutorialRecord[]> {
  let files: string[];
  try {
    files = await readdir(tutorialDirectory);
  } catch {
    return [];
  }

  const records = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        try {
          const raw = JSON.parse(
            await readFile(path.join(tutorialDirectory, file), "utf8"),
          ) as unknown;
          if (typeof raw !== "object" || raw === null) return null;
          const parsed = adminTutorialSchema.safeParse(raw);
          if (!parsed.success) return null;
          const updatedAt =
            "updatedAt" in raw && typeof raw.updatedAt === "string"
              ? raw.updatedAt
              : `${parsed.data.tutorial.publishedAt}T00:00:00.000Z`;
          return { ...parsed.data, updatedAt } satisfies LocalTutorialRecord;
        } catch {
          return null;
        }
      }),
  );

  return records
    .filter((record): record is LocalTutorialRecord => Boolean(record))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function saveLocalTutorial(
  status: TutorialStatus,
  tutorial: TutorialArticle,
) {
  if (!localTutorialPublishingEnabled()) {
    throw new Error("Local tutorial publishing is disabled.");
  }

  const record: LocalTutorialRecord = {
    status,
    tutorial,
    updatedAt: new Date().toISOString(),
  };
  await mkdir(tutorialDirectory, { recursive: true });
  await writeFile(
    recordPath(tutorial.slug),
    `${JSON.stringify(record, null, 2)}\n`,
    "utf8",
  );
  return record;
}
