# saleor/saleor-dashboard

- url: https://github.com/saleor/saleor-dashboard
- category: commerce dashboard
- metadata: public repo target selected on 2026-06-12; no clone/install.

## Evidence

- Public project category: commerce admin dashboard.
- Relevant UI class: orders, payments, fulfillment, products, customers,
  discounts, channels, and inventory operations.

## IA Artifact

- Dashboard routes summarize revenue risk, pending fulfillment, payment issues,
  inventory exceptions, and priority customer/order work.
- List routes own orders, products, customers, discounts, and fulfillments with
  status, channel, owner, amount, date, and next action.
- Detail routes need order/customer identity, payment, fulfillment, inventory,
  notes, history, and refund/cancel/fulfill actions.
- Action routes own refund, fulfill, cancel, create discount, or inventory
  adjustment flows with impact context.

## Page Pattern

- `dashboard-control-tower-protask` for commerce operations control tower.
- `rich-entity-list-protask` for orders/products/customers.
- `split-pane-triage-protask` for payment/fulfillment exceptions.
- `action-form-protask` for refund, fulfill, cancel, or inventory actions.

## Business Workflow

An operator opens the highest-risk order, verifies customer/payment/fulfillment
and inventory impact, chooses refund/fulfill/cancel/escalate, then reviews the
audit trail.

## ForgeUI Gap

- Order lifecycle cells: payment, fulfillment, inventory, channel, customer,
  amount, and exception reason.

## Borrow

- Commerce details organized by lifecycle and impact, not generic fields.
- Dashboard entry points that open real order/fulfillment work.

## Reject

- Do not let totals-only KPI dashboards replace priority order work.
- Do not render refunds or fulfillments without preflight impact context.
