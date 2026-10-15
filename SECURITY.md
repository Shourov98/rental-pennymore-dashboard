# Security Policy

## Supported version

Security fixes are applied to the current `main` branch. Deployments should be
created from reviewed commits on that branch only.

## Reporting a vulnerability

Please report vulnerabilities privately to the existing BeforeListed support
contact, `support@beforelisted.com`. Do not open a public issue for suspected
secrets, a possible supply-chain compromise, or a vulnerability that could be
exploited before a fix is available.

Include the affected URL or component, reproduction steps, impact, and any
relevant commit hash. Do not include real credentials in the report.

## If compromise is suspected

1. Stop deployments and do not run unknown scripts, builds, or Git hooks.
2. Preserve evidence: commit hashes, branch names, diffs, workflow run URLs,
   timestamps, and suspicious file paths.
3. Compare the local and remote references before merging or syncing.
4. Revoke and rotate exposed credentials through their providers. `.gitignore`
   does not remove secrets that were already committed.
5. Review GitHub collaborators, deploy keys, GitHub Apps, workflow changes,
   Actions logs, personal access tokens, and cloud audit logs.

## Repository safeguards

This repository includes a narrow `pnpm security:check` script for the concrete
malicious-file and build-configuration pattern previously observed here. It is
not a malware guarantee. Code review, protected branches, dependency review,
secret scanning, and credential hygiene remain required.

## GitHub configuration required outside this repository

Import `.github/rulesets/protect-main.json` from **Settings → Rules → Rulesets
→ New ruleset → Import a ruleset**. It blocks force pushes and deletion, and
requires a pull request, review, and resolved conversations on `main`.

After the `Security Check / security-baseline` job has run successfully, add it
as a required status check in the ruleset. If no independent reviewer is
available, a required approval can block the sole maintainer; choose a limited,
audited bypass rather than disabling protections broadly.

Use MFA or passkeys, least-privilege collaborators, read-only default Actions
permissions, a trusted-action allowlist, restricted bypass permissions, and
reviewed deploy keys/GitHub Apps. Availability of some controls depends on the
GitHub plan and whether the repository is private.

The secret-scan workflow uses Gitleaks v3. If the BeforeListed organization
requires a Gitleaks license for organization repositories, configure the
required `GITLEAKS_LICENSE` secret rather than disabling the scan.

## Local workstation checklist

- Keep the operating system, browser, Node.js, Git, and IDE updated.
- Use passphrase-protected SSH keys or a credential manager, and enable MFA or
  passkeys on GitHub.
- Install only reviewed IDE extensions. Treat `.vscode/tasks.json` and
  `.vscode/launch.json` as executable configuration.
- Before syncing, inspect `git status`, `git log --left-right --oneline
  HEAD...@{u}`, and `git diff --name-status HEAD...@{u}`. Do not run a build
  from an unreviewed branch.
- To inspect without executing, use `git show --stat <commit>` and
  `git diff --name-status <safe-commit> <suspect-commit>`. Review suspicious
  processes with `ps auxww` and suspicious files with `file` and `sha256sum`.

## Deployment checklist

This dashboard currently deploys through an SSH-based GitHub Actions workflow.
Use separate staging and production environments, managed secrets, MFA,
least-privilege cloud access, audit logs, backups, rollback procedures, and
restricted production deploy permissions. Prefer deployments built from a
reviewed protected-branch artifact rather than an arbitrary local upload.

The existing deployment workflow has not been changed by this baseline. Before
relying on it, review its mutable action references, its SSH deploy key scope,
and its server path/checkout commands. Do not change production deployment
configuration without explicit authorization.
