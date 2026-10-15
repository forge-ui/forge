"use client";

import { CommentItem, ReviewItem } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

const CODE_IMPORT = `import { CommentItem, ReviewItem } from "@forge-ui-official/core";`;

const CODE_COMMENT_USAGE = `<CommentItem
  avatar="https://i.pravatar.cc/100?img=1"
  name="林晓"
  date="2 小时前"
  content="效果很不错，设计规范做得很细致。"
  onReply={() => {}}
/>`;

const CODE_COMMENT_REPLIES = `<CommentItem
  avatar={avatar}
  name="林晓"
  date="2 小时前"
  content="效果很不错！"
  images={["..."]}
  replies={[
    { avatar, name: "陈晨", date: "1 小时前", content: "Thanks!" },
  ]}
/>`;

const CODE_REVIEW_USAGE = `<ReviewItem
  avatar={avatar}
  name="林晓"
  subtitle="已购用户"
  date="2026 年 3 月 15 日"
  rating={4}
  content="Excellent product quality!"
/>`;

const CODE_REVIEW_CARD = `<ReviewItem
  variant="card"
  avatar={avatar}
  name="陈晨"
  date="2026 年 3 月 10 日"
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
  { attr: "onReply", type: "() => void", defaultValue: "—", description: "点击回复按钮时触发。" },
  { attr: "className", type: "string", defaultValue: "—", description: "外层额外 className。" },
];

const REVIEW_PROPS: ApiTableRow[] = [
  { attr: "avatar", type: "string", defaultValue: "—", description: "用户头像 URL。" },
  { attr: "name", type: "string", defaultValue: "—", description: "用户姓名。" },
  { attr: "subtitle", type: "string", defaultValue: "—", description: "用户下方副标题（如“已购买用户”）。" },
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
        title="评论与评价"
        hint="展示讨论、回复和评分，支持头像、时间和附图。"
      />

      <Section
        title="CommentItem"
        description="展示作者、时间和评论正文，支持附图与嵌套回复。"
      >
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_COMMENT_USAGE}>
            <div className="w-full max-w-xl">
              <CommentItem
                avatar={avatar}
                name="林晓"
                date="2 小时前"
                content="效果很不错，设计规范做得很细致。"
                onReply={() => {}}
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="图片与回复" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            传 <InlineCode>images</InlineCode> 显示缩略图网格；传 <InlineCode>replies</InlineCode> 在下方嵌套子评论。
          </p>
          <PreviewBlock code={CODE_COMMENT_REPLIES} minHeight={260}>
            <div className="w-full max-w-xl">
              <CommentItem
                avatar={avatar}
                name="林晓"
                date="2 小时前"
                content="效果很不错！"
                images={["https://i.pravatar.cc/64?img=10", "https://i.pravatar.cc/64?img=11"]}
                onReply={() => {}}
                replies={[
                  { avatar: avatar2, name: "陈晨", date: "1 小时前", content: "谢谢林晓！" },
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
        description="展示用户评分、评价正文和附图。"
      >
        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_REVIEW_USAGE}>
            <div className="w-full max-w-xl">
              <ReviewItem
                avatar={avatar}
                name="林晓"
                subtitle="已购用户"
                date="2026 年 3 月 15 日"
                rating={4}
                content="产品质量很好，设计简洁，使用起来很顺手。"
              />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="卡片样式" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>variant=&quot;card&quot;</InlineCode> 外层加白底卡片和边框，适合独立展示。
          </p>
          <PreviewBlock code={CODE_REVIEW_CARD} minHeight={220}>
            <div className="w-full max-w-xl">
              <ReviewItem
                variant="card"
                avatar={avatar2}
                name="陈晨"
                date="2026 年 3 月 10 日"
                rating={5}
                content="很满意的一次购买，值得推荐！"
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
    </div>
  );
}
