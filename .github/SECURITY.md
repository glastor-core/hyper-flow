# 🛡️ Security Policy

## Responsible Disclosure & Supply Chain Security

The security, integrity, and resilience of the **HYPER-FLOW** software supply chain is an absolute
priority. We appreciate the efforts of the open-source community and independent security
researchers in discovering and responsibly reporting vulnerabilities.

---

## 🔒 Supported Versions

We actively maintain security patches for the following releases and branches:

| Version                    |      Status      | Maintenance Policy                                          |
| :------------------------- | :--------------: | :---------------------------------------------------------- |
| **Latest (master / main)** |   ✅ Supported   | Immediate security patches and automated dependency updates |
| **Previous Major (v-1.x)** | 🛡️ Critical Only | Patches for high/critical vulnerabilities (CVSS ≥ 7.0)      |
| **Legacy (< v-1.x)**       |  ❌ End of Life  | Unsupported. Upgrade required                               |

---

## 🚨 Reporting a Vulnerability

> ⚠️ **IMPORTANT:** **DO NOT** open public GitHub Issues or public pull requests for security
> vulnerabilities that could compromise production systems.

### Preferred Channel: GitHub Private Vulnerability Reporting (PVR)

Please report vulnerabilities using GitHub's native confidential reporting tool:

1. Navigate to the **Security** tab of this repository:
   [https://github.com/glastor-core/hyper-flow/security/advisories](https://github.com/glastor-core/hyper-flow/security/advisories).
2. Click **Report a vulnerability**.
3. Fill out the advisory form with technical details and reproducible proof-of-concept (PoC).

### Alternative Direct Channel:

If Private Vulnerability Reporting is unavailable:

- **Security Contact:** [glastor.info@gmail.com](mailto:glastor.info@gmail.com)
- **Subject:** `[SECURITY-ALERT] hyper-flow - Vulnerability Report`

---

## ⏱️ Service Level Agreements (SLAs)

- **Initial Response & Acknowledgment:** Within **24 to 48 business hours**.
- **Triage & CVSS Assessment:** Within **5 business days**.
- **Coordinated Disclosure:** We adhere to a **90-day grace period** to allow patch deployment
  before public CVE disclosure.

---

© 2010-2026 Glastor - All rights reserved.
