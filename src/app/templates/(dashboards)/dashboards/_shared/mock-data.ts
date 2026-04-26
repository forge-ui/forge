export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const avatar = (key: string) => `https://i.pravatar.cc/150?u=${key}`;
export const productImage = (text: string, color = "e2e8f0") =>
  `https://placehold.co/64x64/${color}/64748b?text=${encodeURIComponent(text)}`;

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

export type TransactionRow = {
  id: string;
  name: string;
  category: string;
  amount: string;
  date: string;
  time?: string;
  status: "Pending" | "Success" | "Canceled";
  iconUrl: string;
};

export const transactions: TransactionRow[] = [
  { id: "1", name: "Figma Pro", category: "Subscription", amount: "$25.00", date: "12 Dec 2023", time: "03:00 PM", status: "Pending", iconUrl: "https://placehold.co/40x40/000/fff?text=F" },
  { id: "2", name: "Business Name", category: "Subscription", amount: "$15.00", date: "10 Dec 2023", time: "03:00 PM", status: "Pending", iconUrl: "https://placehold.co/40x40/000/fff?text=N" },
  { id: "3", name: "Slack", category: "Subscription", amount: "$35.00", date: "05 Dec 2023", time: "03:00 PM", status: "Success", iconUrl: "https://placehold.co/40x40/4a154b/fff?text=S" },
  { id: "4", name: "Amazon", category: "Marketplace", amount: "$400.00", date: "29 Oct 2023", time: "03:00 PM", status: "Canceled", iconUrl: "https://placehold.co/40x40/ff9900/fff?text=A" },
];

export type ContactRow = {
  id: string;
  name: string;
  bank: string;
  avatar: string;
  online?: boolean;
};

export const contacts: ContactRow[] = [
  { id: "1", name: "Josh Bill", bank: "Nu Bank - 109283122", avatar: avatar("josh-bill"), online: true },
  { id: "2", name: "John Bushmill", bank: "Nu Bank - 109283122", avatar: avatar("john-bushmill"), online: true },
  { id: "3", name: "Josh Adam", bank: "Nu Bank - 109283122", avatar: avatar("josh-adam"), online: true },
  { id: "4", name: "Linda Blair", bank: "Nu Bank - 109283122", avatar: avatar("linda-blair"), online: true },
  { id: "5", name: "Lisa Adam", bank: "Nu Bank - 109283122", avatar: avatar("lisa-adam"), online: true },
  { id: "6", name: "Laura Prichet", bank: "Nu Bank - 109283122", avatar: avatar("laura-prichet"), online: true },
  { id: "7", name: "Lisa Greg", bank: "Nu Bank - 109283122", avatar: avatar("lisa-greg"), online: true },
  { id: "8", name: "Mohammad Karim", bank: "Nu Bank - 109283122", avatar: avatar("mohammad-karim"), online: true },
];

export type WalletGoal = {
  id: string;
  title: string;
  date: string;
  amount: string;
  progress: number;
  color: string;
  icon: string;
};

export const walletGoals: WalletGoal[] = [
  { id: "1", title: "Holiday", date: "12 December 2025", amount: "$1,600", progress: 50, color: "#7c3aed", icon: "https://placehold.co/40x40/eef/7c3aed?text=H" },
  { id: "2", title: "New Laptop", date: "24 October 2025", amount: "$1,480", progress: 100, color: "#10b981", icon: "https://placehold.co/40x40/efe/10b981?text=L" },
];

export type ExpenseRow = {
  label: string;
  value: string;
  color: string;
  subtitle?: string;
};

export const expenses: ExpenseRow[] = [
  { label: "Housing", value: "$5,500", color: "#7c3aed", subtitle: "Apartment, Electricity, etc" },
  { label: "Food", value: "$4,245", color: "#fbbf24", subtitle: "Milk, Coffee, Sereal, etc" },
  { label: "Transportation", value: "$8,147", color: "#f97316", subtitle: "Gas, Taxi, Service" },
];

export type ProjectRow = {
  id: string;
  name: string;
  client: string;
  due: string;
  members: string[];
  status: "In Progress" | "Pending" | "Unfinished" | "Completed";
  iconUrl: string;
  iconBg: string;
};

