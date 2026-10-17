"use client";

import { FileTypeIcon, FileCard } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";
import { ApiBlock, DocExample } from "../_doc-blocks";
import { CodeBlock, type ApiTableRow } from "../_api-table";

const designFiles = ["fig", "psd", "ai", "eps", "jpg", "png", "gif", "svg"];
const documentFiles = ["pdf", "doc", "txt", "xls", "ppt", "zip", "rar"];
const mediaFiles = ["mp3", "mp4", "wav", "mkv", "avi", "mov"];

function IconTile({ ext }: { ext: string }) {
  return (
    <Labeled label={`.${ext}`}>
      <FileTypeIcon fileName={`sample.${ext}`} />
    </Labeled>
  );
}

const CODE_IMPORT = `import { FileTypeIcon, FileCard } from "@forge-ui-official/core";`;

const CODE_ICON_USAGE = `<FileTypeIcon fileName="design.fig" />`;

const CODE_ICON_DIM = `<FileTypeIcon fileName="design.fig" dim />`;

const CODE_FILECARD_USAGE = `<FileCard file={{ id: "1", name: "brief.pdf", size: "2.4 MB", state: "uploaded" }} />`;

const CODE_FILECARD_STATES = `<FileCard file={{ id: "1", name: "upload.pdf", size: "1.2 MB", state: "uploading" }} />
<FileCard file={{ id: "2", name: "success.pdf", size: "1.2 MB", state: "success" }} />
<FileCard file={{ id: "3", name: "error.pdf", size: "1.2 MB", state: "error" }} onRetry={() => {}} />`;

const ICON_PROPS: ApiTableRow[] = [
  { attr: "fileName", type: "string", defaultValue: "—", description: "文件名，取后缀查表映射图标。未知后缀回落到 txt，可传 \"folder\" 取文件夹图标。" },
  { attr: "dim", type: "boolean", defaultValue: "false", description: "半透明态，用于 uploading 进度过渡。" },
  { attr: "className", type: "string", defaultValue: "''", description: "额外 className。" },
];

const FILECARD_PROPS: ApiTableRow[] = [
  { attr: "file", type: "FileItem", defaultValue: "—", description: "单个文件对象 { id, name, size, state? }。" },
  { attr: "file.state", type: "'uploaded' | 'success' | 'uploading' | 'error'", defaultValue: "'uploaded'", description: "文件当前状态，决定右侧显示的图标或操作。" },
  { attr: "onRemove", type: "(id: string) => void", defaultValue: "—", description: "点击关闭按钮时回调。" },
  { attr: "onRetry", type: "(id: string) => void", defaultValue: "—", description: "error 状态下点击重试回调。" },
  { attr: "className", type: "string", defaultValue: "''", description: "额外 className。" },
];

export default function FileTypeCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="文件展示"
        hint="图标按扩展名区分。文件卡片在图标旁边加上名称、大小和上传状态。"
      />

      <Section title="用法" description="传入文件名，组件按后缀选图标。不认识的后缀用文本图标。">
        <SubSection title="导入" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>
        <SubSection title="最小示例" stack>
          <DocExample id="filetypeicon" title="FileTypeIcon" summary="按文件名选图标。dim 把图标变淡，用在上传进行中。" code={`${CODE_ICON_USAGE}\n${CODE_ICON_DIM}`} minHeight={140}>
            <div className="flex items-center gap-4">
              <FileTypeIcon fileName="design.fig" />
              <FileTypeIcon fileName="design.fig" dim />
            </div>
          </DocExample>
        </SubSection>
      </Section>

      <Section title="例子" description="每种扩展名的图标不一样，所以按设计、文档和媒体分开列。上传状态只在文件卡片上演示一次。">
        <SubSection title="设计与图片" stack>
          <div className="flex flex-wrap items-start gap-3">
            {designFiles.map((ext) => <IconTile key={ext} ext={ext} />)}
          </div>
        </SubSection>
        <SubSection title="文档" stack>
          <div className="flex flex-wrap items-start gap-3">
            {documentFiles.map((ext) => <IconTile key={ext} ext={ext} />)}
          </div>
        </SubSection>
        <SubSection title="媒体" stack>
          <div className="flex flex-wrap items-start gap-3">
            {mediaFiles.map((ext) => <IconTile key={ext} ext={ext} />)}
          </div>
        </SubSection>
        <SubSection title="文件夹" stack>
          <div className="flex flex-wrap items-start gap-3">
            <Labeled label="folder">
              <FileTypeIcon fileName="folder" />
            </Labeled>
          </div>
        </SubSection>
        <DocExample id="filecard" title="FileCard" summary="已上传、上传中、完成和失败是同一张文件卡片。" code={`${CODE_FILECARD_USAGE}\n${CODE_FILECARD_STATES}`} minHeight={220}>
          <div className="flex w-full flex-col gap-2">
            <FileCard file={{ id: "1", name: "brief.pdf", size: "2.4 MB", state: "uploaded" }} onRemove={() => {}} />
            <FileCard file={{ id: "2", name: "upload.pdf", size: "1.2 MB", state: "uploading" }} />
            <FileCard file={{ id: "3", name: "success.pdf", size: "1.2 MB", state: "success" }} onRemove={() => {}} />
            <FileCard file={{ id: "4", name: "error.pdf", size: "1.2 MB", state: "error" }} onRetry={() => {}} onRemove={() => {}} />
          </div>
        </DocExample>
      </Section>

      <Section title="API">
        <ApiBlock id="filetypeicon" title="FileTypeIcon" rows={ICON_PROPS} />
        <ApiBlock id="filecard" title="FileCard" rows={FILECARD_PROPS} />
      </Section>

    </div>
  );
}
