import {
  HistoryItem,
  HistoryGrouped,
  Label,
  FileCard,
  TaskCard,
  StyledLink,
  IconButton,
  ImageGrid,
  ProductRow,
  RatingStars,
} from "@forge-ui-official/core";
import type {
  HistoryItemColor,
  HistoryItemProps,
  HistoryItemVariant,
  HistoryItemShowDatetime,
} from "@forge-ui-official/core";
import {
  CheckCircleBold,
  StarLinear,
  AltArrowRightLinear,
  CartBoldDuotone,
  MenuDotsBold,
} from "solar-icon-set";
import { PageHeading, Section, SubSection } from "../_shared";

// ─────────────────────────────────────────────────────────────
// Constants / mock content
// ─────────────────────────────────────────────────────────────

const ALL_COLORS: HistoryItemColor[] = [
  "purple", "blue", "green", "red", "yellow", "cyan", "gray", "black",
];

const GROUPED_COLORS: HistoryItemColor[] = ["purple", "blue", "black"];

const DATETIME = "DD/MM/YY, 00:00";

const avatarUrls = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
];

// description with inline violet link (matches Figma "Lorem #302012 ipsum...")
const DESC_LINKED = (
  <>
    <span className="text-fg-grey-700">Lorem </span>
    <StyledLink href="#" color="purple" className="text-sm font-semibold">
      #302012
    </StyledLink>
    <span className="text-fg-grey-700"> ipsum dolor si amet</span>
  </>
);

const DESC_SIMPLE = (
  <span className="text-fg-grey-700">Desc lorem ipsum dolor sia amt</span>
);

// 2 Labels + arrow (Red → Yellow) — status change
const TAGS_STATUS = (
  <>
    <Label color="red" size="sm" variant="outline">Red</Label>
    <span className="text-fg-grey-700 inline-flex">
      <AltArrowRightLinear size={16} color="currentColor" />
    </span>
    <Label color="yellow" size="sm" variant="outline">Yellow</Label>
  </>
);

// 4-image grid (Figma 64×64 thumbnails)
const IMG_GRID = (
  <ImageGrid
    size="md"
    images={[1, 2, 3, 4].map((i) => `https://picsum.photos/seed/history${i}/64/64`)}
  />
);

// Small product row (Figma "Product Title · 3 Variant")
const PRODUCT_ROW = (
  <ProductRow
    image="https://picsum.photos/seed/history-product/44/44"
    title="Product Title"
    subtitle="3 Variant"
  />
);

// 4/5 rating stars
const RATING = <RatingStars value={4.0} total={5} />;

const FILE_ROW = (
  <FileCard file={{ id: "f1", name: "File Name.doc", size: "300 KB" }} />
);

const TASK_ROW = (
  <TaskCard
    labelText="Label"
    labelColor="red"
    title="Title Here"
    progress={0}
    progressColor="purple"
    avatars={avatarUrls.slice(0, 2)}
    overflowCount={1}
    date="21 Oct 2022"
    className="max-w-xs"
  />
);

