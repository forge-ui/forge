import { CommentItem, HistoryItem } from '@forge-ui-official/core'
import type { DetailEntity } from '../utils'
import { activityEvents } from '../utils'

export function ActivityRail({ item }: { item: DetailEntity }) {
  return (
    <div className="space-y-6">
      <section className="rounded-card border border-fg-grey-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-fg-grey-950">Root cause</h2>
        <p className="mt-3 text-sm leading-6 text-fg-grey-600">{item.rootCause}</p>
      </section>

      <section className="rounded-card border border-fg-grey-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-fg-grey-950">Activity and comments</h2>
        <div className="mt-4 space-y-3">
          {activityEvents.map((event, index) => (
            <HistoryItem key={event.title} variant="regular" color={event.tone} title={event.title} description={event.detail} datetime={event.at} showDatetime="inline" showConnector={index < activityEvents.length - 1} />
          ))}
        </div>
        <div className="mt-6 space-y-4 border-t border-fg-grey-100 pt-5">
          <CommentItem avatar="https://i.pravatar.cc/100?u=reviewer" name={item.owner} date="12m" content={`Next action: ${item.nextAction}`} onReply={() => Promise.resolve()} />
          <CommentItem avatar="https://i.pravatar.cc/100?u=lead" name="Team lead" date="31m" content="Keep the audit trail attached before moving to the downstream workflow." onReply={() => Promise.resolve()} />
        </div>
      </section>
    </div>
  )
}
