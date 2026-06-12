# Infisical/infisical

- url: https://github.com/Infisical/infisical
- category: secrets/access operations
- metadata: public repo target selected on 2026-06-11; GitHub API numeric metadata returned 403.

## Evidence

- Public project category: secrets management and access control.
- Relevant UI class: projects, environments, secrets, access requests, audit
  events, rotation, and policy.

## IA Artifact

- Environment/project dashboard owns secret health, rotation risk, access
  changes, and audit entry.
- Secret/access list owns key identity, environment, owner, last rotation,
  exposure risk, and row action.
- Detail routes own metadata, access history, rotation/evidence, related
  services, and approval/revocation actions.

## Page Pattern

- Security/admin pages need restrained but clear risk signaling.
- Access review detail should use split-pane triage: request identity,
  evidence, policy context, and approve/reject action.
- Audit routes need dense history with actor, target, reason, and timestamp.

## Business Workflow

- Operator reviews a risky access or stale secret, checks evidence and policy,
  approves/rotates/revokes, then verifies audit trail.

## ForgeUI Gap

- Access review rail and secret rotation status cells.

## Borrow

- Policy/evidence/action closure for security-like detail pages.
- Audit trail as a first-class route.
- Environment/project context in navigation.

## Reject

- Do not overuse red alert cards for routine security admin pages.
- Do not copy secret value editing patterns into unrelated products.
