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

5. **Cloudflare D1 & R2 Rules**:
   - D1 bindings MUST use positional placeholders (`?`).
   - R2 key reads MUST handle decoded spaces (`decodeURIComponent(params.key)`).

6. **Post-Execution Verification & Quiet Output**:
   - Always verify changes with quiet output:
     `npm run build --prefix apps/web && npx wrangler d1 execute remission-db --local --command "PRAGMA foreign_key_check;" 2>&1 | tail -n 25 || { echo "Failed. Halting."; exit 1; }`

7. **Zero Auto-Repair Loops**:
   - If verification fails, print the failure error output and halt immediately. Do NOT attempt automatic multi-turn repair loops.