export const projects: ProjectRow[] = [
  { id: "1", name: "Education Platfo...", client: "Oksy.co", due: "12 Dec 2023", members: [avatar("p1"), avatar("p2"), avatar("p3"), avatar("p4")], status: "In Progress", iconUrl: "https://placehold.co/40x40/dbeafe/2563eb?text=E", iconBg: "#dbeafe" },
  { id: "2", name: "Template Design", client: "Target", due: "10 Dec 2023", members: [avatar("p5"), avatar("p6")], status: "In Progress", iconUrl: "https://placehold.co/40x40/fee2e2/dc2626?text=T", iconBg: "#fee2e2" },
  { id: "3", name: "Website Redesi...", client: "4Square", due: "05 Dec 2023", members: [avatar("p7"), avatar("p8"), avatar("p9")], status: "Pending", iconUrl: "https://placehold.co/40x40/fef3c7/d97706?text=4", iconBg: "#fef3c7" },
  { id: "4", name: "Marketing Proje...", client: "Odoble", due: "29 Oct 2023", members: [avatar("p10"), avatar("p11")], status: "Unfinished", iconUrl: "https://placehold.co/40x40/dcfce7/16a34a?text=M", iconBg: "#dcfce7" },
  { id: "5", name: "Internal CMS To...", client: "Zola", due: "15 Oct 2023", members: [avatar("p12"), avatar("p13"), avatar("p14"), avatar("p15"), avatar("p16")], status: "Completed", iconUrl: "https://placehold.co/40x40/ede9fe/7c3aed?text=Z", iconBg: "#ede9fe" },
];

export type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online?: boolean;
};

export const teamMembers: TeamMemberRow[] = [
  { id: "1", name: "Mary Patricia", role: "Dev Manager", avatar: avatar("mary-patricia"), online: true },
  { id: "2", name: "James Brian", role: "Full Stack Dev", avatar: avatar("james-brian"), online: true },
  { id: "3", name: "Linda William", role: "Backend Dev", avatar: avatar("linda-william"), online: true },
  { id: "4", name: "Jessica Robert", role: "UX/UI Designer", avatar: avatar("jessica-robert"), online: true },
  { id: "5", name: "Amy Lee", role: "Product Manager", avatar: avatar("amy-lee"), online: true },
  { id: "6", name: "Jacob Sinclair", role: "Product Designer", avatar: avatar("jacob-sinclair"), online: true },
  { id: "7", name: "Lisa Hudson", role: "Copywriter", avatar: avatar("lisa-hudson"), online: true },
  { id: "8", name: "Elisa Akiko", role: "Marketing & Sales", avatar: avatar("elisa-akiko"), online: true },
];

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "New" | "Hot" | "Cold" | "Warm" | "Success";
  added: string;
  avatar: string;
};

export const leads: LeadRow[] = [
  { id: "1", name: "Lisa Greg", email: "lisagreg@mail.com", phone: "+1 987 555 909", status: "New", added: "12 Dec 2023", avatar: avatar("lisa-greg") },
  { id: "2", name: "Mohammad Kari...", email: "moh_karim@mail.co...", phone: "+4 123 411 871", status: "Hot", added: "10 Dec 2023", avatar: avatar("mohammad-karim") },
  { id: "3", name: "John Bushmill", email: "joshbill@mail.com", phone: "+1 987 555 909", status: "Cold", added: "05 Dec 2023", avatar: avatar("john-bushmill") },
  { id: "4", name: "Josh Adam", email: "josh_adam@mail.co...", phone: "+4 123 411 871", status: "Warm", added: "29 Oct 2023", avatar: avatar("josh-adam") },
  { id: "5", name: "Linda Blair", email: "linda_blair@mail.com", phone: "+1 987 555 909", status: "Success", added: "15 Oct 2023", avatar: avatar("linda-blair") },
];

export type OrderRow = {
  id: string;
  invoice?: string;
  product: string;
  productImg: string;
  productSubtitle?: string;
  customer: string;
  customerEmail: string;
  customerAvatar?: string;
  date?: string;
  total: string;
  payment?: string;
  status: "Processing" | "Canceled" | "Shiped" | "Success" | "Delivered";
};

export const orders: OrderRow[] = [
  { id: "1", invoice: "#302012", product: "Handmade Pouch", productImg: productImage("Pouch", "fef3c7"), productSubtitle: "+3 other products", customer: "John Bushmill", customerEmail: "Johnb@mail.com", date: "1 min ago", total: "$121.00", payment: "Mastercar...", status: "Processing" },
  { id: "2", invoice: "#302011", product: "Smartwatch E2", productImg: productImage("S2", "1f2937"), productSubtitle: "+1 other products", customer: "Ilham Budi A", customerEmail: "ilahmbudi@mail.com", date: "1 min ago", total: "$590.00", payment: "Visa", status: "Processing" },
  { id: "3", invoice: "#302002", product: "Smartwatch E1", productImg: productImage("S1", "374151"), customer: "Mohammad Kar...", customerEmail: "m_karim@mail.com", date: "5 hour ago", total: "$125.00", payment: "Transfer", status: "Shiped" },
  { id: "4", invoice: "#301901", product: "Headphone G1 Pro", productImg: productImage("H1", "0f172a"), productSubtitle: "+1 other products", customer: "Linda Blair", customerEmail: "lindablair@mail.com", date: "1 day ago", total: "$348.00", payment: "Paypall", status: "Canceled" },
  { id: "5", invoice: "#301900", product: "Iphone X", productImg: productImage("iX", "f3f4f6"), customer: "Josh Adam", customerEmail: "josh_adam@mail.c...", date: "2 day ago", total: "$607.00", payment: "Visa", status: "Delivered" },
];

