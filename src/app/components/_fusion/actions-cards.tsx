"use client";
import { useState } from "react";
import { Avatar, Button, IconButton, SurfaceCard } from "@forge-ui-official/core";
import { ArrowRightLinear, BookmarkLinear, CheckCircleLinear, UserPlusLinear } from "@forge-ui-official/core/icons";
import type { FusionExampleProps } from "./types";
import { ActionHint, ActionStage } from "./actions-shared";

export function EditorialExample(settings: FusionExampleProps) {
  const en = settings.locale === "en";
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  return <ActionStage settings={settings}><SurfaceCard effect="layered" motion={settings.motion} padding="none" className="fusion-editorial-card w-full" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocusCapture={() => setOpen(true)}>
    <div className="fusion-editorial-landscape" aria-hidden><span className="fusion-editorial-sun" /><span className="fusion-editorial-hill fusion-editorial-hill-back" /><span className="fusion-editorial-hill" /></div>
    <div className="p-5 flex flex-col gap-3"><div className="flex items-center justify-between"><span className="text-xs text-fg-grey-700">{en ? "Design notes · 6 min" : "设计札记 · 6 分钟"}</span><IconButton effect="bookmark" active={saved} color={settings.color} variant="ghost" aria-label={saved ? (en ? "Remove bookmark" : "取消收藏") : (en ? "Bookmark article" : "收藏文章")} onClick={() => setSaved(value => !value)}><BookmarkLinear size={18} /></IconButton></div><h3 className="text-lg font-semibold text-fg-black">{en ? "A little room to think" : "给思考留一点空间"}</h3><div className="fusion-editorial-reveal" data-open={open}><div><p className="text-sm leading-6 text-fg-grey-700">{en ? "Thoughtful spacing makes a complex interface easier to understand. Explore how hierarchy creates a calmer workspace." : "恰当的留白，让复杂界面更易理解。用清晰的层级，为工作创造更从容的空间。"}</p></div></div><Button color={settings.color} size="sm" motion={settings.motion} iconRight={<ArrowRightLinear size={16} />} aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? (en ? "Close preview" : "收起预览") : (en ? "Read preview" : "阅读预览")}</Button></div>
  </SurfaceCard></ActionStage>;
}

export function SpotlightExample(settings: FusionExampleProps) {
  const [read, setRead] = useState(false);
  const en = settings.locale === "en";
  return <ActionStage settings={settings}><SurfaceCard style={{ "--forge-surface-accent": "var(--fusion-accent)" } as React.CSSProperties} effect="tilt" motion={settings.motion} title={en ? "Product update" : "产品动态"} subtitle={en ? "Today · Forge team" : "今天 · Forge 团队"} className="w-full"><div className="fusion-news-cover" aria-hidden><div /><div /><div /></div><h3 className={`mt-5 text-lg font-semibold ${read ? "text-fg-grey-700" : "text-fg-black"}`}>{en ? "Less friction, more focus" : "少一点阻碍，多一点专注"}</h3><p className="my-3 text-sm leading-6 text-fg-grey-700">{en ? "Small details add up. Discover smoother navigation and more useful feedback in the latest release." : "细节改变体验。看看新版本如何让导航更顺畅，让每一次操作都有清晰反馈。"}</p><Button color={settings.color} motion={settings.motion} size="sm" variant={read ? "secondary" : "primary"} iconLeft={read ? <CheckCircleLinear size={18} /> : undefined} onClick={() => setRead(value => !value)}>{read ? (en ? "Marked as read" : "已标记为已读") : (en ? "Mark as read" : "标记已读")}</Button></SurfaceCard></ActionStage>;
}

export function FollowExample(settings: FusionExampleProps) {
  const [following, setFollowing] = useState(false);
  const [hover, setHover] = useState(false);
  const [recommended, setRecommended] = useState<string[]>([]);
  const en = settings.locale === "en";
  return <ActionStage settings={settings}><SurfaceCard className="w-full"><div className="flex items-center gap-3"><Avatar initials="林" size="lg" color={settings.color === "black" ? "blue" : settings.color} /><div className="flex-1"><h3 className="text-base font-semibold text-fg-black">{en ? "Lin Xiao" : "林晓"}</h3><p className="text-xs text-fg-grey-700">{en ? "Product designer" : "产品设计师"}</p></div></div><p className="my-4 text-sm text-fg-grey-700">{en ? "Designing thoughtful tools for everyday work." : "设计贴近日常、让工作更轻松的工具。"}</p><div className="flex items-center justify-between"><span className="text-sm text-fg-black"><strong className="fusion-rolling-count inline-block" key={String(following)}>{(1280 + Number(following)).toLocaleString()}</strong> {en ? "followers" : "位关注者"}</span><Button color={settings.color} motion={settings.motion} size="sm" variant={following ? "secondary" : "primary"} iconLeft={following ? <CheckCircleLinear size={18} /> : <UserPlusLinear size={18} />} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} aria-pressed={following} onClick={() => setFollowing(value => !value)}>{following ? hover ? (en ? "Unfollow" : "取消关注") : (en ? "Following" : "已关注") : (en ? "Follow" : "关注")}</Button></div><div className="fusion-follow-panel" key={String(following)}><h4 className="text-xs font-semibold text-fg-grey-700">{following ? (en ? "People you may like" : "你可能感兴趣的人") : (en ? "Recent writing" : "近期文章")}</h4>{following ? [en ? "Chen Wei" : "陈伟", en ? "Zhou Ning" : "周宁"].map(name => <div key={name} className="flex items-center gap-3 mt-3"><Avatar initials={name.slice(0, 1)} size="sm" /><span className="text-sm flex-1">{name}</span><Button color={settings.color} size="sm" variant="tertiary" aria-pressed={recommended.includes(name)} onClick={() => setRecommended(value => value.includes(name) ? value.filter(item => item !== name) : [...value, name])}>{recommended.includes(name) ? (en ? "Following" : "已关注") : (en ? "Follow" : "关注")}</Button></div>) : <ActionHint>{en ? "Make room for useful details\nBuilding a calmer workspace" : "为有价值的细节留出空间 · 构建更从容的工作区"}</ActionHint>}</div></SurfaceCard></ActionStage>;
}
