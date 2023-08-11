import { type Metadata } from "next";
import { dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { ReactQueryHydrate } from "@/components/hydrate-client";
import { JobDetails } from "./job-details";
import { prefetchJobDetails } from "@/hooks/use-jobs";

interface PageProps {
  params: { uuid: string };
}

export default async function Job({ params }: PageProps) {
  await prefetchJobDetails(params.uuid);

  return (
    <ReactQueryHydrate state={dehydrate(getQueryClient())}>
      <main className="flex min-h-screen flex-col items-center justify-between p-10">
        <JobDetails uuid={params.uuid} />
      </main>
    </ReactQueryHydrate>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const uuid = params.uuid;
  return {
    title: `Job ${uuid}`,
  };
}
