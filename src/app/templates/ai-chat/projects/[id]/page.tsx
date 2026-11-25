"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Composer, ComposerAction, ComposerInput, ComposerSend, ComposerToolbar, TextArea, useToast } from "@aideui/core";
import { ChatRoundLineLinear, FileTextLinear, PaperclipLinear, PenLinear } from "@aideui/core/icons";
import { BASE, PageFrame } from "../../_shell";
import { PROJECTS, PROJECT_DETAILS, THREADS } from "../../_data";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const project = PROJECTS.find((item) => item.id === id) ?? PROJECTS[0];
  const detail = PROJECT_DETAILS[project.id];
  const [instructions, setInstructions] = useState(detail.instructions);
  const [editing, setEditing] = useState(false);
  const threads = THREADS.filter((thread) => thread.projectId === project.id);

  return (
    <PageFrame title={project.name} description={detail.description}>
      <Composer onSend={() => router.push(`${BASE}?thread=${threads[0]?.id ?? "hero"}`)} placeholder={`在「${project.name}」里开始新对话`}>
        <ComposerInput rows={2} />
        <ComposerToolbar>
          <ComposerAction label="添加附件" icon={<PaperclipLinear size={18} />} />
          <span className="flex-1" />
          <ComposerSend />
        </ComposerToolbar>
      </Composer>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium">对话 · {threads.length}</h2>
          <div className="flex flex-col divide-y divide-fg-grey-100 rounded-2xl border border-fg-grey-200">
            {threads.map((thread) => {
              const last = [...thread.turns].reverse().find((turn) => turn.role === "assistant");
              return (
                <Button variant="unstyled" key={thread.id} type="button" onClick={() => router.push(`${BASE}?thread=${thread.id}`)} className="flex items-start gap-3 p-4 text-left transition-colors hover:bg-fg-grey-50">
                  <ChatRoundLineLinear size={18} className="mt-0.5 shrink-0 text-fg-grey-700" />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm font-medium">{thread.title}</span>
                      <span className="shrink-0 text-xs text-fg-grey-700">{thread.updated}</span>
                    </span>
                    {last && last.role === "assistant" && <span className="line-clamp-1 text-xs text-fg-grey-700">{last.paragraphs[0]}</span>}
                  </span>
                </Button>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="flex flex-col gap-3 rounded-2xl border border-fg-grey-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">项目说明</h2>
              {!editing && (
                <Button variant="unstyled" type="button" aria-label="编辑项目说明" onClick={() => setEditing(true)} className="flex size-7 items-center justify-center rounded-lg text-fg-grey-700 hover:bg-fg-grey-100">
                  <PenLinear size={14} />
                </Button>
              )}
            </div>
            {editing ? (
              <>
                <TextArea value={instructions} onChange={setInstructions} rows={5} aria-label="项目说明" />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="tertiary" onClick={() => { setInstructions(detail.instructions); setEditing(false); }}>
                    取消
                  </Button>
                  <Button size="sm" color="black" onClick={() => { setEditing(false); toast({ title: "项目说明已保存", status: "success" }); }}>
                    保存
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm leading-6 text-fg-grey-900">{instructions}</p>
            )}
            <span className="text-xs text-fg-grey-700">这个项目里的每个对话都会遵守</span>
          </section>
          <section className="flex flex-col gap-3 rounded-2xl border border-fg-grey-200 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">资料 · {detail.files.length}</h2>
              <Button size="sm" variant="tertiary" color="grey">上传</Button>
            </div>
            <ul className="flex flex-col gap-1">
              {detail.files.map((file) => (
                <li key={file.name} className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
                  <FileTextLinear size={16} className="shrink-0 text-fg-grey-700" />
                  <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                  <span className="text-xs text-fg-grey-700">{file.size}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </PageFrame>
  );
}
