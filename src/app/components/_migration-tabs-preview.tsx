"use client";

import { useId, useState } from "react";
import { Button, Checkbox, ListGroup, ListItem, ProgressBar, TabBar, TabsContent } from "@forge-ui-official/core";
import { FileTextLinear } from "@forge-ui-official/core/icons";

export function TabsMotionPreview({ locale = "zh", color = "blue", motion = "auto" }: {
  locale?: "zh" | "en"; color?: "blue" | "purple" | "black"; motion?: "auto" | "none";
}) {
  const english = locale === "en";
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState([true, false, false]);
  const baseId = useId();
  const labels = english ? ["Overview", "Tasks", "Files"] : ["概览", "任务", "文件"];
  const tasks = english ? ["Confirm the requirements", "Review the interaction design", "Prepare the release notes"] : ["确认项目需求", "评审交互方案", "整理发布说明"];
  const completeCount = completed.filter(Boolean).length;
  return <div className="w-full max-w-xl space-y-4">
    <TabBar ariaLabel={english ? "Project views" : "项目视图"} color={color} motion={motion} className="w-full"
      tabs={labels.map((label, index) => ({ label, active: index === active, id: `${baseId}-tab-${index}`, controls: `${baseId}-panel` }))} onChange={setActive} />
    <TabsContent activeKey={active} transition="slide" motion={motion} id={`${baseId}-panel`} labelledBy={`${baseId}-tab-${active}`} className="p-1">
      {active === 0 && <ListGroup title={english ? "Workspace redesign" : "工作区改版"} subtitle={english ? "The team is preparing the next release." : "团队正在准备下一个版本。"} color={color} className="w-full" density="compact" items={<>
        <div className="space-y-2">
          <ProgressBar label={english ? `${completeCount} of 3 tasks complete` : `已完成 ${completeCount} / 3 项任务`} value={Math.round(completeCount / 3 * 100)} color={color === "black" ? "gray" : color} />
        </div>
        <Button color={color} size="sm" variant="secondary" motion={motion} onClick={() => setActive(1)}>{english ? "View tasks" : "查看任务"}</Button>
      </>} />}
      {active === 1 && <ListGroup title={english ? "Project tasks" : "项目任务"} subtitle={english ? "Update a task; progress stays in sync across tabs." : "勾选任务，概览中的进度会同步更新。"} color={color} className="w-full" density="compact" items={<div className="space-y-4">
        {tasks.map((task, index) => <label key={index} className="flex cursor-pointer items-start gap-3 py-1">
          <Checkbox checked={completed[index]} onChange={(value) => setCompleted((current) => current.map((state, position) => position === index ? value : state))} color={color} motion={motion} aria-label={task} />
          <span className="min-w-0 space-y-1">
            <span className="block text-sm font-semibold leading-5 text-fg-black">{task}</span>
            <span className="block text-xs leading-4 text-fg-grey-700">{completed[index] ? (english ? "Completed" : "已完成") : (english ? "In progress" : "进行中")}</span>
          </span>
        </label>)}
      </div>} />}
      {active === 2 && <ListGroup title={english ? "Project files" : "项目文件"} subtitle={english ? "2 shared documents" : "2 份共享文档"} color={color} className="w-full" density="compact" items={<>
        <ListItem title={english ? "Requirements" : "产品需求说明"} subtitle="PDF · 1.2 MB" lead={{ kind: "icon", icon: <FileTextLinear size={20} color="currentColor" />, variant: "light", color: "black", size: "md" }} />
        <ListItem title={english ? "Interaction review" : "交互评审记录"} subtitle={english ? "Updated today" : "今天更新"} lead={{ kind: "icon", icon: <FileTextLinear size={20} color="currentColor" />, variant: "light", color: "black", size: "md" }} />
      </>} />}
    </TabsContent>
    <p className="text-xs leading-5 text-fg-grey-500">{english ? "Switch tabs repeatedly, or use Left / Right, Home, and End. Task progress stays saved when you return." : "可连续切换页签，或使用左右方向键、Home 和 End。切回概览时，任务进度仍会保留。"}</p>
  </div>;
}
