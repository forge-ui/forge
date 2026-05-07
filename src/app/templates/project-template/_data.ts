export type ProjectStatus = "In Progress" | "Draft" | "Blocked" | "Completed";
export type Priority = "Low" | "Medium" | "High";
export type DetailTab = "project" | "task" | "activity" | "chat" | "files";
export type ProjectLogoKey =
  | "oksy"
  | "target"
  | "fourSquare"
  | "odoble"
  | "loopline"
  | "oce"
  | "zola"
  | "slashtri"
  | "shieldfy"
  | "lightbulb";

export const avatar = (key: string) => `https://i.pravatar.cc/150?u=project-template-${key}`;

export const mainProfile = {
  avatar: avatar("john-hoegan"),
  name: "John Doe Hoegan",
  role: "Manager",
};

export const teamMeta = {
  teamName: "Sugab's Team",
  teamAvatar: avatar("sugab-team"),
  teamMemberCount: 24,
};

export type Project = {
  id: string;
  name: string;
  client: string;
  dueDate: string;
  members: string[];
  memberOverflow?: number;
  budget: string;
  spent: string;
  progress: number;
  status: ProjectStatus;
  logo: ProjectLogoKey;
  description: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  projects: number;
  added: string;
  avatar: string;
  logo: ProjectLogoKey;
};

export type Member = {
  id: string;
  name: string;
  handle: string;
  role: string;
  assigned: number;
  email: string;
  phone: string;
  joined: string;
  lastOnline: string;
  avatar: string;
};

export type Task = {
  id: string;
  name: string;
  project: string;
  client: string;
  dueDate: string;
  progress: number;
  members: string[];
  memberOverflow?: number;
  priority: Priority;
  status: "Not Started" | "In Progress" | "Finished";
  logo: ProjectLogoKey;
};

export const projects: Project[] = [
  { id: "alpha", name: "Education Platf...", client: "Oksy.co", dueDate: "24 Feb 2024", members: [avatar("jay"), avatar("linda"), avatar("jessica"), avatar("adam")], memberOverflow: 2, budget: "$40,000.00", spent: "$14,000", progress: 25, status: "In Progress", logo: "oksy", description: "A complete learning platform redesign for content, classes, and operational dashboards." },
  { id: "template", name: "Template Design", client: "Target", dueDate: "24 Feb 2024", members: [avatar("jame"), avatar("mary")], budget: "$40,000.00", spent: "$12,400", progress: 68, status: "In Progress", logo: "target", description: "Template system for launch pages and repeatable campaign operations." },
  { id: "website", name: "Website Redesi...", client: "4Square", dueDate: "24 Feb 2024", members: [avatar("elisa"), avatar("josh"), avatar("sin"), avatar("amy")], budget: "$40,000.00", spent: "$8,200", progress: 0, status: "Draft", logo: "fourSquare", description: "Marketing website refresh with new content hierarchy and visual system." },
  { id: "marketing", name: "Marketing Proje...", client: "Odoble", dueDate: "24 Feb 2024", members: [avatar("a1"), avatar("a2"), avatar("a3"), avatar("a4")], memberOverflow: 5, budget: "$40,000.00", spent: "$11,700", progress: 45, status: "Blocked", logo: "odoble", description: "Multi-channel campaign with blocked launch assets awaiting review." },
  { id: "rebranding", name: "Rebranding", client: "Loopline", dueDate: "24 Feb 2024", members: [avatar("b1"), avatar("b2"), avatar("b3")], budget: "$40,000.00", spent: "$36,800", progress: 100, status: "Completed", logo: "loopline", description: "Brand identity and collateral package for a completed repositioning project." },
  { id: "promotion", name: "Promotion Part...", client: "Oce Auto", dueDate: "24 Feb 2024", members: [avatar("c1"), avatar("c2")], budget: "$40,000.00", spent: "$21,300", progress: 50, status: "In Progress", logo: "oce", description: "Promotion partnership workflow with asset review, media planning, and reporting." },
  { id: "cms", name: "Internal CMS To...", client: "Zola", dueDate: "24 Feb 2024", members: [avatar("d1"), avatar("d2"), avatar("d3"), avatar("d4")], memberOverflow: 8, budget: "$40,000.00", spent: "$4,100", progress: 12, status: "Draft", logo: "zola", description: "Internal CMS tooling for content teams and operations." },
  { id: "app", name: "App Redesign", client: "Slashtri", dueDate: "24 Feb 2024", members: [avatar("e1"), avatar("e2"), avatar("e3")], budget: "$40,000.00", spent: "$16,900", progress: 45, status: "Blocked", logo: "slashtri", description: "Mobile app redesign blocked by product decision on navigation structure." },
  { id: "media", name: "Media Campaign", client: "Shieldfy", dueDate: "24 Feb 2024", members: [avatar("f1"), avatar("f2")], budget: "$40,000.00", spent: "$39,200", progress: 100, status: "Completed", logo: "shieldfy", description: "Media campaign production and post-launch reporting." },
  { id: "lightbulb", name: "Project Alpha", client: "Lightbulb", dueDate: "24 Feb 2024", members: [avatar("g1"), avatar("g2"), avatar("g3"), avatar("g4")], memberOverflow: 3, budget: "$40,000.00", spent: "$14,000", progress: 25, status: "Completed", logo: "lightbulb", description: "Flagship project used across Protask detail and favorite navigation examples." },
];

