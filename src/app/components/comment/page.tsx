"use client";

import Link from "next/link";
import { CommentItem, ReviewItem } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { CommentItem, ReviewItem } from "@forge-ui-official/core";`;

const CODE_COMMENT_USAGE = `<CommentItem
  avatar="https://i.pravatar.cc/100?img=1"
  name="Jane Cooper"
  date="2 hours ago"
  content="This looks amazing! Great work on the design system."
  onReply={() => {}}
/>`;

const CODE_COMMENT_REPLIES = `<CommentItem
  avatar={avatar}
  name="Jane Cooper"
  date="2 hours ago"
  content="This looks amazing!"
  images={["..."]}
  replies={[
    { avatar, name: "Alex Brown", date: "1 hour ago", content: "Thanks!" },
  ]}
/>`;

const CODE_REVIEW_USAGE = `<ReviewItem
  avatar={avatar}
  name="Jane Cooper"
  subtitle="Verified Buyer"
  date="Mar 15, 2026"
  rating={4}
  content="Excellent product quality!"
/>`;

const CODE_REVIEW_CARD = `<ReviewItem
  variant="card"
  avatar={avatar}
  name="Alex Brown"
  date="Mar 10, 2026"
  rating={5}
  content="Best purchase this year."
  images={["...", "..."]}
  overflowImageCount={3}
/>`;

const COMMENT_PROPS: ApiTableRow[] = [
  { attr: "avatar", type: "string", defaultValue: "—", description: "作者头像 URL。" },
  { attr: "name", type: "string", defaultValue: "—", description: "作者姓名。" },
  { attr: "date", type: "string", defaultValue: "—", description: "发表时间文案（组件不做格式化，直接渲染）。" },
  { attr: "content", type: "string", defaultValue: "—", description: "评论正文。" },
  { attr: "images", type: "string[]", defaultValue: "—", description: "可选附图 URL 数组。" },
  { attr: "replies", type: "CommentReply[]", defaultValue: "—", description: "回复列表，结构同主体（不含 replies / images）。" },
  { attr: "onReply", type: "() => void", defaultValue: "—", description: "点击 Reply 按钮的回调。" },
  { attr: "className", type: "string", defaultValue: "—", description: "外层额外 className。" },
];

const REVIEW_PROPS: ApiTableRow[] = [
  { attr: "avatar", type: "string", defaultValue: "—", description: "用户头像 URL。" },
  { attr: "name", type: "string", defaultValue: "—", description: "用户姓名。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "用户下方副标题（如 Verified Buyer）。" },
  { attr: "date", type: "string", defaultValue: "—", description: "评价时间。" },
  { attr: "rating", type: "number", defaultValue: "0", description: "评分，0-5。" },
  { attr: "content", type: "string", defaultValue: "—", description: "评价正文。" },
  { attr: "images", type: "string[]", defaultValue: "—", description: "附图 URL 数组。" },
  { attr: "overflowImageCount", type: "number", defaultValue: "—", description: "尾部 +N 缩略图数字。" },
  { attr: "variant", type: "'regular' | 'card'", defaultValue: "'regular'", description: "card 变体有白底卡片外壳。" },
];

const avatar = "https://i.pravatar.cc/100?img=1";
const avatar2 = "https://i.pravatar.cc/100?img=2";

export default function CommentCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Comment & Review"
        hint="CommentItem 讨论评论（支持回复嵌套），ReviewItem 用户评价（含星级）。"
      />

      <Section
        title="CommentItem"
        description="标准评论，含头像 / 作者 / 时间 / 正文 / Reply 按钮，可选附图和多条回复。"
      >
        <SubSection title="Import" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_COMMENT_USAGE}>
            <div className="w-full max-w-xl">
              <CommentItem
                avatar={avatar}
                name="Jane Cooper"
                date="2 hours ago"
                content="This looks amazing! Great work on the design system."
                onReply={() => {}}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="With Images & Replies" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            传 <InlineCode>images</InlineCode> 显示缩略图网格；传 <InlineCode>replies</InlineCode> 在下方嵌套子评论。
          </p>
          <PreviewBlock code={CODE_COMMENT_REPLIES} minHeight={260}>
            <div className="w-full max-w-xl">
              <CommentItem
                avatar={avatar}
                name="Jane Cooper"
                date="2 hours ago"
                content="This looks amazing!"
                images={["https://i.pravatar.cc/64?img=10", "https://i.pravatar.cc/64?img=11"]}
                onReply={() => {}}
                replies={[
                  { avatar: avatar2, name: "Alex Brown", date: "1 hour ago", content: "Thanks Jane!" },
                ]}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={COMMENT_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="ReviewItem"
        description="商品评价。头像 + 姓名 + 星级 + 正文，可选副标题、日期、附图与 +N 溢出。"
      >
        <SubSection title="Usage" stack>
          <PreviewBlock code={CODE_REVIEW_USAGE}>
            <div className="w-full max-w-xl">
              <ReviewItem
                avatar={avatar}
                name="Jane Cooper"
                subtitle="Verified Buyer"
                date="Mar 15, 2026"
                rating={4}
                content="Excellent product quality! The design is sleek and modern."
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="Card Variant" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>variant=&quot;card&quot;</InlineCode> 外层加白底卡片和边框，适合独立展示。
          </p>
          <PreviewBlock code={CODE_REVIEW_CARD} minHeight={220}>
            <div className="w-full max-w-xl">
              <ReviewItem
                variant="card"
                avatar={avatar2}
                name="Alex Brown"
                date="Mar 10, 2026"
                rating={5}
                content="Best purchase this year. Highly recommended!"
                images={["https://i.pravatar.cc/64?img=13", "https://i.pravatar.cc/64?img=14"]}
                overflowImageCount={3}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={REVIEW_PROPS} />
        </SubSection>
      </Section>

      <Link href="/cases/comment" className="text-xs text-fg-grey-700 hover:underline">
        看所有变体 →
      </Link>
    </div>
  );
}
