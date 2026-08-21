"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddCircleLinear, CloudUploadLinear } from "solar-icon-set";
import { Button, CellActions, Checkbox, FileCard, FileTypeIcon, Toolbar, ToolbarActions, ToolbarDatepicker, ToolbarSearchInput } from "@forge-ui-official/core";
import {
  ProtaskDeleteDialog,
  ProtaskFilterTrigger,
} from "../../_shared/protask-actions";
import { Modal } from "../../_shared/modal";
import { MicellaneousPageHeader, MicellaneousTemplateShell } from "../_chrome";
import { files, type ManagedFile } from "../_data";

type FileTile = {
  id: string;
  name: string;
  meta: string;
  kind: "folder" | "doc" | "fig" | "ai" | "gif" | "ppt" | "zip" | "rar" | "png";
};

const folderTiles: FileTile[] = [
  { id: "uiux", name: "UI/UX Reference", meta: "8 Files", kind: "folder" },
  { id: "internal", name: "Internal Project", meta: "8 Files", kind: "folder" },
  { id: "brand", name: "How to Build Brand", meta: "8 Files", kind: "folder" },
  { id: "systems", name: "Design Systems", meta: "8 Files", kind: "folder" },
  { id: "flutter", name: "Flutter 101", meta: "8 Files", kind: "folder" },
];

const fileTiles: FileTile[] = [
  { id: "mom", name: "3rd Meeting MOM", meta: "100 KB", kind: "doc" },
  { id: "requirement", name: "New Requirement", meta: "100 KB", kind: "fig" },
  { id: "banner", name: "Banner", meta: "100 KB", kind: "ai" },
  { id: "cta", name: "CTA Promo", meta: "100 KB", kind: "gif" },
  { id: "presentation", name: "Project Presentation", meta: "100 KB", kind: "ppt" },
  { id: "photo", name: "Photo Material", meta: "100 KB", kind: "zip" },
  { id: "brainstorm", name: "Brainstorming", meta: "100 KB", kind: "doc" },
  { id: "marketing", name: "Marketing Material", meta: "100 KB", kind: "rar" },
  { id: "pitching", name: "Pitching Template", meta: "100 KB", kind: "ppt" },
  { id: "logo", name: "New Logo", meta: "100 KB", kind: "png" },
];

export default function MicellaneousFilesPage() {
  return (
    <Suspense fallback={null}>
      <MicellaneousFilesContent />
    </Suspense>
  );
}

function MicellaneousFilesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<ManagedFile | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const dialog = searchParams.get("dialog");
  const isUploadDialog = dialog === "add-files" || dialog === "add-files-uploading";
  const isDeleteDialog = dialog === "file-manager-delete-file" || dialog === "delete-file";
  const compactView = searchParams.get("view") === "file-manager-1";
  const closeState = () => {
    setDeleteTarget(null);
    setUploadOpen(false);
    if (dialog || compactView) router.replace("/templates/micellaneous-template/files");
  };

  return (
    <MicellaneousTemplateShell>
      <div className="flex flex-col gap-5">
        <MicellaneousPageHeader
          variant="collection"
          title="File Manager"
          current={compactView ? "File Manager-1" : "File Manager"}
          primaryAction={{ label: "Add File", icon: <AddCircleLinear size={18} />, onClick: () => router.push("/templates/micellaneous-template/files?dialog=add-files") }}
        />
        <Toolbar
          className="flex-col gap-4 lg:flex-row lg:items-center"
          left={<ToolbarSearchInput placeholder="Search..." />}
          right={<ToolbarActions><ToolbarDatepicker label="Select Dates" /><ProtaskFilterTrigger color="purple" count={0} /></ToolbarActions>}
        />
        <section>
          <h2 className="text-xl font-semibold text-fg-black">Folders</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
            {(compactView ? folderTiles.slice(0, 4) : folderTiles).map((tile) => (
              <FileManagerTile key={tile.id} tile={tile} onDelete={() => setDeleteTarget(files[0])} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-fg-black">Files</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
            {(compactView ? fileTiles.slice(0, 8) : fileTiles).map((tile) => (
              <FileManagerTile key={tile.id} tile={tile} onDelete={() => setDeleteTarget(files[0])} />
            ))}
          </div>
        </section>
        <ProtaskDeleteDialog
          open={!!deleteTarget || isDeleteDialog}
          title="Delete File?"
          description="Do you want to delete this file? This action can't be undone"
          onClose={closeState}
        />
        <Modal open={uploadOpen || isUploadDialog} onClose={closeState} title="Add Files" width="w-[620px]">
          <div className="flex flex-col gap-5 p-6">
            <div className="rounded-2xl border border-dashed border-fg-violet-300 bg-fg-violet-100 p-5 text-center">
              <CloudUploadLinear size={32} color="var(--fg-violet)" />
              <p className="mt-3 text-sm font-semibold leading-5 tracking-fg text-fg-black">
                Drop files here or browse from your device
              </p>
              <p className="mt-1 text-xs font-medium leading-4 tracking-fg text-fg-grey-700">
                Upload queue is ready for review.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {files.slice(0, 3).map((file) => (
                <FileCard key={file.id} file={{ id: file.id, name: file.name, size: file.size, state: dialog === "add-files-uploading" ? "uploading" : file.state }} />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-fg-grey-200 p-6">
            <Button color="grey" variant="tertiary" onClick={closeState}>Cancel</Button>
            <Button onClick={closeState}>Upload Files</Button>
          </div>
        </Modal>
      </div>
    </MicellaneousTemplateShell>
  );
}

function FileManagerTile({ tile, onDelete }: { tile: FileTile; onDelete: () => void }) {
  const iconFileName = tile.kind === "folder" ? "folder" : `${tile.name}.${tile.kind}`;

  return (
    <div className="rounded-[20px] border border-fg-grey-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <Checkbox />
        <CellActions actions={[]} onKebab={onDelete} />
      </div>
      <div className="mt-8 flex h-28 items-center justify-center">
        <FileTypeIcon fileName={iconFileName} className="!size-24" />
      </div>
      <p className="mt-8 truncate text-center text-base font-semibold text-fg-black">{tile.name}</p>
      <p className="mt-2 text-center text-sm font-medium text-fg-grey-500">{tile.meta}</p>
    </div>
  );
}
