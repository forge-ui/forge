"use client";

import { CommentItem, ReviewItem } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";

const avatarUrls = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
  "https://i.pravatar.cc/100?img=5",
];

export default function CommentCasePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading title="评论与评价" hint="展示讨论、回复和评分，支持头像、时间和附图。" />

      <Section title="CommentItem" description="带图片和回复的评论">
        <SubSection title="示例">
          <div className="w-full max-w-xl">
            <CommentItem
              avatar={avatarUrls[0]}
              name="林晓"
              date="2 小时前"
              content="效果很不错！设计规范做得很细致，各处风格也很统一。"
              images={["https://i.pravatar.cc/64?img=10", "https://i.pravatar.cc/64?img=11"]}
              onReply={() => {}}
              replies={[
                {
                  avatar: avatarUrls[1],
                  name: "陈晨",
                  date: "1 小时前",
                  content: "谢谢林晓，我们在细节上做了不少打磨。",
                },
              ]}
            />
          </div>
        </SubSection>
      </Section>

      <Section
        title="ReviewItem"
        description="Variant: regular, card"
      >
        <SubSection title="常规">
          <div className="w-full max-w-xl">
            <ReviewItem
              avatar={avatarUrls[0]}
              name="林晓"
              subtitle="已购用户"
              date="2026 年 3 月 15 日"
              rating={4}
              content="产品质量很好，设计简洁，使用起来很顺手。"
              images={["https://i.pravatar.cc/64?img=12"]}
              overflowImageCount={3}
            />
          </div>
        </SubSection>
        <SubSection title="Card variant">
          <div className="w-full max-w-xl">
            <ReviewItem
              variant="card"
              avatar={avatarUrls[1]}
              name="陈晨"
              date="2026 年 3 月 10 日"
              rating={5}
              content="今年买得最满意的一件商品，值得推荐！"
              images={["https://i.pravatar.cc/64?img=13", "https://i.pravatar.cc/64?img=14", "https://i.pravatar.cc/64?img=15"]}
              overflowImageCount={3}
            />
          </div>
        </SubSection>
      </Section>

    </div>
  );
}
