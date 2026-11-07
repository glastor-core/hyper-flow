# 🚀 Contributing Guidelines & Standards

Thank you for contributing to **HYPER-FLOW**. We value technical excellence, architectural rigor, and
clean engineering practices.

---

## 🛠️ Pull Request Workflow

1. **Semantic Branching:**
   ```bash
   git checkout -b feat/your-feature-name
   # or fix/issue-description
   ```

2. **Local Verification:** Ensure type checking and tests pass with zero warnings before
   opening a PR:
   ```bash
   bun run typecheck
   bun test
   ```

3. **Conventional Commits:** Follow [.github/COMMIT_CONVENTION.md](COMMIT_CONVENTION.md):
   ```bash
   git commit -m "feat(core): implement deterministic schema validation"
   ```

4. **Open Pull Request:** Submit your branch against `master` (or `main`) with the completed PR checklist.

---

## 📐 Engineering Principles

- **Clean Code & SOLID:** Modular, pure functions, and strict typing without unjustified `any`.
- **Atomic Pull Requests:** One PR solves one discrete responsibility.
- **Docs Parity:** Every API modification must include corresponding documentation updates.

© 2010-2026 Glastor - All rights reserved.
