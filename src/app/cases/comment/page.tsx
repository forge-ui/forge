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
      <PageHeading title="Comment & Discussion" hint="CommentItem · ReviewItem" />

      <Section title="CommentItem" description="Comment with replies and images">
        <SubSection title="Example">
          <div className="w-full max-w-xl">
            <CommentItem
              avatar={avatarUrls[0]}
              name="Jane Cooper"
              date="2 hours ago"
              content="This looks amazing! Great work on the design system. The consistency is really showing."
              images={["https://i.pravatar.cc/64?img=10", "https://i.pravatar.cc/64?img=11"]}
              onReply={() => {}}
              replies={[
                {
                  avatar: avatarUrls[1],
                  name: "Alex Brown",
                  date: "1 hour ago",
                  content: "Thanks Jane! We put a lot of effort into it.",
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
        <SubSection title="Regular">
          <div className="w-full max-w-xl">
            <ReviewItem
              avatar={avatarUrls[0]}
              name="Jane Cooper"
              subtitle="Verified Buyer"
              date="Mar 15, 2026"
              rating={4}
              content="Excellent product quality! The design is sleek and modern."
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
              name="Alex Brown"
              date="Mar 10, 2026"
              rating={5}
              content="Best purchase I have made this year. Highly recommended!"
              images={["https://i.pravatar.cc/64?img=13", "https://i.pravatar.cc/64?img=14", "https://i.pravatar.cc/64?img=15"]}
              overflowImageCount={3}
            />
          </div>
        </SubSection>
      </Section>

    </div>
  );
}
