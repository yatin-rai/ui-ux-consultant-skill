# Dev Guide for Contributors Using Claude Code

## Repo Structure

- `src/ui-ux-consultant/` — skill content source of truth (SKILL.md + all references)
- `cli/` — npm package and installer CLI
- `cli/assets/` — bundled copy of skill content (synced from src/, gitignored)
- `.releaserc.json` — semantic-release config
- `.github/workflows/` — CI and release automation

## Key Commands

```bash
cd cli
npm run sync:assets   # copy src/ → cli/assets/ before building
npm run build         # compile TypeScript → dist/
node dist/index.js versions   # verify CLI works
```

## Before Every Commit

1. Update content in `src/ui-ux-consultant/`
2. Use conventional commit prefix (`feat:`, `fix:`, `docs:`, etc.)
3. Push to `dev` — CI runs automatically

## Release Flow

- `dev` push → beta prerelease (`0.1.0-beta.1`)
- PR `dev → main` → stable release (`0.1.0`)
- semantic-release handles versioning, changelog, and npm publish automatically
