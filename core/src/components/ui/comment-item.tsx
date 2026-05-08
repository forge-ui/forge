/* eslint-disable @next/next/no-img-element */

import { ReplyLinear } from "solar-icon-set";

export type CommentReply = {
  avatar: string;
  name: string;
  date: string;
  content: string;
  onReply?: () => void;
};

export type CommentData = CommentReply & {
  images?: string[];
  replies?: CommentReply[];
  className?: string;
};

function CommentInner({
  name,
  date,
  content,
  images,
  onReply,
}: {
  name: string;
  date: string;
  content: string;
  images?: string[];
  onReply?: () => void;
}) {
  return (
    <div className="flex-1 min-w-0 inline-flex flex-col justify-center items-start gap-2">
      <div className="self-stretch inline-flex justify-between items-center">
        <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg">{name}</span>
        <span className="text-fg-grey-700 text-sm font-normal leading-5 tracking-fg">{date}</span>
      </div>
      <p className="self-stretch text-stone-500 text-sm font-normal leading-5 tracking-fg">
        {content}
      </p>
      {images && images.length > 0 && (
        <div className="inline-flex justify-start items-start gap-3">
          {images.map((src, i) => (
            <img key={i} src={src} alt="" className="w-16 h-16 rounded-xl object-cover" />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={onReply}
        className="inline-flex justify-start items-center gap-1 cursor-pointer"
      >
        <ReplyLinear size={20} color="currentColor" />
        <span className="text-accent text-sm font-bold leading-5 tracking-fg">Reply</span>
      </button>
    </div>
  );
}

function CommentRow(props: CommentReply & { images?: string[] }) {
  return (
    <div className="self-stretch inline-flex justify-start items-start gap-3">
      <img
        src={props.avatar}
        alt={props.name}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
      <CommentInner
        name={props.name}
        date={props.date}
        content={props.content}
        images={props.images}
        onReply={props.onReply}
      />
    </div>
  );
}

export function CommentItem({
  avatar,
  name,
  date,
  content,
  images,
  onReply,
  replies,
  className = "",
}: CommentData) {
  const hasReplies = replies && replies.length > 0;
  return (
    <div
      className={`pb-5 border-b border-fg-grey-200 inline-flex justify-start items-start gap-3 ${className}`}
    >
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0 inline-flex flex-col justify-center items-start gap-4">
        {/* Main */}
        <CommentInner
          name={name}
          date={date}
          content={content}
          images={images}
          onReply={onReply}
        />
        {/* Replies — share main content container, naturally indent by avatar+gap */}
        {hasReplies &&
          replies!.map((reply, i) => <CommentRow key={i} {...reply} />)}
      </div>
    </div>
  );
}
