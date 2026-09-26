# Skill: /remission-engineering

## Purpose
Enforce agentic engineering standards for the Remission Protocol project (Cloudflare Pages, D1, R2, React/Vite monorepo).

## Core Rules & Execution Directives
1. **Pre-flight Git Verification**:
   - Always run `git status || exit 1` before making any edits.
   
2. **Strict Line Limits & Modular Structure**:
   - Never write or edit files over 300 lines in a single block.
   - If a target file exceeds 300 lines, extract sub-components into standalone files (<200 lines) before adding new features.

3. **Line-Bounded File Reads**:
   - Do NOT run open-ended file reads on large files.
   - Use `grep -n` to locate target lines, then read specifically bounded chunks (100–200 lines).

4. **Generative Assembly (Heredocs)**:
   - Use complete source code replacement via heredocs (`cat << 'EOF' > path/to/file.jsx`) to avoid AST string-patching errors.
   - **Import Verification**: Before applying assembly to a file, verify all relative imports exist and their export shapes match. Blindly applying code with missing dependencies (e.g., components, lib utils) causes build failures; create necessary bridge components or missing utilities first. When a sibling component already exists under a different name (e.g. `AdminHeroTab` exporting a named `AdminHeroTab`), re-export it from the expected path rather than rewriting its logic. When NO implementation exists (e.g. a `ResourceAdmin` tab never built), report it as an unimplemented tab — do not stub it with fake "Pending Implementation" UI that reads as finished work.

5. **Cloudflare D1 & R2 Rules**:
   - D1 bindings MUST use positional placeholders (`?`).
   - R2 key reads MUST handle decoded spaces (`decodeURIComponent(params.key)`).

6. **Post-Execution Verification & Quiet Output**:
   - Always verify changes with quiet output:
     `npm run build --prefix apps/web && npx wrangler d1 execute remission-db --local --command "PRAGMA foreign_key_check;" 2>&1 | tail -n 25 || { echo "Failed. Halting."; exit 1; }`

7. **Zero Auto-Repair Loops**:
   - If verification fails, print the failure error output and halt immediately. Do NOT attempt automatic multi-turn repair loops.
   - Exception — unresolved imports: a `Could not resolve "..."` build error is a specification gap, not a design failure. The correct response is to create the missing module (bridge component re-exporting the existing implementation, or the missing `lib/` utility) and re-run verification, rather than halting with a half-applied file. Do not invent behaviour for a module the spec only referenced by import.
