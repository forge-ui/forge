export type ConversationStatus = 'open' | 'waiting' | 'resolved'
export type ConversationPriority = 'low' | 'medium' | 'high'
export type MessageRole = 'operator' | 'customer' | 'agent' | 'system'

export type ConversationRecord = {
  id: string
  title: string
  subtitle: string
  status: ConversationStatus
  priority: ConversationPriority
  unread: number
  owner: string
  slaLabel: string
  linkedHref: string
}

export type MessageRecord = {
  id: string
  conversationId: string
  role: MessageRole
  author: string
  body: string
  time: string
}

export const CONVERSATIONS: ConversationRecord[] = [
  { id: 'c-101', title: 'Payment retry failed', subtitle: 'Enterprise account renewal', status: 'open', priority: 'high', unread: 3, owner: 'billing-ops', slaLabel: '42 min left', linkedHref: '/issues/c-101' },
  { id: 'c-102', title: 'Connector degraded', subtitle: 'Warehouse sync pipeline', status: 'waiting', priority: 'medium', unread: 0, owner: 'data-ops', slaLabel: '3h left', linkedHref: '/jobs?highlight=c-102' },
  { id: 'c-103', title: 'Approval clarification', subtitle: 'Policy exception request', status: 'resolved', priority: 'low', unread: 0, owner: 'risk-review', slaLabel: 'closed', linkedHref: '/reports/c-103' },
]

export const INITIAL_MESSAGES: MessageRecord[] = [
  { id: 'm-1', conversationId: 'c-101', role: 'customer', author: 'Customer', body: 'The renewal is blocked after three retry attempts.', time: '09:12' },
  { id: 'm-2', conversationId: 'c-101', role: 'agent', author: 'Agent', body: 'I found a risk hold and a mismatch in billing owner metadata.', time: '09:14' },
  { id: 'm-3', conversationId: 'c-101', role: 'system', author: 'System', body: 'Linked issue c-101 moved to open triage.', time: '09:15' },
  { id: 'm-4', conversationId: 'c-102', role: 'customer', author: 'Ops', body: 'Warehouse sync is delayed and downstream jobs are backing up.', time: '10:03' },
  { id: 'm-5', conversationId: 'c-103', role: 'operator', author: 'Reviewer', body: 'Exception approved with audit note attached.', time: 'Yesterday' },
]

export function statusColor(status: ConversationStatus): 'green' | 'yellow' | 'red' {
  if (status === 'resolved') return 'green'
  if (status === 'waiting') return 'yellow'
  return 'red'
}

export function priorityColor(priority: ConversationPriority): 'gray' | 'yellow' | 'red' {
  if (priority === 'high') return 'red'
  if (priority === 'medium') return 'yellow'
  return 'gray'
}

export function messagesFor(conversationId: string, messages: MessageRecord[]) {
  return messages.filter(message => message.conversationId === conversationId)
}