function descWithExtra(extra: React.ReactNode) {
  return (
    <div className="flex flex-col gap-2">
      <div>{DESC_LINKED}</div>
      {extra}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6 content rows × 4 column structure variants
// ─────────────────────────────────────────────────────────────

type ContentRow = {
  key: string;
  description: React.ReactNode;
  tags?: React.ReactNode;
};

const CONTENT_ROWS: ContentRow[] = [
  { key: "text+tags", description: DESC_LINKED, tags: TAGS_STATUS },
  { key: "images", description: descWithExtra(IMG_GRID) },
  { key: "product", description: descWithExtra(PRODUCT_ROW) },
  { key: "file", description: descWithExtra(FILE_ROW) },
  { key: "rating", description: descWithExtra(RATING) },
  { key: "task", description: descWithExtra(TASK_ROW) },
];

// 4 structure columns: (datetime position) × (connector on/off)
type StructCol = {
  key: string;
  showDatetime: HistoryItemShowDatetime;
  showConnector: boolean;
  label: string;
};

const STRUCT_COLS: StructCol[] = [
  { key: "inline-conn",    showDatetime: "inline", showConnector: true,  label: "inline + connector" },
  { key: "bottom-conn",    showDatetime: "bottom", showConnector: true,  label: "bottom + connector" },
  { key: "inline-no-conn", showDatetime: "inline", showConnector: false, label: "inline · no connector" },
  { key: "bottom-no-conn", showDatetime: "bottom", showConnector: false, label: "bottom · no connector" },
];

// ─────────────────────────────────────────────────────────────
// Full variant matrix — 4 cols × 6 rows = 24 items per variant
// ─────────────────────────────────────────────────────────────

function VariantMatrix({
  variant,
  color = "purple",
  icon,
}: {
  variant: HistoryItemVariant;
  color?: HistoryItemColor;
  icon?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-4 gap-x-8 gap-y-6">
      {/* Column headers */}
      {STRUCT_COLS.map((col) => (
        <div
          key={`h-${col.key}`}
          className="text-[10px] font-bold uppercase tracking-fg text-fg-grey-700"
        >
          {col.label}
        </div>
      ))}

      {/* Rows: each content type × 4 structure columns */}
      {CONTENT_ROWS.map((row) =>
        STRUCT_COLS.map((col) => (
          <div key={`${row.key}-${col.key}`} className="min-w-0">
            <HistoryItem
              variant={variant}
              color={color}
              title="Title"
              description={row.description}
              tags={row.tags}
              datetime={DATETIME}
              showDatetime={col.showDatetime}
              showConnector={col.showConnector}
              icon={icon}
              avatar={variant === "profile" ? avatarUrls[0] : undefined}
            />
          </div>
        ))
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function HistoryCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="History"
        hint="HistoryItem × 3 variants × 8 colors × 4 structure cols × 6 content rows · HistoryGrouped"
      />

      {/* ───────── 1. Regular ───────── */}
      <Section
        title="1. Regular"
        description="variant=regular · 圆点 indicator"
      >
        <SubSection title="Indicator · 8 colors (single row example)">
          <div className="w-full max-w-md flex flex-col">
            {ALL_COLORS.map((color, i) => (
              <HistoryItem
                key={color}
                variant="regular"
                color={color}
                title={`Title · ${color}`}
                description={DESC_LINKED}
                tags={TAGS_STATUS}
                datetime={DATETIME}
                showDatetime="inline"
                showConnector={i < ALL_COLORS.length - 1}
              />
            ))}
          </div>
        </SubSection>

        <SubSection title="Full matrix · 4 structure cols × 6 content rows (purple)">
          <VariantMatrix variant="regular" color="purple" />
        </SubSection>
      </Section>

      {/* ───────── 2. Badge ───────── */}
      <Section
        title="2. Badge"
        description="variant=badge · icon 徽章 indicator"
      >
        <SubSection title="Indicator · 8 colors (single row example)">
          <div className="w-full max-w-md flex flex-col">
            {ALL_COLORS.map((color, i) => (
              <HistoryItem
                key={color}
                variant="badge"
                color={color}
                title={`Title · ${color}`}
                description={DESC_LINKED}
                tags={TAGS_STATUS}
                datetime={DATETIME}
                showDatetime="inline"
                icon={<CheckCircleBold size={20} color="currentColor" />}
                showConnector={i < ALL_COLORS.length - 1}
              />
            ))}
          </div>
        </SubSection>

        <SubSection title="Full matrix · 4 structure cols × 6 content rows (purple)">
          <VariantMatrix
            variant="badge"
            color="purple"
            icon={<CartBoldDuotone size={20} color="currentColor" />}
          />
        </SubSection>
      </Section>

      {/* ───────── 3. Profile ───────── */}
      <Section
        title="3. Profile"
        description="variant=profile · 头像 indicator"
      >
        <SubSection title="Full matrix · 4 structure cols × 6 content rows (purple)">
          <VariantMatrix variant="profile" color="purple" />
        </SubSection>
      </Section>

      {/* ───────── 4. HistoryGrouped ───────── */}
      <Section
        title="4. HistoryGrouped"
        description="Card 容器 + 右侧 progress bar · color 强制透给内部 items"
      >
        <SubSection title="3 colors × 3 items composition">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {GROUPED_COLORS.map((color) => (
              <HistoryGrouped
                key={color}
                title="Title"
                subtitle="Text Here"
                color={color}
                progressHeight="40%"
                badge={
                  <Label
                    color={color === "black" ? "gray" : color}
                    size="sm"
                    variant="outline"
                  >
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </Label>
                }
                items={compositionItems("mixed")}
              />
            ))}
          </div>
        </SubSection>

        <SubSection title="Items composition variants (purple)">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <HistoryGrouped
              title="Short list"
              subtitle="3 items · 20% progress"
              color="purple"
              progressHeight="20%"
              badge={<Label color="purple" size="sm" variant="outline">3</Label>}
              items={compositionItems("short")}
            />
            <HistoryGrouped
              title="Mixed variants"
              subtitle="6 items · 50% progress"
              color="purple"
              progressHeight="50%"
              badge={<Label color="purple" size="sm" variant="outline">6</Label>}
              items={compositionItems("mixed")}
            />
            <HistoryGrouped
              title="With action"
              subtitle="5 items · 80% · header action"
              color="purple"
              progressHeight="80%"
              badge={<Label color="purple" size="sm" variant="outline">5</Label>}
              action={
                <IconButton color="dark" variant="tertiary" size="sm" aria-label="more">
                  <MenuDotsBold size={16} color="currentColor" />
                </IconButton>
              }
              items={compositionItems("long")}
            />
          </div>
        </SubSection>
      </Section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Grouped items composition helpers
// ─────────────────────────────────────────────────────────────

function compositionItems(
  kind: "short" | "mixed" | "long",
): HistoryItemProps[] {
  const base: HistoryItemProps[] = [
    {
      variant: "regular",
      title: "Title",
      description: DESC_LINKED,
      tags: TAGS_STATUS,
      datetime: DATETIME,
      showDatetime: "bottom",
    },
    {
      variant: "badge",
      title: "Title",
      description: descWithExtra(IMG_GRID),
      datetime: DATETIME,
      showDatetime: "bottom",
      icon: <StarLinear size={20} color="currentColor" />,
    },
    {
      variant: "regular",
      title: "Title",
      description: descWithExtra(FILE_ROW),
      datetime: DATETIME,
      showDatetime: "bottom",
    },
    {
      variant: "profile",
      title: "Title",
      description: DESC_LINKED,
      datetime: DATETIME,
      showDatetime: "bottom",
      avatar: avatarUrls[0],
    },
    {
      variant: "regular",
      title: "Title",
      description: descWithExtra(PRODUCT_ROW),
      datetime: DATETIME,
      showDatetime: "bottom",
    },
    {
      variant: "badge",
      title: "Title",
      description: descWithExtra(RATING),
      datetime: DATETIME,
      showDatetime: "bottom",
      icon: <CheckCircleBold size={20} color="currentColor" />,
    },
    {
      variant: "profile",
      title: "Title",
      description: descWithExtra(TASK_ROW),
      datetime: DATETIME,
      showDatetime: "bottom",
      avatar: avatarUrls[1],
    },
    {
      variant: "regular",
      title: "Title",
      description: DESC_SIMPLE,
      datetime: DATETIME,
      showDatetime: "bottom",
    },
  ];

  if (kind === "short") return base.slice(0, 3);
  if (kind === "mixed") return base.slice(0, 6);
  return base.slice(0, 5);
}
