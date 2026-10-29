"use server";

import { updateTag } from "next/cache";

export async function refreshProject(projectId) {
  if (typeof projectId !== "string" || !projectId) return;

  updateTag(`project-${projectId}`);
}