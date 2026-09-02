import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const generatedPosts = await readFile(new URL("../content/generated-posts.ts", import.meta.url), "utf8");
const globalStyles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("renders Obsidian callouts instead of exposing their marker", () => {
  assert.ok(generatedPosts.includes('class=\\"obsidian-callout obsidian-callout--note\\" data-callout=\\"引言\\"'));
  assert.ok(generatedPosts.includes('class=\\"obsidian-callout obsidian-callout--tip\\" data-callout=\\"Tip\\"'));
  assert.ok(!generatedPosts.includes('<blockquote>\\n<p>[!引言]'));
  assert.ok(!generatedPosts.includes('<blockquote>\\n<p>[!Tip]'));
});

test("defines a complete descending article heading scale", () => {
  for (const level of [1, 2, 3, 4, 5, 6]) {
    assert.match(globalStyles, new RegExp(`\\.prose h${level} \\{ font-size:`));
  }
});
