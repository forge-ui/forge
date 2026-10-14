import type { Metadata } from "next";
import { FusionGallery } from "./_gallery";

export const metadata: Metadata = {
  title: "组件交互总览 · Forge",
  robots: { index: false, follow: false },
};

export default function ComponentFusionPreview() {
  return <FusionGallery />;
}
