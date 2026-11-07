# 📐 Commit Message Architecture (Conventional Commits)

To scale development and maintain a transparent software supply chain, this repository enforces the
[Conventional Commits v1.0.0](https://www.conventionalcommits.org/) specification. This practice
deterministically drives automated changelogs, Semantic Versioning (SemVer), and DevSecOps
traceability.

---

## 🔍 Validation Specification

Every commit must pass the following regular expression before integration into `main`:

```js
/^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types)(\([\w.-]+\))?: .{1,50}$/;
```

### Commit Structure:

```text
<type>(<scope>): <short description>

<detailed body explaining technical motivation and impact>

<footer>
```

| Type              | SemVer Impact / Description                     | Included in Changelog? |
| :---------------- | :---------------------------------------------- | :--------------------: |
| `feat`            | New user-facing feature or capability.          |    **Yes (Minor)**     |
| `fix`             | Bug fix or regression patch.                    |    **Yes (Patch)**     |
| `perf`            | Performance optimization or resource reduction. |        **Yes**         |
| `refactor`        | Code restructuring without behavioral change.   |           No           |
| `docs`            | Technical documentation updates.                |           No           |
| `test`            | Unit or integration test additions.             |           No           |
| `ci` / `workflow` | CI/CD pipeline and automation changes.          |           No           |
| `chore`           | Tooling, dependencies, or metadata maintenance. |           No           |

> 💥 **Breaking Changes:** Any commit containing `BREAKING CHANGE:` in the footer automatically
> triggers a **Major Release**.

---

## 🔐 Cryptographic Commit Signing (Verified Badge)

In accordance with GitHub supply-chain security guidelines, all commits should be cryptographically
signed using **SSH** or **GPG** keys.

© 2010-2026 Glastor - All rights reserved.
