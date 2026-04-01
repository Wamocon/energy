# Copilot Global Instructions

You are working on a **Next.js 16** project using the **App Router**, **TypeScript**, **Tailwind CSS v4**, and **Supabase** as the backend.

## Tech Stack

- **Framework:** Next.js 16.x (App Router, `src/app/`)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (utility-first)
- **Backend/DB:** Supabase (PostgreSQL, Auth, Storage, RLS)
- **Deployment:** Vercel (via GitHub Actions CI/CD)
- **Package Manager:** npm

## Critical Rules

1. **Read the docs first.** Next.js 16 has breaking changes. Always check `node_modules/next/dist/docs/` before implementing any Next.js API. Heed deprecation notices.
2. **Server Components by default.** Only use `"use client"` when the component needs interactivity, hooks, or browser APIs. Keep Client Components at the leaves of the component tree.
3. **Async APIs.** In Next.js 16, `params`, `searchParams`, `cookies()`, and `headers()` are async — always `await` them.
4. **No local test data.** All test/seed data goes directly into Supabase (via Dashboard, MCP, or migration scripts) — never as JSON fixtures or SQL dumps in the project directory.
5. **Environment variables.** Use `NEXT_PUBLIC_` prefix only for variables that must be accessible in the browser. Server-only secrets (e.g. `SUPABASE_SERVICE_ROLE_KEY`) must never be prefixed.
6. **Schema awareness.** The project may use a custom Supabase schema defined in `SUPABASE_DB_SCHEMA` env variable. Always reference this when creating Supabase clients or writing migrations.

## Code Style

- Use `import type { ... }` for type-only imports.
- Prefer named exports over default exports for components (except Next.js route files like `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` which require default exports).
- Use `@/` import alias for project-internal imports.
- Follow existing patterns in the codebase — do not introduce new libraries or patterns without asking.


# Workflow Orchestration

## 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

## 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

## 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

## 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

## 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

## 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

---

## Task Management

- **Plan First**: Write plan to `tasks/todo.md` with checkable items
- **Verify Plan**: Check in before starting implementation
- **Track Progress**: Mark items complete as you go
- **Explain Changes**: High-level summary at each step
- **Document Results**: Add review section to `tasks/todo.md`
- **Capture Lessons**: Update `tasks/lessons.md` after corrections

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

