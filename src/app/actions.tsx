"use server";

import { runJob } from "@/lib/git/server";
import { createJob, updateJobStatus } from "@/lib/storage";
import { RedirectType } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

const serverModeEnabled = process.env.SERVER_MODE_ENABLED === "true";

export async function cloneGitRepo(data: FormData) {
  const url = data.get("git_url") as string;
  const job = await createJob(url);

  if (serverModeEnabled) {
    await updateJobStatus(job.uuid, "in-progress");
    runJob(job)
      .then(() => {
        updateJobStatus(job.uuid, "completed");
      })
      .catch((err) => {
        updateJobStatus(job.uuid, "failed", String(err));
      });
  }

  redirect(`/jobs/${job.uuid}`, RedirectType.push);
}
