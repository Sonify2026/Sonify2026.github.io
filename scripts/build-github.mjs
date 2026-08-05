import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const nextBin = fileURLToPath(import.meta.resolve("next/dist/bin/next"));
const result = spawnSync(process.execPath, [nextBin, "build", "--webpack"], {
  env: { ...process.env, GITHUB_PAGES: "true" },
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
