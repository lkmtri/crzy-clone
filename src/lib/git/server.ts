"use server";

import { Job } from "@/types";
import { exec as _exec } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

const exec = (command: string) =>
  new Promise((res, rej) =>
    _exec(command, (err, stdout, stderr) => {
      if (err) {
        rej(stderr);
        return;
      }
      res(stdout);
    })
  );

export const runJob = async (job: Job) => {
  const dir = path.join(process.cwd(), "jobs", job.uuid);
  const newFile = path.join(dir, "commit.log");
  const newBranch = `crzy-clone-${job.uuid}`;

  // Clone repo
  await exec(`git clone --depth 1 ${job.url} ${dir}`);

  // Make some changes
  await writeFile(newFile, job.uuid, "utf-8");

  // Commit changes to a new branch
  await exec(`git -C ${dir} checkout -b ${newBranch}`);
  await exec(`git -C ${dir} add --all`);
  await exec(`git -C ${dir} commit -m 'Commit Job ${job.uuid}'`);

  // Push the new commit to the remote repo
  await exec(`git -C ${dir} push origin`);
};
