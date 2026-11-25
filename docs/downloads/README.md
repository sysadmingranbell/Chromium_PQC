# OnRouteWay download distribution

## Canonical share point

- Public download page: `https://sysadmingranbell.github.io/Chromium_PQC/downloads/`
- Canonical release and binary storage: `https://github.com/sysadmingranbell/Chromium_PQC/releases`
- GitHub Pages publishes from the `main` branch's `/docs` directory.

The page lists every published, non-draft, non-prerelease release and groups installer assets by Windows and macOS. It reads assets directly from the public GitHub Releases API; no binary is mirrored or fabricated in the repository. If the release list is empty or an OS has no matching asset, the page says so rather than exposing a dead download link.

## Asset naming convention

Attach platform and architecture to every asset filename so the download page can classify it safely. Examples:

- `OnRouteWay-Windows-x64-v1.2.3.msi`
- `OnRouteWay-Windows-arm64-v1.2.3.exe`
- `OnRouteWay-macOS-universal-v1.2.3.dmg`
- `OnRouteWay-macOS-arm64-v1.2.3.pkg`
- `SHA256SUMS.txt`

Supported installer/archive extensions are `.exe`, `.msi`, `.dmg`, `.pkg` and `.zip`. The asset filename must contain a platform marker such as `Windows`, `win-x64`, `macOS`, `mac-universal` or `darwin`. Each release tag is the application version; the page displays each stable version that has been published.

## Release safety

- Do not create a release until real platform builds exist and have been tested.
- Publish only installers for which the source, target OS/architecture and signing status are known.
- Include `SHA256SUMS.txt` generated from the final uploaded bytes and publish concise release notes with supported OS versions.
- Keep prereleases and drafts off the public download list; the page intentionally excludes them.
- Current project state has no Windows or macOS installer builds, so the page must report that downloads are not yet available.
