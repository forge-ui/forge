/* eslint-disable @next/next/no-img-element */

import { StarBold, MenuDotsBold } from "solar-icon-set";
import { cn } from "../../lib/utils";
import { resolveCardWidthClass, type CardWidth } from "./card-utils";

const STAR_FILLED = "var(--fg-yellow)";
const STAR_EMPTY = "var(--fg-grey-200)";

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <StarBold key={i} size={size} color={i < rating ? STAR_FILLED : STAR_EMPTY} />
      ))}
    </div>
  );
}

function ImageGrid({
  images,
  overflowImageCount,
}: {
  images?: string[];
  overflowImageCount?: number;
}) {
  if (!images || images.length === 0) return null;
  return (
    <div className="inline-flex justify-start items-start gap-3">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="w-16 h-16 rounded-xl object-cover"
        />
      ))}
      {overflowImageCount !== undefined && overflowImageCount > 0 && (
        <div className="w-16 h-16 rounded-xl bg-fg-violet-100 flex items-center justify-center">
          <span className="text-sm font-semibold text-fg-violet">
            +{overflowImageCount}
          </span>
        </div>
      )}
    </div>
  );
}

interface ReviewItemBase {
  avatar: string;
  name: string;
  date: string;
  rating: number;
  content: string;
  images?: string[];
  overflowImageCount?: number;
  className?: string;
}

interface ReviewItemRegular extends ReviewItemBase {
  variant?: "regular";
  subtitle?: string;
}

interface ReviewItemCard extends ReviewItemBase {
  variant: "card";
  onMenuClick?: () => void;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
}

export function ReviewItem(props: ReviewItemRegular | ReviewItemCard) {
  if (props.variant === "card") return <CardVariant {...props} />;
  return <RegularVariant {...props} />;
}

function RegularVariant({
  avatar,
  name,
  subtitle,
  date,
  rating,
  content,
  images,
  overflowImageCount,
  className = "",
}: ReviewItemRegular) {
  return (
    <div className={`pb-4 border-b border-fg-grey-200 ${className}`}>
      <div className="flex gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Rating + Date */}
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-1">
              <span className="text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
                Rating:
              </span>
              <StarRow rating={rating} size={16} />
            </div>
            <span className="text-fg-grey-700 text-sm font-normal leading-5 tracking-fg">
              {date}
            </span>
          </div>
          {/* Name + subtitle */}
          <div className="self-stretch inline-flex justify-start items-center gap-2">
            <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg">
              {name}
            </span>
            {subtitle && (
              <>
                <span className="text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
                  -
                </span>
                <span className="text-fg-grey-700 text-sm font-normal leading-5 tracking-fg">
                  {subtitle}
                </span>
              </>
            )}
          </div>
          {/* Content */}
          <p className="self-stretch text-fg-grey-700 text-sm font-normal leading-5 tracking-fg">
            {content}
          </p>
          {/* Images */}
          <ImageGrid images={images} overflowImageCount={overflowImageCount} />
        </div>
      </div>
    </div>
  );
}

function CardVariant({
  avatar,
  name,
  date,
  rating,
  content,
  images,
  overflowImageCount,
  onMenuClick,
  width,
  className = "",
}: ReviewItemCard) {
  return (
    <div
      className={cn(
        "p-4 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex-col justify-center items-start gap-4",
        resolveCardWidthClass(width, "w-96"),
        className,
      )}
    >
      {/* Header: avatar + name + date | menu */}
      <div className="self-stretch inline-flex justify-start items-center gap-4">
        <div className="flex-1 flex justify-start items-center gap-3">
          <img
            src={avatar}
            alt={name}
            className="w-11 h-11 rounded-full object-cover shrink-0"
          />
          <div className="inline-flex flex-col justify-center items-start gap-1">
            <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg">
              {name}
            </span>
            <span className="text-fg-grey-700 text-xs font-normal leading-4 tracking-fg">
              {date}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onMenuClick}
          className="w-6 h-6 flex items-center justify-center cursor-pointer"
        >
          <span className="rotate-90">
            <MenuDotsBold size={16} color="var(--fg-grey-700)" />
          </span>
        </button>
      </div>
      {/* Divider */}
      <div className="self-stretch h-px bg-fg-grey-200" />
      {/* Stars + content */}
      <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
        <StarRow rating={rating} size={24} />
        <p className="self-stretch text-fg-grey-700 text-sm font-normal leading-5 tracking-fg">
          {content}
        </p>
      </div>
      {/* Images */}
      <ImageGrid images={images} overflowImageCount={overflowImageCount} />
    </div>
  );
}
