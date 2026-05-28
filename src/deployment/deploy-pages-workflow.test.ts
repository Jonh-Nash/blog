import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import yaml from "js-yaml";
import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";
import packageJson from "../../package.json";

const workflowPath = join(process.cwd(), ".github", "workflows", "deploy-pages.yml");

type Workflow = {
  name: string;
  on: {
    push: {
      branches: string[];
    };
  };
  permissions?: Record<string, string>;
  concurrency: {
    group: string;
    "cancel-in-progress": boolean;
  };
  jobs: Record<string, Job>;
};

type Job = {
  needs?: string;
  "runs-on"?: string;
  environment?: {
    name: string;
    url: string;
  };
  permissions?: Record<string, string>;
  steps: Step[];
};

type Step = {
  name?: string;
  uses?: string;
  run?: string;
  id?: string;
  with?: Record<string, string | number | boolean>;
};

const loadDeployPagesWorkflow = (): Workflow => {
  if (!existsSync(workflowPath)) {
    throw new Error(`GitHub Pages workflow is missing: ${workflowPath}`);
  }

  const workflow = yaml.load(readFileSync(workflowPath, "utf8"));

  if (!isWorkflow(workflow)) {
    throw new Error("GitHub Pages workflow has an invalid root shape");
  }

  return workflow;
};

const isWorkflow = (value: unknown): value is Workflow => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === "string" &&
    isRecord(value.on) &&
    isRecord(value.on.push) &&
    Array.isArray(value.on.push.branches) &&
    isRecord(value.concurrency) &&
    isRecord(value.jobs)
  );
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const findStepByUses = (job: Job, action: string): Step => {
  const step = job.steps.find((candidate) => candidate.uses === action);

  if (step === undefined) {
    throw new Error(`Expected action step is missing: ${action}`);
  }

  return step;
};

const getJob = (workflow: Workflow, jobName: string): Job => {
  const job = workflow.jobs[jobName];

  if (job === undefined) {
    throw new Error(`Expected workflow job is missing: ${jobName}`);
  }

  return job;
};

const findStepByRun = (job: Job, command: string): Step => {
  const step = job.steps.find((candidate) => candidate.run === command);

  if (step === undefined) {
    throw new Error(`Expected run step is missing: ${command}`);
  }

  return step;
};

describe("GitHub Pages deployment workflow", () => {
  it("given a main branch push when GitHub evaluates events then runs only for main pushes", () => {
    const workflow = loadDeployPagesWorkflow();

    expect(workflow.on.push.branches).toEqual(["main"]);
  });

  it("given GitHub Pages deployment when GitHub evaluates permissions then keeps build and deploy privileges separated", () => {
    const workflow = loadDeployPagesWorkflow();
    const buildJob = getJob(workflow, "build");
    const deployJob = getJob(workflow, "deploy");

    expect(workflow.permissions).toBeUndefined();
    expect(buildJob.permissions).toEqual({
      contents: "read",
    });
    expect(deployJob.permissions).toEqual({
      pages: "write",
      "id-token": "write",
    });
  });

  it("given repeated Pages deployments when GitHub schedules runs then serializes the Pages deploy group", () => {
    const workflow = loadDeployPagesWorkflow();

    expect(workflow.concurrency).toEqual({
      group: "pages",
      "cancel-in-progress": false,
    });
  });

  it("given the existing npm build contract when the build job runs then installs from the lockfile and builds the static export", () => {
    const workflow = loadDeployPagesWorkflow();
    const buildJob = getJob(workflow, "build");

    expect(existsSync(join(process.cwd(), "package-lock.json"))).toBe(true);
    expect(packageJson.scripts.build).toBe("next build");
    expect(nextConfig).toMatchObject({
      output: "export",
      basePath: "/blog",
      assetPrefix: "/blog/",
      trailingSlash: true,
    });
    expect(buildJob["runs-on"]).toBe("ubuntu-latest");
    expect(findStepByUses(buildJob, "actions/checkout@v6")).toBeTruthy();
    expect(findStepByUses(buildJob, "actions/setup-node@v6").with).toMatchObject({
      "node-version": 22,
      cache: "npm",
    });
    expect(findStepByRun(buildJob, "npm ci")).toBeTruthy();
    expect(findStepByRun(buildJob, "npm run build")).toBeTruthy();
  });

  it("given a completed static build when the build job uploads an artifact then uploads the full out directory for Pages", () => {
    const workflow = loadDeployPagesWorkflow();
    const buildJob = getJob(workflow, "build");

    expect(findStepByUses(buildJob, "actions/configure-pages@v5")).toBeTruthy();
    expect(findStepByUses(buildJob, "actions/upload-pages-artifact@v4").with).toMatchObject({
      path: "./out",
    });
  });

  it("given an uploaded Pages artifact when the deploy job runs then deploys through the GitHub Pages action", () => {
    const workflow = loadDeployPagesWorkflow();
    const deployJob = getJob(workflow, "deploy");
    const deployStep = findStepByUses(deployJob, "actions/deploy-pages@v4");

    expect(deployJob.needs).toBe("build");
    expect(deployJob.environment).toEqual({
      name: "github-pages",
      url: "${{ steps.deployment.outputs.page_url }}",
    });
    expect(deployStep.id).toBe("deployment");
  });
});
