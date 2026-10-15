"use client";

import { FileTypeIcon, FileCard } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";
import { PreviewBlock } from "../_preview-block";
import { ApiTable, CodeBlock, InlineCode, type ApiTableRow } from "../_api-table";

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
        hint="按文件类型展示图标、名称、大小和上传状态。"
      />

      <Section
        title="FileTypeIcon"
        description="根据文件扩展名显示对应图标。"
      >
        <SubSection title="导入组件" stack>
          <CodeBlock code={CODE_IMPORT} />
        </SubSection>

        <SubSection title="使用方法" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            传 <InlineCode>fileName</InlineCode>，组件自己取 ext 查表。未知后缀回落到 txt。
          </p>
          <PreviewBlock code={CODE_ICON_USAGE} minHeight={140}>
            <FileTypeIcon fileName="design.fig" />
          </PreviewBlock>
        </SubSection>

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

        <SubSection title="弱化" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>dim</InlineCode> 让图标半透明，用于上传中态。
          </p>
          <PreviewBlock code={CODE_ICON_DIM} minHeight={140}>
            <FileTypeIcon fileName="design.fig" dim />
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={ICON_PROPS} />
        </SubSection>
      </Section>

      <Section
        title="FileCard"
        description="展示文件名称、大小、类型及上传状态。"
      >
        <SubSection title="使用方法" stack>
          <PreviewBlock code={CODE_FILECARD_USAGE}>
            <div className="w-96">
              <FileCard file={{ id: "1", name: "brief.pdf", size: "2.4 MB", state: "uploaded" }} onRemove={() => {}} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="状态" stack>
          <p className="text-sm leading-[1.7] text-fg-grey-900">
            <InlineCode>uploading</InlineCode> 显示进度条，<InlineCode>success</InlineCode> 绿勾，<InlineCode>error</InlineCode> 显示重试。
          </p>
          <PreviewBlock code={CODE_FILECARD_STATES} minHeight={220}>
            <div className="w-96 flex flex-col gap-2">
              <FileCard file={{ id: "1", name: "upload.pdf", size: "1.2 MB", state: "uploading" }} />
              <FileCard file={{ id: "2", name: "success.pdf", size: "1.2 MB", state: "success" }} onRemove={() => {}} />
              <FileCard file={{ id: "3", name: "error.pdf", size: "1.2 MB", state: "error" }} onRetry={() => {}} onRemove={() => {}} />
            </div>
          </PreviewBlock>
        </SubSection>

        <SubSection title="API" stack>
          <ApiTable rows={FILECARD_PROPS} />
        </SubSection>
      </Section>

    </div>
  );
}
