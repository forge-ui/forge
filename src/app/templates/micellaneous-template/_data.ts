export const avatar = (key: string) => `https://i.pravatar.cc/150?u=micellaneous-template-${key}`;
const protaskCrmAsset = (name: string) => `/images/protask/crm/${name}`;

export const mainProfile = {
  avatar: protaskCrmAsset("john-hoegan-avatar.png"),
  name: "John Doe Hoegan",
  role: "Manager",
};

export const teamMeta = {
  teamName: "Sugab's Team",
  teamAvatar: protaskCrmAsset("team-avatar.png"),
  teamMemberCount: 24,
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  unread?: number;
  online?: boolean;
};

export type ManagedFile = {
  id: string;
  name: string;
  size: string;
  type: "Folder" | "PDF" | "Image" | "Video" | "Archive";
  owner: string;
  modified: string;
  state?: "uploaded" | "success" | "uploading" | "error";
};

export type ActionRow = {
  id: string;
  title: string;
  owner: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Review" | "Done" | "Blocked";
};

export const contacts: Contact[] = [
  { id: "jane", name: "Jane Cooper", role: "Product Manager", avatar: avatar("jane"), unread: 3, online: true },
  { id: "wade", name: "Wade Warren", role: "Designer", avatar: avatar("wade"), online: true },
  { id: "esther", name: "Esther Howard", role: "Developer", avatar: avatar("esther"), unread: 1 },
  { id: "darlene", name: "Darlene Robertson", role: "Marketing", avatar: avatar("darlene") },
  { id: "team", name: "Design Team", role: "12 Members", avatar: protaskCrmAsset("team-avatar.png"), unread: 8, online: true },
];

export const files: ManagedFile[] = [
  { id: "brief", name: "Project Brief.pdf", size: "2.4 MB", type: "PDF", owner: "Jane Cooper", modified: "12 Dec 2025", state: "success" },
  { id: "design", name: "Dashboard Design.fig", size: "14.8 MB", type: "Image", owner: "Wade Warren", modified: "10 Dec 2025", state: "uploaded" },
  { id: "assets", name: "Brand Assets.folder", size: "128 MB", type: "Folder", owner: "Design Team", modified: "09 Dec 2025", state: "uploaded" },
  { id: "recording", name: "Sprint Review.mp4", size: "80.5 MB", type: "Video", owner: "Esther Howard", modified: "07 Dec 2025", state: "uploading" },
  { id: "archive", name: "Old CRM Export.zip", size: "45.2 MB", type: "Archive", owner: "Darlene Robertson", modified: "01 Dec 2025", state: "uploaded" },
];

export const actions: ActionRow[] = [
  { id: "ACT-2101", title: "Review calendar detail modal", owner: "Jane Cooper", due: "24 Jan 2026", priority: "High", status: "Open" },
  { id: "ACT-2102", title: "Upload invoice attachment set", owner: "Wade Warren", due: "25 Jan 2026", priority: "Medium", status: "In Review" },
  { id: "ACT-2103", title: "Confirm team chat members", owner: "Esther Howard", due: "28 Jan 2026", priority: "Low", status: "Done" },
  { id: "ACT-2104", title: "Fix missing file owner mapping", owner: "Darlene Robertson", due: "30 Jan 2026", priority: "High", status: "Blocked" },
];

export const calendarEvents = [
  { day: 12, hour: 6, label: "Meeting Tit...", color: "purple" as const, avatar: avatar("jane") },
  { day: 13, hour: 10, label: "Meeting Tit...", color: "blue" as const, avatar: avatar("wade") },
  { day: 13, hour: 10, label: "Meeting Tit...", color: "purple" as const, avatar: avatar("esther") },
  { day: 14, hour: 8, label: "Meeting Tit...", color: "red" as const, avatar: protaskCrmAsset("team-avatar.png") },
  { day: 14, hour: 8, label: "Meeting Tit...", color: "yellow" as const, avatar: avatar("darlene") },
  { day: 16, hour: 7, label: "Meeting Tit...", color: "green" as const, avatar: avatar("jane") },
  { day: 17, hour: 12, label: "Meeting Tit...", color: "red" as const, avatar: avatar("wade") },
  { day: 15, hour: 14, label: "Meeting Tit...", color: "yellow" as const, avatar: avatar("esther") },
];
