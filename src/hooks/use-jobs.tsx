import { useMutation, useQuery } from "@tanstack/react-query";
import { getJob, updateJobStatus } from "@/lib/storage";
import { getQueryClient } from "@/lib/query-client";
import { Job } from "@/types";
import { runJob } from "@/lib/git/client";

export const queryKeys = {
  job: (uuid: string) => ["job", uuid] as const,
};

export const prefetchJobDetails = async (uuid: string) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(queryKeys.job(uuid), () => getJob(uuid));
};

export const useJobDetails = (uuid: string) => {
  const { data: job, ...query } = useQuery(
    queryKeys.job(uuid),
    async () => {
      return await getJob(uuid);
    },
    {
      refetchInterval: (job) => {
        if (job?.status === "completed" || job?.status === "failed") {
          return Infinity;
        }
        return 2000;
      },
    }
  );

  return { job, ...query };
};

export const useJobTrigger = () => {
  const { mutate } = useMutation({
    mutationFn: async (job: Job) => {
      if (job.status !== "created") {
        return;
      }
      await updateJobStatus(job.uuid, "in-progress");
      await runJob(job);
      return job;
    },
    onSuccess: (job) => {
      if (!job) return;
      updateJobStatus(job.uuid, "completed");
    },
    onError: (err, job) => {
      updateJobStatus(job.uuid, "failed", String(err));
    },
  });

  return mutate;
};
