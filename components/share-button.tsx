"use client";

import { useState } from "react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="share-button" type="button" onClick={copyLink}>
      {copied ? "已复制链接 ✓" : "复制文章链接"}
    </button>
  );
}