export const clients: Client[] = [
  { id: "mary", name: "Mary Patricia", email: "user@mail.com", company: "Oksy.co", phone: "050 414 8778", projects: 14, added: "12 Dec 2023", avatar: avatar("client-mary"), logo: "oksy" },
  { id: "jame", name: "Jame Brian", email: "user@mail.com", company: "Target", phone: "050 414 8778", projects: 14, added: "10 Dec 2023", avatar: avatar("client-jame"), logo: "target" },
  { id: "linda", name: "Linda William", email: "user@mail.com", company: "4Square", phone: "050 414 8778", projects: 14, added: "05 Dec 2023", avatar: avatar("client-linda"), logo: "fourSquare" },
  { id: "jessica", name: "Jessica Robert", email: "user@mail.com", company: "Odoble", phone: "050 414 8778", projects: 14, added: "29 Oct 2023", avatar: avatar("client-jessica"), logo: "odoble" },
  { id: "amy", name: "Amy Lee", email: "user@mail.com", company: "Loopline", phone: "050 414 8778", projects: 14, added: "15 Oct 2023", avatar: avatar("client-amy"), logo: "loopline" },
  { id: "jacob", name: "Jacob Sinclair", email: "user@mail.com", company: "Oce Auto", phone: "050 414 8778", projects: 14, added: "30 Sep 2023", avatar: avatar("client-jacob"), logo: "oce" },
  { id: "lisa", name: "Lisa Hudson", email: "user@mail.com", company: "Zola", phone: "050 414 8778", projects: 14, added: "01 Sep 2023", avatar: avatar("client-lisa"), logo: "zola" },
  { id: "elisa", name: "Elisa Akiko", email: "user@mail.com", company: "Slashtri", phone: "050 414 8778", projects: 14, added: "24 Aug 2023", avatar: avatar("client-elisa"), logo: "slashtri" },
  { id: "sin", name: "Sin Tae", email: "user@mail.com", company: "Shieldfy", phone: "050 414 8778", projects: 14, added: "02 Aug 2023", avatar: avatar("client-sin"), logo: "shieldfy" },
  { id: "john", name: "John Bushmill", email: "user@mail.com", company: "Lightbulb", phone: "050 414 8778", projects: 14, added: "19 Jun 2023", avatar: avatar("client-john"), logo: "lightbulb" },
];

export const members: Member[] = [
  { id: "linda", name: "Linda Blair", handle: "@linda_blair321", role: "Project Manager", assigned: 43, email: "lindablair@mail.com", phone: "050 414 8788", joined: "12 December 2022", lastOnline: "1 Hour Ago", avatar: avatar("member-linda") },
  { id: "jay", name: "Jay Hargudson", handle: "@jay_hargudson", role: "Project Manager", assigned: 28, email: "jay@mail.com", phone: "050 414 8778", joined: "20 Desember 2022", lastOnline: "Online", avatar: avatar("member-jay") },
  { id: "jessica", name: "Jessica Patricia", handle: "@jessica", role: "Front End Developer", assigned: 18, email: "jessica@mail.com", phone: "050 414 8778", joined: "03 January 2023", lastOnline: "3 Hours Ago", avatar: avatar("member-jessica") },
  { id: "john", name: "John Bushmill", handle: "@john", role: "UI/UX Designer", assigned: 16, email: "john@mail.com", phone: "050 414 8778", joined: "15 January 2023", lastOnline: "Yesterday", avatar: avatar("member-john") },
  { id: "mary", name: "Mary Patricia", handle: "@mary", role: "Mobile Developer", assigned: 14, email: "mary@mail.com", phone: "050 414 8778", joined: "12 December 2023", lastOnline: "2 Days Ago", avatar: avatar("member-mary") },
];

export const tasks: Task[] = [
  { id: "marketing-partnership", name: "Marketing Partn...", project: "Target", client: "Target", dueDate: "21 Oct 2022", progress: 50, members: [avatar("m1"), avatar("m2"), avatar("m3"), avatar("m4")], memberOverflow: 5, priority: "Low", status: "In Progress", logo: "target" },
  { id: "app-redesign", name: "App Redesign", project: "4Square", client: "4Square", dueDate: "21 Oct 2022", progress: 100, members: [avatar("m5"), avatar("m6")], priority: "High", status: "Finished", logo: "fourSquare" },
  { id: "payment-redesign", name: "Payment Redesi...", project: "Oce Auto", client: "Oce Auto", dueDate: "21 Oct 2022", progress: 0, members: [avatar("m7"), avatar("m8"), avatar("m9")], priority: "Medium", status: "Not Started", logo: "oce" },
  { id: "landing-page", name: "Landing Page De...", project: "Odoble", client: "Odoble", dueDate: "21 Oct 2022", progress: 45, members: [avatar("m10"), avatar("m11"), avatar("m12"), avatar("m13")], priority: "High", status: "In Progress", logo: "odoble" },
  { id: "template-design", name: "Template Design", project: "Oksy.co", client: "Oksy.co", dueDate: "21 Oct 2022", progress: 100, members: [avatar("m14"), avatar("m15"), avatar("m16"), avatar("m17")], memberOverflow: 2, priority: "Low", status: "Finished", logo: "oksy" },
];

export const activityItems = [
  { title: "New Task Added", body: "Jay Parker created new task", time: "1 day ago" },
  { title: "Task Status Changed", body: "Jay Parker move Moodboard task to In Progress", time: "2 day ago" },
  { title: "New Comment", body: "Jay Parker commented in Wireframe Task", time: "2 day ago" },
  { title: "New Attachment", body: "Jay Parker upload new attachment", time: "1 week ago" },
];

export const fileItems = [
  { name: "Wireframe.doc", size: "300 KB", type: "doc" },
  { name: "Development Brief.pdf", size: "300 KB", type: "pdf" },
  { name: "Old Design.fig", size: "300 KB", type: "fig" },
];
