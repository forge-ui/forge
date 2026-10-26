"use client";

import { useId, useRef, useState } from "react";
import { IconButton, DropdownPanel, IconPicker, TextField } from "@forge-ui-official/core";

const emoji = [
  ["😀", "开心 笑脸 happy"], ["😄", "大笑 smile"], ["😂", "笑哭 laugh"], ["🥹", "感动"],
  ["😊", "微笑 smile"], ["😍", "喜爱 love"], ["🥰", "喜欢 love"], ["😘", "亲吻 kiss"],
  ["😎", "酷 cool"], ["🤔", "思考 think"], ["🤨", "疑问"], ["🧐", "研究"],
  ["😮", "惊讶 surprise"], ["😅", "尴尬"], ["😢", "难过 cry"], ["😭", "大哭 cry"],
  ["😴", "睡觉 sleep"], ["🤯", "震惊"], ["😡", "生气 angry"], ["🤗", "拥抱 hug"],
  ["🥳", "庆祝 party"], ["🤩", "期待"], ["😌", "放松"], ["🫡", "收到 敬礼"],
  ["👍", "赞 同意 good yes"], ["👎", "不同意 no"], ["👏", "鼓掌 clap"], ["🙌", "举手 太棒了"],
  ["🙏", "感谢 谢谢 thanks"], ["👋", "挥手 你好 hello"], ["👌", "好的 ok"], ["🤝", "握手 合作"],
  ["💪", "加油 努力"], ["✌️", "胜利"], ["👀", "关注 看看 eyes"], ["👉", "右 指向"],
  ["❤️", "红心 爱 heart love"], ["🖤", "黑心 heart"], ["💛", "黄心 heart"], ["💚", "绿心 heart"],
  ["💙", "蓝心 heart"], ["💜", "紫心 heart"], ["💯", "满分 完美"], ["💡", "灵感 idea"],
  ["✅", "完成 通过 done yes"], ["❌", "错误 取消 no"], ["⚠️", "注意 警告 warning"], ["❓", "问题 question"],
  ["🎉", "庆祝 彩带 party"], ["🎊", "庆祝"], ["✨", "闪亮 sparkles"], ["🔥", "火 热门 fire"],
  ["🚀", "火箭 发布 rocket"], ["🎯", "目标 target"], ["🏆", "奖杯 成功 trophy"], ["⭐", "星星 star"],
  ["📌", "图钉 置顶 pin"], ["📎", "附件 回形针 file"], ["📝", "笔记 note"], ["📅", "日程 日期 calendar"],
  ["⏰", "闹钟 提醒 time"], ["⏳", "等待 时间 waiting"], ["💻", "电脑 开发 code"], ["📊", "图表 数据 chart"],
  ["📚", "阅读 资料 book"], ["🛠️", "修复 工具 fix"], ["🐛", "问题 错误 bug"], ["🔍", "搜索 检查 search"],
  ["☕", "咖啡 coffee"], ["🍵", "茶 tea"], ["🍰", "蛋糕 cake"], ["🍕", "披萨 pizza"],
  ["🌞", "太阳 早上 sun"], ["🌙", "月亮 晚安 moon"], ["🌈", "彩虹 rainbow"], ["🌱", "成长"],
  ["🌸", "花 flower"], ["🐱", "猫 cat"], ["🐶", "狗 dog"], ["🐼", "熊猫 panda"],
] as const;

export function CommentEmoji({ onSelect }: { onSelect: (emoji: string) => void }) {
  const id = useId();
  const popup = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const matches = emoji.filter(([glyph, keywords]) => `${glyph} ${keywords}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return <div ref={trigger}>
    <IconButton color="black" size="sm" variant="ghost" aria-label="插入表情" aria-haspopup="dialog" aria-controls={id} aria-expanded={open} onClick={() => {
      if (open) { popup.current?.hidePopover(); return; }
      setQuery("");
      const rect = trigger.current!.getBoundingClientRect();
      const panel = popup.current!;
      panel.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 328))}px`;
      panel.style.top = `${Math.max(8, Math.min(rect.bottom + 4, window.innerHeight - 380))}px`;
      panel.showPopover(); search.current?.focus();
    }}><span aria-hidden className="comment-emoji-glyph">☺</span></IconButton>
    <div id={id} ref={popup} popover="auto" role="dialog" aria-label="选择评论表情" className="task-emoji-menu" onToggle={(event) => setOpen((event.nativeEvent as ToggleEvent).newState === "open")} onKeyDown={(event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); popup.current?.hidePopover(); trigger.current?.querySelector("button")?.focus(); }
    }}>
      <DropdownPanel width="w-full" padding="p-3">
        <div className="flex flex-col gap-3">
          <TextField ref={search} color="blue" aria-label="搜索评论表情" placeholder="搜索表情，例如：赞、庆祝、完成…" value={query} onChange={setQuery} />
          <p className="text-xs text-fg-grey-700">常用表情{query ? ` · ${matches.length} 个结果` : ""}</p>
          <div className="workspace-list-scroll max-h-64 overflow-y-auto">
            {matches.length ? <IconPicker color="blue" icons={matches.map(([glyph]) => <span key={glyph} className="text-xl">{glyph}</span>)} labels={matches.map(([glyph, keywords]) => `${glyph} ${keywords}`)} onChange={(index) => { popup.current?.hidePopover(); onSelect(matches[index][0]); }} /> : <p role="status" className="py-4 text-sm text-fg-grey-700">没有匹配的表情，试试其他关键词。</p>}
          </div>
        </div>
      </DropdownPanel>
    </div>
  </div>;
}
