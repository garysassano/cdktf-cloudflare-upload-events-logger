import { javascript } from "projen";
import { CdktfTypeScriptApp } from "projen-cdktf-app-ts";

const project = new CdktfTypeScriptApp({
  cdktfVersion: "0.20.11",
  defaultReleaseBranch: "main",
  depsUpgradeOptions: { workflow: false },
  devDeps: ["projen-cdktf-app-ts"],
  name: "cdktf-cloudflare-upload-events-logger",
  eslint: true,
  gitignore: ["*.tfstate*"],
  minNodeVersion: "22.14.0",
  packageManager: javascript.NodePackageManager.PNPM,
  pnpmVersion: "9",
  prettier: true,
  projenrcTs: true,

  terraformProviders: ["cloudflare/cloudflare@~> 5.1.0"],
});

// Generate CDKTF constructs after installing deps
project.tasks.tryFind("install")?.spawn(project.cdktfTasks.get);

project.synth();
