# calcom/cal.com

- url: https://github.com/calcom/cal.com
- stars: 45051
- pushed_at: 2026-06-03T09:51:55Z
- category: split-pane

## Evidence

- Public product: https://cal.com
- Repo description: scheduling infrastructure.
- Relevant UI class: bookings, availability, routing, team settings.

## IA Artifact

- Booking list owns filtering, status, owner/team, and row actions.
- Booking detail owns attendee evidence, history, routing context, and reschedule/cancel actions.
- Settings/action pages are parent-entered from relevant context.

## Page Pattern

- Detail/action pages need grouped form plus right rail context.
- Availability/routing pages should show state, conflicts, and save feedback.
- Lists need identity, time, status, owner, and next action.

## Business Workflow

- User opens booking, checks attendee/context, reschedules or cancels, and audits change.

## ForgeUI Gap

- Calendar/time-slot visual primitive is missing; use structured rows plus status rail for now.

## Borrow

- Split detail with attendee/context/action closure.
- Settings grouped by decision area.
- Conflict/preflight rail for scheduling actions.

## Reject

- Do not turn calendar-heavy UX into decorative cards.
- Do not put every booking action into sidebar navigation.
