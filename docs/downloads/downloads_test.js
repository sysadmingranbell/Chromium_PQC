const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync(new URL("./downloads.js", `file://${__filename}`), "utf8");

class FakeElement {
  constructor(tagName = "div") {
    this.tagName = tagName;
    this.children = [];
    this._textContent = "";
  }
  set textContent(value) {
    this._textContent = String(value);
    this.children = [];
  }
  get textContent() {
    return this._textContent + this.children.map((child) => child.textContent || child).join("");
  }
  append(...children) {
    this.children.push(...children);
  }
  replaceChildren(...children) {
    this.children = [...children];
  }
}

async function render(releases) {
  const elements = {
    "download-status": new FakeElement("p"),
    "release-list": new FakeElement("div"),
  };
  const document = {
    getElementById: (id) => elements[id],
    createElement: (tag) => new FakeElement(tag),
    createTextNode: (text) => String(text),
  };
  const context = {
    document,
    fetch: async () => ({ ok: true, json: async () => releases }),
    Intl,
    Date,
    Number,
  };
  vm.runInNewContext(source, context);
  await new Promise((resolve) => setImmediate(resolve));
  return elements;
}

function collect(root, predicate, output = []) {
  if (root && typeof root === "object") {
    if (predicate(root)) output.push(root);
    for (const child of root.children || []) collect(child, predicate, output);
  }
  return output;
}

(async () => {
  const empty = await render([]);
  assert.match(empty["download-status"].textContent, /No stable installer releases/);
  assert.equal(empty["release-list"].children.length, 0);

  const withAssets = await render([
    {
      name: "OnRouteWay 1.2.3",
      tag_name: "v1.2.3",
      html_url: "https://github.com/sysadmingranbell/Chromium_PQC/releases/tag/v1.2.3",
      published_at: "2026-11-25T12:00:00Z",
      draft: false,
      prerelease: false,
      assets: [
        { name: "OnRouteWay-Windows-x64-v1.2.3.msi", browser_download_url: "https://github.com/example/win.msi", size: 1024 },
        { name: "OnRouteWay-macOS-universal-v1.2.3.dmg", browser_download_url: "https://github.com/example/mac.dmg", size: 2048 },
        { name: "SHA256SUMS.txt", browser_download_url: "https://github.com/example/SHA256SUMS.txt", size: 128 },
        { name: "OnRouteWay-linux-x64.deb", browser_download_url: "https://github.com/example/linux.deb", size: 4096 },
      ],
    },
    { name: "Preview", tag_name: "v1.3.0-rc1", draft: false, prerelease: true, assets: [] },
  ]);
  assert.match(withAssets["download-status"].textContent, /Showing 1 stable release/);
  const anchors = collect(withAssets["release-list"], (node) => node.tagName === "a");
  const labels = anchors.map((node) => node.textContent);
  assert(labels.some((label) => label.includes("Windows-x64-v1.2.3.msi")));
  assert(labels.some((label) => label.includes("macOS-universal-v1.2.3.dmg")));
  assert(labels.some((label) => label.includes("SHA256SUMS.txt")));
  assert(!labels.some((label) => label.includes("linux-x64")));
  console.log("Passed empty-state, stable-release, Windows/macOS asset and checksum tests.");
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
