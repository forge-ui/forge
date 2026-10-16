"use client";

import { CommentItem, ReviewItem } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";
import { ApiBlock, DocExample } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

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
        hint="评论用来讨论，评价用来打分。附图和回复是评论多出来的部分，卡片外壳是评价的另一种摆法。"
      />

      <Section title="用法" description="从一条评论开始：头像、姓名、时间和正文。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample id="commentitem" title="CommentItem" summary="一条评论可以只有正文，也可以带缩略图和嵌套回复。" code={`${CODE_COMMENT_USAGE}\n${CODE_COMMENT_REPLIES}`} minHeight={260}>
            <div className="flex w-full flex-col gap-6">
              <CommentItem avatar={avatar} name="林晓" date="2 小时前" content="效果很不错，设计规范做得很细致。" onReply={() => {}} />
              <CommentItem
                avatar={avatar}
                name="林晓"
                date="2 小时前"
                content="效果很不错！"
                images={["https://i.pravatar.cc/64?img=10", "https://i.pravatar.cc/64?img=11"]}
                onReply={() => {}}
                replies={[{ avatar: avatar2, name: "陈晨", date: "1 小时前", content: "谢谢林晓！" }]}
              />
            </div>
          </DocExample>
        </SubSection>
      </Section>

      <Section title="例子" description="评价有星级。卡片样式是同一条评价加一层白底。">
        <DocExample id="reviewitem" title="ReviewItem" summary="普通评价和带图的卡片评价。" code={`${CODE_REVIEW_USAGE}\n${CODE_REVIEW_CARD}`} minHeight={220}>
          <div className="flex w-full flex-col gap-4">
            <ReviewItem avatar={avatar} name="林晓" subtitle="已购用户" date="2026 年 3 月 15 日" rating={4} content="产品质量很好，设计简洁，使用起来很顺手。" />
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
        </DocExample>
      </Section>

      <Section title="API">
        <ApiBlock id="commentitem" title="CommentItem" rows={COMMENT_PROPS} />
        <ApiBlock id="reviewitem" title="ReviewItem" rows={REVIEW_PROPS} />
      </Section>
    </div>
  );
}
