"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode, useEffect } from "react";
import { Status } from "@/types";
import { useJobDetails, useJobTrigger } from "@/hooks/use-jobs";

const statusDisplay: Record<Status, string> = {
  queued: "Queued",
  completed: "Completed",
  failed: "Failed",
  "in-progress": "In Progress",
};

interface JobDetail {
  key: string;
  title: ReactNode;
  description: ReactNode;
}

export function JobDetails({ uuid }: { uuid: string }) {
  const { job } = useJobDetails(uuid);
  const triggerJob = useJobTrigger();

  useEffect(() => {
    if (job) {
      triggerJob(job);
    }
  }, [job, triggerJob]);

  if (!job) {
    notFound();
  }

  const details: JobDetail[] = [
    {
      key: "uuid",
      title: "Job ID",
      description: (
        <Link
          className="text-slate-500"
          href={`/jobs/${job.uuid}`}
          target="_blank">
          {job.uuid} <ExternalLink className="inline-block" size={14} />
        </Link>
      ),
    },
    {
      key: "url",
      title: "Git URL",
      description: (
        <a href={job.url} target="_blank" rel="noreferrer">
          <p
            className="inline-block text-slate-500 overflow-hidden text-ellipsis"
            style={{ maxWidth: "calc(100%)" }}>
            {job.url} <ExternalLink className="inline-block" size={14} />
          </p>
        </a>
      ),
    },
    {
      key: "status",
      title: "Status",
      description: statusDisplay[job.status],
    },
  ];

  if (job.status === "failed" && job.error) {
    details.push({
      key: "error",
      title: "Error",
      description: <code>{String(job.error)}</code>,
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {details.map(({ key, title, description }) => (
            <div key={key}>
              <p className="font-semibold">{title}</p>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/">
          <Button className="space-x-1" variant="secondary">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
