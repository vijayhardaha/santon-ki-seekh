# AGENTS.md — Contributor & AI-Agent Guide

> This file is a working guide for developers, contributors, and AI agents
> making changes to **संतों की सीख (Santon ki Seekh)**. For the visitor-facing
> overview, read the [README.md](./README.md) first.

---

## 1. Purpose in one minute

**संतों की सीख** is a small TypeScript + Bun toolkit that:

1. Fetches Sant Kabir's dohe (हिंदी couplets) from the live
   [Kabir Dohe API](https://kabirdoheapi.vercel.app).
2. Renders readable **Hindi markdown collections** under `docs/dohe/`
   (100 couplets per file).
3. Builds **downloadable assets** for both **bhajans** (devotional songs) and
   **dohas** (wisdom couplets) into `dist/` in 5 formats:
   `raw.json`, `json`, `txt`, `md`, `csv`.
4. Bundles everything into `all-in-one-assets.zip` and attaches it to each
   GitHub release (see `.github/workflows/release.yml`).

**Bhajans are authored statically in code; dohas are fetched live from the API.**

---

## 2. Repository layout

```
.
├── .github/workflows/release.yml   # Tag-triggered release workflow
├── .husky/
│   ├── commit-msg                    # commitlint (conventional commits)
│   └── pre-push                      # bun run format:check
├── .env.example                     # COUPLETS_API_URL override example
├── LICENSE                          # MIT
├── README.md                        # Visitor-facing docs (SEO + usage)
├── AGENTS.md                        # <- you are here
├── bun.lock                         # Bun lockfile (committed)
├── commitlint.config.mjs            # Conventional-commit rules
├── eslint.config.mjs                # ESLint flat config (ts)
├── prettier.config.mjs              # Prettier rules (@vijayhardaha/dev-config)
├── tsconfig.json                    # Type-checking (noEmit)
├── vitest.config.ts                 # Vitest config + coverage (v8)
├── vitest.setup.ts                  # Silence console output in tests
├── package.json
├── src
│   ├── build.ts                     # Orchestrator: buildDocs + buildAssets
│   ├── buildDocs.ts                 # Fetches dohas -> docs/dohe/*.md
│   ├── buildAssets.ts               # Builds dist/ assets (bhajans + dohas)
│   ├── types.ts                     # Core types
│   ├── constants/index.ts           # API URL, limits, author names, digits
│   ├── data
│   │   ├── bhajans.ts               # Static bhajan dataset (DataEntry[])
│   │   └── dohas.ts                 # API posts -> doha DataEntry[] converter
│   ├── lib
│   │   ├── api.ts                   # Paginated couplet fetching (with retries)
│   │   ├── args.ts                  # --limit / MAX_FILES parsing
│   │   ├── builder.ts               # Builder.run -> generates all formats
│   │   ├── dataGenerator.ts         # raw.json/json/txt/md/csv writers
│   │   ├── fileSystemUtils.ts       # mkdir/writeFile/joinPath helpers
│   │   ├── formatting.ts            # Hindi numerals, danda splitting, md
│   │   ├── utils.ts                 # isPositiveInteger, etc.
│   │   └── index.ts                 # Barrel re-exports for src/lib
│   └── lib/__tests__/*.test.ts      # Unit tests (src/data + src/lib)
└── docs
    ├── bhajans/*.md                 # 20 human-authored bhajan pages w/ meaning
    └── dohe/sant-kabir-ke-dohe-*.md # GENERATED (100 dohas/file)
```

> `dist/` is git-ignored (built on CI). `docs/` is committed.
> `tsconfig.tsbuildinfo` and `coverage/` are also git-ignored.

---

## 3. Prerequisites

- **Bun** >= 1.x — https://bun.sh
- The runtime is Bun; Node is only referenced via `@types/node` (no `node:` polyfills needed beyond what Bun provides).

---

## 4. Setup

```bash
git clone https://github.com/vijayhardaha/santon-ki-seekh.git
cd santon-ki-seekh
bun install          # installs deps AND installs the husky hooks
cp .env.example .env.development   # optional — only to override the API URL
```

> The husky hooks are installed automatically by `prepare` (`husky`) on
> `bun install`. If they're missing: `bun run prepare`.

---

## 5. Scripts reference

| Script          | Command                                | Description                                    |
| --------------- | -------------------------------------- | ---------------------------------------------- |
| `clean`         | `rm -rf docs/dohe dist`                | Remove generated docs + assets                 |
| `clean:docs`    | `rm -rf docs/dohe`                     | Remove only generated dohe collections         |
| `build`         | `bun run src/build.ts`                 | Full build: docs collections **+** dist assets |
| `build:docs`    | `bun run src/buildDocs.ts`             | Dohe markdown collections only (`docs/dohe/`)  |
| `build:assets`  | `bun run src/buildAssets.ts`           | Downloadable assets only (`dist/`)             |
| `build:test`    | `bun run src/build.ts --limit 1`       | Quick limited build for dev/CI sanity checks   |
| `format`        | `prettier --write --log-level error .` | Format everything                              |
| `format:check`  | `prettier --check --log-level error .` | Verify formatting (runs in `pre-push`)         |
| `lint`          | `eslint .`                             | Lint the project                               |
| `lint:fix`      | `eslint . --fix`                       | Auto-fix lint issues                           |
| `tsc`           | `tsc --noEmit`                         | Type-check (no emit)                           |
| `test`          | `vitest run`                           | Run unit tests once                            |
| `test:watch`    | `vitest`                               | Watch mode                                     |
| `test:coverage` | `vitest run --coverage`                | Run with v8 coverage (text/json/html)          |
| `prepare`       | `husky`                                | Install git hooks                              |

---

## 6. Environment variables

Defined in [.env.example](./.env.example) — copy it to `.env.development`
(ignored) before customizing.

| Variable           | Default                           | Purpose                                                                                                                                  |
| ------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `COUPLETS_API_URL` | `https://kabirdoheapi.vercel.app` | Override the doha data source. Consumed by `src/constants/index.ts` (`API_BASE_URL`). Used by `build`, `build:docs`, and `build:assets`. |

---

## 7. Data model & core types (`src/types.ts`)

| Type           | Field                                                                            | Notes                                                           |
| -------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `DataEntry`    | `id`                                                                             | kebab-case unique slug                                          |
|                | `author`                                                                         | Author label, e.g. `संत कबीर दास साहेब` / `गुरु कबीर दास साहेब` |
|                | `content: string[]`                                                              | Lines of the verse (`''` = blank line)                          |
| `BuildMeta`    | `fileName`, `mdTitle`, `data`, `appendNumber`                                    | Per-dataset render config                                       |
| `BuildContext` | `BuildMeta` + `outputDir`                                                        | `dist` by default                                               |
| `ApiPost`      | `number`, `slug`, `text_hi`, `text_en`, meanings, `category`, `tags`, timestamps | Doha post from the API                                          |
| `ApiResponse`  | `success`, `data{ posts, total, totalPages, page, per_page, pagination }`        | Envelope                                                        |

Key constants (`src/constants/index.ts`):
`API_BASE_URL` (env-overridable), `ENTRIES_PER_FILE = 100`,
`MAX_RETRIES = 3`, `RETRY_DELAY_MS = 1000`, `AUTHOR_PREFIX = '—'`,
`SANT_KABIR`, `GURU_KABIR`, `HINDI_DIGITS`.

---

## 8. The build pipeline (how it all connects)

```
bun run build  (src/build.ts)
 ├── buildDocs(argv)                  -> docs/dohe/sant-kabir-ke-dohe-*.md
 │     fetchAllCouplets()              (src/lib/api.ts, paginated + retried)
 │     splitCoupletsText(post.text_hi) (src/lib/formatting.ts, splits on '।')
 │     generateDoheMarkdown(...) + prettier markdown -> write 100/file
 │
 └── buildAssets()                     -> dist/santon-ke-{bhajan,dohe}.*
       │
       ├── Builder.run(BhajanMeta)     # static: src/data/bhajans.ts
       │     -> raw.json, json, txt, md, csv   (appendNumber = false)
       │
       └── Builder.run(DoheMeta)       # live: convertCoupletsToDohas(posts)
             -> raw.json, json, txt, md, csv   (appendNumber = true -> ०१, ०२…)
```

- `Builder.run` (`src/lib/builder.ts`) writes each format via
  `generateData` (`src/lib/dataGenerator.ts`):
  - `raw.json` → verbatim `DataEntry[]`
  - `json` → `content` joined into one string
  - `txt` / `md` → entries joined with `===` / `---`, author suffix rendered as
    `— <author>`
  - `csv` → via `json-2-csv` (single column: content + suffix)
- `appendNumber = true` numbers dohas with **Hindi numerals**
  (`latinToHindiNumber(padNumber(i, 2))` → `०१`, `०२`, …).

> **Important:** `docs/bhajans/*.md` (the human-friendly pages with meanings) are
> **not** generated by any script. Only `docs/dohe/*` are generated. Bhajan pages
> must be authored by hand (see §10).

---

## 9. Adding a bhajan (prayer)

1. Open `src/data/bhajans.ts`.
2. Append a new entry to the `data` array:
   ```ts
   {
     id: 'nayi-bhajan-slug',
     author: GURU_KABIR,
     content: [
       'पहला अंतरा।।',
       '',
       'दूसरा अंतरा।।',
       '',
       'कबीर साहब कहते हैं ...।।',
     ],
   },
   ```
   - `id` → URL-safe kebab slug; it becomes `docs/bhajans/<id>.md`.
   - `content` → lines of the lyrics; use `''` between verses for spacing.
3. (Strongly recommended) Create `docs/bhajans/<id>.md` with the lyrics plus a
   `## सरल व्याख्या:` (simple meaning) section — match the existing style in
   [`docs/bhajans/amarpur-le-chalo-sajna.md`](docs/bhajans/amarpur-le-chalo-sajna.md).
4. Add a line to the **भजन** list in `README.md` plus its reference link.
5. Regenerate assets: `bun run build:assets` (or `bun run build`).

---

## 10. Adding / refreshing dohas (couplets)

Dohas are **fetched live** from the API — there is no in-repo doha list to edit.

- Regenerate everything from the API:
  ```bash
  bun run build
  ```
- Collections only: `bun run build:docs`
- Assets only: `bun run build:assets`
- Point at a different API (fork / local): set `COUPLETS_API_URL` in `.env.development`.
- Fast iteration: `bun run build:test`, or limit files:
  `bun run buildDocs --limit 1` / `MAX_FILES=2 bun run buildDocs`.

> The API schema (`ApiPost` / `ApiResponse`) is described in `src/types.ts`.
> If the API adds fields, update `convertCoupletsToDohas` in `src/data/dohas.ts`.

---

## 11. Formatting & rendering conventions (keep output consistent)

- `splitCoupletsText(text)` splits raw couplet text at `।`, re-appends `।` to
  every line except the last (final line ends `।।`). Mirror this when editing
  doha sources.
- `latinToHindiNumber` + `padNumber` produce Hindi-numeral indices.
- `AUTHOR_PREFIX = '—'` precedes the author name in every generated block.

---

## 12. Testing

```bash
bun run test              # vitest run — 56 tests
bun run test:coverage     # v8 coverage: text + html (coverage/)
```

- Glob pattern: `**/*.test.{ts,tsx}`.
- `vitest.setup.ts` silences `console.log/error/warn/info` by default (use
  `vi.spyOn(console, ...)` in a test to assert on them).
- Add tests under `src/**/__tests__/` next to the unit they cover.

---

## 13. Code quality (the pre‑flight trio)

Before opening a PR, ensure all three pass locally:

```bash
bun run format     # or format:check
bun run lint       # or lint:fix
bun run tsc
```

- **Prettier** — enforced via `pre-push` (`format:check`).
- **ESLint** — flat config, `@vijayhardaha/dev-config/eslint/ts`. CI/release
  workflow runs `build:assets` only; lint/tsc/test are gated by the local hooks.
- **TypeScript** — `tsc --noEmit` (project uses `module: esnext`, `moduleResolution: bundler`, `noEmit`).

---

## 14. Git hooks & commit style

Husky is installed by `prepare`.

- `commit-msg` → `commitlint` enforces **Conventional Commits** (e.g.
  `feat: add new bhajan`, `fix: correct doha numbering`, `chore: bump 1.1.0`).
- `pre-push` → `bun run format:check`.

Recommended commit message format: `type(scope): short summary`
types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `ci`.

---

## 15. Releases

- **Trigger:** a git tag matching `v*` (e.g. `v1.1.0`) pushed to the default branch.
  Workflow: `.github/workflows/release.yml`.
- **What it does:** checkout → `bun install` → `bun run build:assets` →
  `mv dist all-in-one-assets` → `zip all-in-one-assets.zip` → collect
  `*.txt/json/md/csv` → publish GitHub Release with `generate_release_notes`.
- **Assets published:** `all-in-one-assets.zip` + individual `santon-ke-bhajan.*`
  and `santon-ke-dohe.*` files at `releases/download/vX.Y.Z/`.

> The workflow reads the tag purely for the release; it does **not** bump
> `package.json`. Version bumps are done manually before tagging (see §16).

---

## 16. Version bumps

Before cutting a release tag, bump the version in two places:

1. `package.json` — `"version": "X.Y.Z"`.
2. `README.md` — update **all** `releases/download/vX.Y.Z/` links
   (11 URLs: bhajan ×5 + doha ×5 + zip ×1).
3. Commit, then tag & push:
   ```bash
   git commit -am "chore(release): bump X.Y.Z"
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

Checklist:

- `grep -c 'vX.Y.Z' README.md` → should equal **11** for a release tag.
- `bun run build:test` passes (fast sanity build).

---

## 17. Troubleshooting

| Symptom                                                                | Likely cause / fix                                                                  |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `fetch failed` / empty dohas                                           | API down or wrong URL — set `COUPLETS_API_URL` in `.env.development`.               |
| Build writes 0 dohas                                                   | API returned an empty page; confirm with `curl $COUPLETS_API_URL/api/couplets`.     |
| `find: missing ')'` in release workflow                                | The `find` uses escaped `\( ... \)` — keep both parens balanced (verified working). |
| `pre-push` fails on format                                             | Run `bun run format` and re-commit.                                                 |
| Tests noisy with console output                                        | Expected — `vitest.setup.ts` mocks console; use `vi.spyOn` to assert.               |
| `tsc` reports `Cannot find module '@/...'`                             | Ensure you're running via `bunx`/`bun run` or that the `@/` alias resolves          |
| (`vitest.config.ts` defines it; `tsconfig` extends the shared config). |

---

## 18. Quick cheat sheet

```bash
# New bhajan
# 1) edit src/data/bhajans.ts  2) author docs/bhajans/<id>.md
# 3) add README link  4) bun run build:assets

# Refresh dohas from API
bun run build

# Validate before a tag
bun run format:check && bun run lint && bun run tsc && bun run test && bun run build:test
```

Happy contributing — and happy reading! 🙏
