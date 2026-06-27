# Contributing

## Setup

```bash
git clone https://github.com/yatin-rai/ui-ux-consultant-skill.git
cd ui-ux-consultant-skill
cd cli && npm install
```

## Making Changes

- Skill content lives in `src/ui-ux-consultant/`
- CLI code lives in `cli/src/`
- Always sync assets before building: `npm run sync:assets`

## Commits

Use Conventional Commits — this drives automated versioning:

| Prefix | Bump | Example |
|--------|------|---------|
| `fix:` | Patch | `fix: correct angular template syntax` |
| `feat:` | Minor | `feat: add Ionic framework support` |
| `feat!:` | Major | `feat!: restructure all framework files` |
| `docs:` | None | `docs: update README` |
| `chore:` | None | `chore: update dependencies` |

Useful scopes: `(angular)`, `(react)`, `(vue)`, `(flutter)`, `(cli)`, `(catalog)`, `(docs)`

## Branch Strategy

- All changes go to `dev` first via PRs
- `dev` → beta prerelease on npm (`@beta`)
- `main` → stable release (`@latest`)
- Never push directly to `main`

## PRs

- Branch from `dev`, target `dev`
- CI must pass before merge