export type ProductRow = {
  id: string;
  name: string;
  sales: string;
  price: string;
  imageUrl: string;
};

export const topProducts: ProductRow[] = [
  { id: "1", name: "Logic Wireless Mouse", sales: "340 Sales", price: "$17.678", imageUrl: productImage("Mouse", "e0e7ff") },
  { id: "2", name: "PS Controller", sales: "100 Sales", price: "$5,500", imageUrl: productImage("PS", "1e293b") },
  { id: "3", name: "Ximi Keyboard", sales: "50 Sales", price: "$2,500", imageUrl: productImage("KB", "fef3c7") },
  { id: "4", name: "Audia Earphone", sales: "147 Sales", price: "$7,456", imageUrl: productImage("AE", "ede9fe") },
  { id: "5", name: "Sams S14 Pro", sales: "540 Sales", price: "$24,189", imageUrl: productImage("S14", "fee2e2") },
  { id: "6", name: "Sams A13 5G", sales: "345 Sales", price: "$15,700", imageUrl: productImage("A13", "dbeafe") },
  { id: "7", name: "Jsound TSW", sales: "560 Sales", price: "$24,700", imageUrl: productImage("JS", "f3f4f6") },
];

export type CategoryRow = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  delta?: string;
  iconBg: string;
  iconUrl: string;
};

export const topCategories: CategoryRow[] = [
  { id: "1", name: "Smartphone", subtitle: "Subtext", price: "$24,500", delta: "5%", iconBg: "#ede9fe", iconUrl: productImage("📱", "ede9fe") },
  { id: "2", name: "Keyboard", subtitle: "Subtext", price: "$12,500", iconBg: "#fef3c7", iconUrl: productImage("⌨️", "fef3c7") },
  { id: "3", name: "Controller", subtitle: "Subtext", price: "$12,251", delta: "8%", iconBg: "#dcfce7", iconUrl: productImage("🎮", "dcfce7") },
  { id: "4", name: "Laptop", subtitle: "Subtext", price: "$10,092", delta: "5%", iconBg: "#fee2e2", iconUrl: productImage("💻", "fee2e2") },
  { id: "5", name: "Headphone", subtitle: "Subtext", price: "$9,992", delta: "7.5%", iconBg: "#fce7f3", iconUrl: productImage("🎧", "fce7f3") },
  { id: "6", name: "Speaker", subtitle: "Subtext", price: "$7,640", iconBg: "#dbeafe", iconUrl: productImage("🔊", "dbeafe") },
  { id: "7", name: "Tablet", subtitle: "Subtext", price: "$7,521", delta: "12%", iconBg: "#fef3c7", iconUrl: productImage("📱", "fef3c7") },
];

export type RegionRow = {
  id: string;
  name: string;
  flag: string;
  sales: string;
  amount: string;
  delta?: string;
  trend?: "up" | "down";
};

export const regions: RegionRow[] = [
  { id: "1", name: "United Kingdom", flag: "🇬🇧", sales: "340 Sales", amount: "$17,678", delta: "2%", trend: "down" },
  { id: "2", name: "Spain", flag: "🇪🇸", sales: "100 Sales", amount: "$5,500", delta: "2%", trend: "down" },
  { id: "3", name: "Indonesia", flag: "🇮🇩", sales: "50 Sales", amount: "$2,500", delta: "1%", trend: "up" },
  { id: "4", name: "France", flag: "🇫🇷", sales: "147 Sales", amount: "$7,456", delta: "4%", trend: "up" },
  { id: "5", name: "Germany", flag: "🇩🇪", sales: "540 Sales", amount: "$24,189", trend: "up" },
  { id: "6", name: "UAE", flag: "🇦🇪", sales: "345 Sales", amount: "$15,700", trend: "up" },
  { id: "7", name: "Turkey", flag: "🇹🇷", sales: "48 Sales", amount: "$24,700", trend: "up" },
  { id: "8", name: "United Sates", flag: "🇺🇸", sales: "23 Sales", amount: "$2,000", trend: "up" },
];

// Statistic chart series (bar)
export const statisticBarData = months.map((label, idx) => {
  const heights = [0.18, 0.65, 0.55, 0.5, 0.4, 0.3, 0.95, 0.45, 0.35, 0.85, 0.3, 0.25];
  return { label, value: Math.round(heights[idx] * 1200) };
});

// Bi-directional bar chart
export const upsideDownBarData = months.map((label, idx) => {
  const u = [400, 600, 500, 450, 400, 700, 380, 320, 380, 500, 380, 380];
  const l = [200, 250, 300, 280, 240, 800, 220, 200, 220, 230, 220, 220];
  return { label, upperValue: u[idx], lowerValue: l[idx] };
});
