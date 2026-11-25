"use client";

import { useState } from "react";
import { Button, KebabMenu, Modal, TextField, cn, useToast } from "@aideui/core";
import { AddCircleLinear, AltArrowDownLinear, AltArrowRightLinear, MagniferLinear, SidebarMinimalisticLinear } from "@aideui/core/icons";
import { SettingsIcon } from "@solar-icons/react/linear/settings";
import { IconAction, useSidebar } from "../_shell";
import { PLUGINS, type Plugin, type PluginSection } from "../_data";

const SECTIONS: PluginSection[] = ["热门", "办公协作", "开发", "数据与设计"];
const FILTERS = ["全部", "已安装", "比特林克"] as const;

export default function PluginsPage() {
  const { toast } = useToast();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [plugins, setPlugins] = useState(PLUGINS);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("全部");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = plugins.find((plugin) => plugin.id === openId);
  const matches = (plugin: Plugin) =>
    (filter === "全部" || (filter === "已安装" ? plugin.installed : plugin.author === filter)) && (!query || `${plugin.name}${plugin.description}`.toLowerCase().includes(query.toLowerCase()));
  const sections = SECTIONS.map((section) => ({ section, items: plugins.filter((plugin) => plugin.section === section && matches(plugin)) })).filter((group) => group.items.length > 0);

  const toggle = (plugin: Plugin) => {
    setPlugins((previous) => previous.map((item) => (item.id === plugin.id ? { ...item, installed: !item.installed } : item)));
    toast({ title: plugin.installed ? `已移除 ${plugin.name}` : `已添加 ${plugin.name}`, status: "success" });
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-[940px] flex-col px-8 pb-16 pt-4">
        <header className="flex items-start gap-4">
          {!sidebarOpen && (
            <IconAction label="展开侧栏" onClick={() => setSidebarOpen(true)}>
              <SidebarMinimalisticLinear size={18} />
            </IconAction>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h1 className="text-2xl font-medium leading-9 tracking-fg text-fg-black">插件</h1>
            <p className="text-base text-fg-grey-700">连接插件，让助手在你常用的工具里一起干活</p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <TextField shape="pill" className="w-64" value={query} onChange={setQuery} placeholder="搜索插件" aria-label="搜索插件" iconLeft={<MagniferLinear size={16} />} />
            <IconAction label="管理已添加的插件" onClick={() => setFilter("已安装")}>
              <SettingsIcon size={18} />
            </IconAction>
            <Button size="sm" color="black" iconRight={<AltArrowDownLinear size={14} />}>
              添加
            </Button>
          </div>
        </header>

        <div className="mt-4 flex gap-2">
          {FILTERS.map((item) => (
            <Button variant="unstyled" key={item} type="button" onClick={() => setFilter(item)} className={cn("h-9 rounded-full px-4 text-sm transition-colors", item === filter ? "bg-fg-grey-100 font-medium text-fg-black" : "text-fg-grey-700 hover:bg-fg-grey-50")}>
              {item}
            </Button>
          ))}
        </div>

        {sections.length === 0 && <p className="py-20 text-center text-sm text-fg-grey-700">没有找到匹配的插件</p>}

        {sections.map(({ section, items }) => (
          <section key={section} className="mt-10 flex flex-col">
            <h2 className="flex items-center gap-1 text-lg font-medium text-fg-black">
              {section}
              <AltArrowRightLinear size={16} className="text-fg-grey-700" />
            </h2>
            <div className="mt-4 grid gap-x-12 sm:grid-cols-2">
              {items.map((plugin) => (
                <div key={plugin.id} className="group -mx-3 flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-fg-grey-50">
                  <Button variant="unstyled" type="button" onClick={() => setOpenId(plugin.id)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
                    <PluginIcon plugin={plugin} />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-base font-medium text-fg-black">{plugin.name}</span>
                      <span className="truncate text-sm text-fg-grey-700">{plugin.description}</span>
                    </span>
                  </Button>
                  {plugin.installed ? (
                    <KebabMenu
                      accent="black"
                      items={[
                        { label: "查看详情", onSelect: () => setOpenId(plugin.id) },
                        { label: "移除", onSelect: () => toggle(plugin) },
                      ]}
                    />
                  ) : (
                    <IconAction label={`添加${plugin.name}`} onClick={() => toggle(plugin)}>
                      <AddCircleLinear size={20} />
                    </IconAction>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Modal
        open={!!open}
        onOpenChange={(value) => !value && setOpenId(null)}
        title={open?.name ?? ""}
        footer={
          open && (
            <div className="flex justify-end">
              <Button color={open.installed ? "grey" : "black"} variant={open.installed ? "tertiary" : "primary"} onClick={() => toggle(open)}>
                {open.installed ? "移除插件" : "添加插件"}
              </Button>
            </div>
          )
        }
      >
        {open && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <PluginIcon plugin={open} />
              <div className="flex flex-col">
                <span className="text-sm">{open.description}</span>
                <span className="text-xs text-fg-grey-700">
                  {open.author} · {open.installed ? "已添加" : "未添加"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">包含的工具</span>
              <ul className="flex flex-col divide-y divide-fg-grey-100 rounded-2xl border border-fg-grey-200">
                {open.tools.map((tool) => (
                  <li key={tool} className="px-4 py-3 text-sm">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-fg-grey-700">写入类操作每次都会先问你，确认后才执行。</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

function PluginIcon({ plugin }: { plugin: Plugin }) {
  if (plugin.image) {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-fg-grey-200 bg-background">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={plugin.image} alt="" className="size-6" />
      </span>
    );
  }
  return <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-semibold", plugin.tint)}>{plugin.letter}</span>;
}
