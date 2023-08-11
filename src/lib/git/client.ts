"use client";

import { Job } from "@/types";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import LightningFS from "@isomorphic-git/lightning-fs";

const corsProxy = "https://cors.isomorphic-git.org";

export const runJob = async (job: Job) => {
  const dir = `/${job.uuid}`;
  const fs = new LightningFS("fs");
  const pfs = fs.promises;
  const fileName = "commit.log";

  await pfs.mkdir(dir);

  // Clone repo to directory
  await git.clone({
    fs,
    http,
    dir,
    corsProxy,
    url: job.url,
    singleBranch: true,
    depth: 1,
  });

  // Make local changes
  await pfs.writeFile(`${dir}/${fileName}`, job.uuid, "utf8");

  // Commit changes to a new branch
  await git.branch({ fs, dir, ref: `crzy-clone-${job.uuid}`, checkout: true });
  await git.add({ fs, dir, filepath: fileName });
  await git.commit({
    fs,
    dir,
    message: `Job ${job.uuid}`,
    author: {
      name: "CrzyClone",
      email: "dev@crzy-clone.io",
    },
  });

  // Push to remote
  await git.push({
    fs,
    http,
    dir,
    corsProxy,
  });

  await pfs.unlink(dir);
};
