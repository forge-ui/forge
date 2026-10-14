"use client";

import { useId, useState } from "react";
import { Accordion, Button } from "@forge-ui-official/core";

export function AccordionMotionPreview({ locale = "zh", color = "blue", motion = "auto" }: {
  locale?: "zh" | "en"; color?: "blue" | "purple" | "black"; motion?: "auto" | "none";
}) {
  const english = locale === "en";
  const [showSteps, setShowSteps] = useState(false);
  const stepsId = useId();
  const focusColor = color === "blue" ? "[&_button:focus-visible]:outline-fg-blue" : color === "purple" ? "[&_button:focus-visible]:outline-fg-violet" : "[&_button:focus-visible]:outline-fg-black";

  return <div className="w-full max-w-xl space-y-4">
    <Accordion defaultValue="members" motion={motion} className={focusColor} items={[
      {
        value: "members",
        title: english ? "How do I invite teammates?" : "如何邀请团队成员？",
        content: <div className="space-y-3">
          <p>{english ? "Open your workspace settings, choose Members, and enter the email addresses of the people you want to invite. You can set their access before sending an invitation." : "在工作区设置中进入「成员管理」，输入受邀人的邮箱，并在发送邀请前设置访问权限。"}</p>
          <Button variant="tertiary" size="sm" color={color} motion={motion} aria-expanded={showSteps} aria-controls={stepsId} onClick={() => setShowSteps((current) => !current)}>
            {showSteps ? (english ? "Hide steps" : "收起操作步骤") : (english ? "View steps" : "查看操作步骤")}
          </Button>
          {showSteps && <ol id={stepsId} className="list-decimal space-y-1 pl-5">
            <li>{english ? "Open Settings, then Members." : "打开「设置」，进入「成员管理」。"}</li>
            <li>{english ? "Enter an email address and select a role." : "填写邮箱，并选择成员角色。"}</li>
            <li>{english ? "Send the invitation. The member can join from their email." : "发送邀请，成员即可通过邮件加入工作区。"}</li>
          </ol>}
        </div>,
      },
      {
        value: "files",
        title: english ? "Where are my files saved?" : "文件保存在哪里？",
        content: english ? "Files are saved to the project where they were uploaded. Team members with project access can find them in the Files tab." : "上传的文件会保存在对应项目中。有项目访问权限的成员，可以在「文件」页签中查看和下载。",
      },
      {
        value: "notifications",
        title: english ? "Can I control which notifications I receive?" : "可以调整收到的通知吗？",
        content: english ? "Yes. Open your profile settings and choose Notifications. You can control assignment updates, mentions, and project activity separately." : "可以。在个人设置中进入「通知」，分别调整任务分配、提及和项目动态的提醒方式。",
      },
      {
        value: "permissions",
        title: english ? "Why can’t I edit a project?" : "为什么无法编辑项目？",
        content: english ? "Your current role may have view-only access. Ask a workspace administrator to review your project permissions. Changing your role takes effect without moving or copying any files." : "当前角色可能只有查看权限。请联系工作区管理员检查项目权限；调整角色后即可生效，无需重新移动或复制文件。",
      },
    ]} />
    <p className="text-xs leading-5 text-fg-grey-500">{english ? "Try switching questions quickly, or expand the steps inside an answer. Arrow keys, Home, and End move between question headings." : "可连续切换问题，或展开回答中的操作步骤。方向键、Home 和 End 可在问题标题间移动。"}</p>
  </div>;
}
