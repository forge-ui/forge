# medusajs/medusa

- url: https://github.com/medusajs/medusa
- category: commerce operations
- metadata: public repo target selected on 2026-06-11; GitHub API numeric metadata returned 403.

## Evidence

- Public project category: commerce platform.
- Relevant UI class: orders, products, fulfillment, returns, customers, and
  payment/stock operations.

## IA Artifact

- Order list route owns status, payment, fulfillment, customer, total, channel,
  and exception filters.
- Order detail route owns customer identity, line items, payment state,
  fulfillment packages, returns/refunds, notes, and audit events.
- Action routes own fulfill, refund, cancel, return, and product setup flows.

## Page Pattern

- Commerce dashboards need revenue/order trend plus exception queues such as
  failed payment, late fulfillment, and refund risk.
- Order detail should be a split-pane or sectioned workflow surface, not a
  static description list.
- Product setup actions need grouped form fields and right preflight context.

## Business Workflow

- Operator enters an exception queue, opens an order, checks payment and
  fulfillment evidence, triggers a fulfillment/refund action, and sees local
  status feedback.

## ForgeUI Gap

- Order line-item table with quantity, fulfillment, refund, and inventory
  status cells.

## Borrow

- Lifecycle-rich commerce detail pages.
- Dashboard exception entry into fulfillment/refund work.
- Action pages with preflight checks.

## Reject

- Do not copy ecommerce admin chrome or builder-specific settings.
- Do not force all commerce operations into a dashboard table.
