(() => {
  "use strict";

  const owner = "sysadmingranbell";
  const repository = "Chromium_PQC";
  const releasesUrl = `https://api.github.com/repos/${owner}/${repository}/releases?per_page=100`;
  const releasePage = `https://github.com/${owner}/${repository}/releases`;
  const status = document.getElementById("download-status");
  const list = document.getElementById("release-list");
  const installerExtensions = /\.(exe|msi|dmg|pkg|zip)$/i;
  const platforms = [
    { id: "windows", label: "Windows", nameMatch: /windows|win32|win64|win-x64|win-arm64/i },
    { id: "macos", label: "macOS", nameMatch: /macos|mac-os|darwin|osx|mac-universal|mac-arm64|mac-x64/i },
  ];

  function isInstaller(asset) {
    return installerExtensions.test(asset.name) && platforms.some((platform) => platform.nameMatch.test(asset.name));
  }

  function formatSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "Size unavailable";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit += 1;
    }
    return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
  }

  function addAssetLink(container, asset) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const size = document.createElement("span");
    link.className = "asset-link";
    link.href = asset.browser_download_url;
    link.textContent = asset.name;
    size.className = "asset-size";
    size.textContent = formatSize(asset.size);
    link.append(size);
    item.append(link);
    container.append(item);
  }

  function addPlatform(card, release, platform) {
    const section = document.createElement("section");
    const heading = document.createElement("h3");
    const assetList = document.createElement("ul");
    const assets = (release.assets || []).filter((asset) => isInstaller(asset) && platform.nameMatch.test(asset.name));
    section.className = "platform";
    heading.textContent = platform.label;
    assetList.className = "asset-list";
    section.append(heading);

    if (assets.length === 0) {
      const message = document.createElement("p");
      message.className = "not-available";
      message.textContent = `No ${platform.label} installer in this release.`;
      section.append(message);
    } else {
      assets.forEach((asset) => addAssetLink(assetList, asset));
      section.append(assetList);
    }
    card.append(section);
  }

  function createReleaseCard(release) {
    const card = document.createElement("article");
    const header = document.createElement("div");
    const title = document.createElement("h2");
    const date = document.createElement("time");
    const grid = document.createElement("div");
    const notes = document.createElement("a");
    const checksumAssets = (release.assets || []).filter((asset) => /sha256|checksums?/i.test(asset.name));
    const dateValue = release.published_at ? new Date(release.published_at) : null;

    card.className = "release-card";
    header.className = "release-heading";
    title.textContent = release.name || release.tag_name || "Stable release";
    date.className = "release-date";
    if (dateValue && !Number.isNaN(dateValue.valueOf())) {
      date.dateTime = dateValue.toISOString();
      date.textContent = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(dateValue);
    } else {
      date.textContent = "Publication date unavailable";
    }
    header.append(title, date);
    grid.className = "platform-grid";
    platforms.forEach((platform) => addPlatform(grid, release, platform));
    notes.className = "release-notes";
    notes.href = release.html_url || releasePage;
    notes.textContent = "View release notes";
    card.append(header, grid, notes);
    checksumAssets.forEach((asset, index) => {
      const checksumLink = document.createElement("a");
      checksumLink.className = "release-notes";
      checksumLink.href = asset.browser_download_url;
      checksumLink.textContent = `${index === 0 ? "Checksums: " : ""}${asset.name}`;
      card.append(document.createTextNode(index === 0 ? " · " : ", "), checksumLink);
    });
    return card;
  }

  async function loadReleases() {
    try {
      const response = await fetch(releasesUrl, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Release service unavailable");
      const releases = await response.json();
      const stableReleases = releases.filter((release) => !release.draft && !release.prerelease);

      list.replaceChildren();
      if (stableReleases.length === 0) {
        status.textContent = "No stable installer releases have been published yet.";
        return;
      }

      stableReleases.forEach((release) => list.append(createReleaseCard(release)));
      status.textContent = `Showing ${stableReleases.length} stable release${stableReleases.length === 1 ? "" : "s"}. Installers are listed by operating system and version.`;
    } catch {
      status.textContent = "The release list could not be loaded right now. You can browse releases directly on GitHub.";
      const fallback = document.createElement("a");
      fallback.href = releasePage;
      fallback.textContent = "Open GitHub Releases";
      status.append(" ", fallback);
    }
  }

  loadReleases();
})();
