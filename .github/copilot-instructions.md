<!-- .github/copilot-instructions.md - guidance for AI coding agents -->

# Copilot / AI agent instructions (concise)

This repo is a small p5.js game written in TypeScript and built with Vite. Use these notes to be productive quickly.

**Run / Build**
- Preferred (from README): install with `bun install` and run with `bun dev`.
- NPM/Yarn compatible: use `npm run dev`, `npm run build`, `npm run preview` (see `package.json`).

**Big picture**
- Entry point: `src/main.ts` — creates a `p5` instance (`new p5(main)`) and delegates drawing to the current scene.
- Scene management: `src/utils/scene.ts` exposes `CURRENT_SCENE` and `changeCurrentScene` (use these consistently when switching scenes).
- Scenes live in `src/scenes/<sceneName>/index.ts` and expose scene-specific draw functions (e.g. `drawIntro`, `drawOutro`). Each scene should set/check `CURRENT_SCENE` at start.
- Shared core systems (renderers, utilities) live under `src/core` (e.g. `src/core/snake/snake-renderer.ts` exports `drawSnake(...)`). Prefer reusing these helpers.

**Project-specific patterns & conventions**
- Scene pattern: a folder per scene with an `index.ts` that exports a single `drawX(p5)` function. Example: `src/scenes/intro/index.ts` calls `changeCurrentScene` and uses `p5.push()`/`p5.pop()` to isolate drawing state.
- p5 API usage: always use the `p5` instance passed to the scene (do not reference global p5). Use `p5.push()`/`p5.pop()` around local transforms.
- Asset globals: some scenes read globals (e.g. `window.myFont` in `src/scenes/intro/index.ts`). If adding assets, register them on `window` or provide a loader util.
- Renderer helpers: e.g. `drawSnake(p: p5, positions: SnakePosition[], cellSize: number)` in `src/core/snake/snake-renderer.ts`. Prefer calling these vs reimplementing visual logic.

**TypeScript / build notes**
- Path alias: `@` -> `src` is configured in `tsconfig.json` and `vite.config.ts`. Use imports like `@/utils/scene`.
- Compiler constraints: `tsconfig.json` enables `strict`, `noUnusedLocals`, and `noUnusedParameters` — avoid leaving unused variables or params.

**Local style & expectations**
- Keep scene files focused on drawing and simple state toggles. Complex logic/state should go into `src/core` or `src/utils`.
- Reuse existing helpers (buttons, snake shapes) found in `src/scenes/*/index.ts` and `src/core/*`.
- Use p5-safe practices: avoid DOM queries that conflict with p5 canvas; prefer `p5.mouseX`/`p5.mouseY` and canvas-relative math.

**Commands reference (Windows PowerShell)**
```powershell
# Install deps (preferred):
bun install

# Dev server:
bun dev

# Alternative (npm):
npm install
npm run dev

# Build (produces production bundle):
npm run build

# Preview production bundle:
npm run preview
```

**Where to look for examples**
- Scene lifecycle & UI: `src/scenes/intro/index.ts`, `src/scenes/outro/index.ts`.
- Shared renderer example: `src/core/snake/snake-renderer.ts`.
- Entry and scene switch wiring: `src/main.ts` and `src/utils/scene.ts`.

If anything here is unclear or you'd like more detail (asset loading, event handling, or how to add a new scene), tell me which area and I'll expand the instructions.
