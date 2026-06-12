# documenso/documenso

- url: https://github.com/documenso/documenso
- category: document workflow
- metadata: public repo target selected on 2026-06-11; GitHub API numeric metadata returned 403.

## Evidence

- Public project category: document signing.
- Relevant UI class: documents, recipients, signature status, audit trail,
  templates, and send/reminder workflows.

## IA Artifact

- Document list owns status, owner, signer progress, due date, template, and
  recent activity.
- Document detail owns file identity, participant states, evidence/audit trail,
  reminders, resend, void, and completion actions.
- Action routes own upload, template setup, recipient configuration, and send.

## Page Pattern

- Document detail should prioritize signer progress and audit evidence.
- Creation is a wizard/action form: file, recipients, fields, message, review.
- Dashboard should show blocked/expiring documents and recent completions.

## Business Workflow

- Operator finds a blocked document, checks which signer is stuck, sends a
  reminder or corrects routing, then verifies audit history.

## ForgeUI Gap

- Signature participant progress rail and document audit timeline.

## Borrow

- Participant lifecycle as compact status rail.
- File evidence as a primary detail surface.
- Multi-step send workflow with review state.

## Reject

- Do not build a PDF/signature editor unless explicitly requested.
- Do not hide signer progress inside a generic table cell.
