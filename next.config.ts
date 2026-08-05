import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const [repositoryOwner = "", repositoryName = ""] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
const isUserSite = repositoryName === `${repositoryOwner}.github.io`;
const basePath = isGitHubPages && repositoryName && !isUserSite ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_SITE_BASE_PATH: basePath },
};

export default nextConfig;
