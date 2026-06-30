export const avatar = (key: string) => `https://i.pravatar.cc/150?u=crm-template-${key}`;
export const logo = (text: string, color = "ede9fe") => `https://placehold.co/40x40/${color}/4b5563?text=${encodeURIComponent(text)}`;
export const crmAsset = (name: string) => `/images/protask/crm/${name}`;

export const mainProfile = {
  avatar: crmAsset("john-hoegan-avatar.png"),
  name: "John Doe Hoegan",
  role: "Manager",
};

export const teamMeta = {
  teamName: "Sugab's Team",
  teamAvatar: crmAsset("team-avatar.png"),
  teamMemberCount: 24,
};

export type CustomerStatus = "Paid" | "Pending" | "Overdue" | "Idle";
export type LeadStatus = "New" | "Warm" | "Lost" | "Hot" | "Cold" | "Success";
export type SaleStatus = "Pending" | "Overdue" | "Paid";
export type ActivityType = "Call" | "Meet" | "Notes" | "Activity";

export type Customer = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  company: string;
  companyLogo: string;
  location: string;
  spent: string;
  status: CustomerStatus;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  company: string;
  source: string;
  added: string;
  status: LeadStatus;
};

export type Sale = {
  id: string;
  transaction: string;
  invoiceId: string;
  total: string;
  client: string;
  clientCompany: string;
  clientAvatar: string;
  payment: string;
  customer: string;
  product: string;
  amount: string;
  closeDate: string;
  owner: string;
  status: SaleStatus;
};

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  customer: string;
  avatar: string;
  date: string;
  time: string;
  note: string;
};

export const customers: Customer[] = [
  { id: "john-bushmill", name: "John Bushmill", email: "johnb@mail.com", avatar: avatar("john-bushmill"), phone: "078 5054 8877", company: "Oksy.co", companyLogo: logo("O", "dbeafe"), location: "CA, USA", spent: "$2,121.00", status: "Paid" },
  { id: "laura-prichet", name: "Laura Prichet", email: "laura_prichet@mail.com", avatar: avatar("laura-prichet"), phone: "215 302 3376", company: "Target", companyLogo: logo("T", "fee2e2"), location: "TX, USA", spent: "$890.00", status: "Pending" },
  { id: "mohammad-karim", name: "Mohammad Karim", email: "m_karim@mail.com", avatar: avatar("mohammad-karim"), phone: "050 414 8778", company: "4square", companyLogo: logo("4", "fef3c7"), location: "NY, USA", spent: "$125.00", status: "Idle" },
  { id: "josh-bill", name: "Josh Bill", email: "josh_bill@mail.com", avatar: avatar("josh-bill"), phone: "216 75 612 706", company: "Odoble", companyLogo: logo("Od", "ede9fe"), location: "MC, UK", spent: "$1,348.00", status: "Overdue" },
  { id: "josh-adam", name: "Josh Adam", email: "josh_adam@mail.com", avatar: avatar("josh-adam"), phone: "02 75 150 655", company: "Loodline", companyLogo: logo("L", "f3f4f6"), location: "JKT, ID", spent: "$607.00", status: "Paid" },
  { id: "sin-tae", name: "Sin Tae", email: "sin_tae@mail.com", avatar: avatar("sin-tae"), phone: "078 6013 3854", company: "Oce auto", companyLogo: logo("Oa", "e0f2fe"), location: "LD, UK", spent: "$934.00", status: "Paid" },
  { id: "rajesh-masvidal", name: "Rajesh Masvidal", email: "rajesh_m@mail.com", avatar: avatar("rajesh"), phone: "828 216 2190", company: "Zola", companyLogo: logo("Z", "ede9fe"), location: "SBY, ID", spent: "$760.00", status: "Overdue" },
  { id: "fajar-surya", name: "Fajar Surya", email: "fsurya@mail.com", avatar: avatar("fajar-surya"), phone: "078 7173 9261", company: "Slashtri", companyLogo: logo("S", "fee2e2"), location: "KL, MY", spent: "$4,400.00", status: "Idle" },
  { id: "lisa-greg", name: "Lisa Greg", email: "lisag@mail.com", avatar: avatar("lisa-greg"), phone: "077 6157 4248", company: "Shieldfy", companyLogo: logo("S", "dbeafe"), location: "TKY, JPN", spent: "$812.00", status: "Pending" },
  { id: "linda-blair", name: "Linda Blair", email: "lindablair@mail.com", avatar: crmAsset("linda-blair-avatar.png"), phone: "050 414 8778", company: "Lightbulb", companyLogo: logo("L", "fed7aa"), location: "RM, SPN", spent: "$1,123.00", status: "Paid" },
];

export const leads: Lead[] = [
  { id: "lead-john-bushmill", name: "John Bushmill", email: "johnb@mail.com", avatar: avatar("lead-john-bushmill"), phone: "078 5054 8877", company: "Oksy.co", source: "Email", added: "14 Jan 2025", status: "New" },
  { id: "lead-laura-prichet", name: "Laura Prichet", email: "laura_prichet@mail.com", avatar: avatar("lead-laura-prichet"), phone: "215 302 3376", company: "Target", source: "Flyer", added: "14 Jan 2025", status: "Warm" },
  { id: "lead-mohammad-karim", name: "Mohammad Karim", email: "m_karim@mail.com", avatar: avatar("lead-mohammad-karim"), phone: "050 414 8778", company: "4square", source: "Facebook", added: "14 Jan 2025", status: "Lost" },
  { id: "lead-josh-bill", name: "Josh Bill", email: "josh_bill@mail.com", avatar: avatar("lead-josh-bill"), phone: "216 75 612 706", company: "Odoble", source: "Instagram", added: "14 Jan 2025", status: "Hot" },
  { id: "lead-josh-adam", name: "Josh Adam", email: "josh_adam@mail.com", avatar: avatar("lead-josh-adam"), phone: "02 75 150 655", company: "Loodline", source: "Direct Message", added: "14 Jan 2025", status: "Cold" },
  { id: "lead-sin-tae", name: "Sin Tae", email: "sin_tae@mail.com", avatar: avatar("lead-sin-tae"), phone: "078 6013 3854", company: "Oce auto", source: "Email", added: "14 Jan 2025", status: "Success" },
  { id: "lead-rajesh-masvidal", name: "Rajesh Masvidal", email: "rajesh_m@mail.com", avatar: avatar("lead-rajesh"), phone: "828 216 2190", company: "Zola", source: "Flyer", added: "14 Jan 2025", status: "Hot" },
  { id: "lead-fajar-surya", name: "Fajar Surya", email: "fsurya@mail.com", avatar: avatar("lead-fajar-surya"), phone: "078 7173 9261", company: "Slashtri", source: "Facebook", added: "14 Jan 2025", status: "Lost" },
  { id: "lead-lisa-greg", name: "Lisa Greg", email: "lisag@mail.com", avatar: avatar("lead-lisa-greg"), phone: "077 6157 4248", company: "Shieldfy", source: "Instagram", added: "14 Jan 2025", status: "Warm" },
  { id: "lead-linda-blair", name: "Linda Blair", email: "lindablair@mail.com", avatar: avatar("lead-linda-blair"), phone: "050 414 8778", company: "Lightbulb", source: "Direct Message", added: "14 Jan 2025", status: "Success" },
];

export const sales: Sale[] = [
  { id: "sales-web-redesign-1", transaction: "Web Redesign", invoiceId: "INV23064", total: "$121.00", client: "Patricia P", clientCompany: "Company", clientAvatar: avatar("sales-patricia"), payment: "Mastercard", customer: "Patricia P", product: "Web Redesign", amount: "$121.00", closeDate: "14 Jan 2025", owner: "John D Hoegan", status: "Pending" },
  { id: "sales-crm-tools-1", transaction: "Internal CRM Tools #2", invoiceId: "INV23064", total: "$590.00", client: "Laura Prichet", clientCompany: "Company", clientAvatar: avatar("sales-laura"), payment: "Visa", customer: "Laura Prichet", product: "Internal CRM Tools #2", amount: "$590.00", closeDate: "14 Jan 2025", owner: "John D Hoegan", status: "Pending" },
  { id: "sales-marketing-1", transaction: "Marketing Project", invoiceId: "INV23064", total: "$125.00", client: "Mohammad Karim", clientCompany: "Company", clientAvatar: avatar("sales-karim"), payment: "Transfer", customer: "Mohammad Karim", product: "Marketing Project", amount: "$125.00", closeDate: "14 Jan 2025", owner: "John D Hoegan", status: "Overdue" },
  { id: "sales-landing-1", transaction: "Landing Page", invoiceId: "INV23064", total: "$348.00", client: "Josh Bill", clientCompany: "Company", clientAvatar: avatar("sales-josh-bill"), payment: "Paypall", customer: "Josh Bill", product: "Landing Page", amount: "$348.00", closeDate: "14 Jan 2025", owner: "John D Hoegan", status: "Paid" },
  { id: "sales-omnichannel-1", transaction: "Omnichannel Project", invoiceId: "INV23064", total: "$607.00", client: "Josh Adam", clientCompany: "Company", clientAvatar: avatar("sales-josh-adam"), payment: "Visa", customer: "Josh Adam", product: "Omnichannel Project", amount: "$607.00", closeDate: "14 Jan 2025", owner: "John D Hoegan", status: "Paid" },
  { id: "sales-web-redesign-2", transaction: "Web Redesign", invoiceId: "INV23064", total: "$234.00", client: "Sin Tae", clientCompany: "Company", clientAvatar: avatar("sales-sin-tae"), payment: "Visa", customer: "Sin Tae", product: "Web Redesign", amount: "$234.00", closeDate: "14 Jan 2025", owner: "John D Hoegan", status: "Overdue" },
  { id: "sales-crm-tools-2", transaction: "Internal CRM Tools #2", invoiceId: "INV23064", total: "$760.00", client: "Rajesh Masvidal", clientCompany: "Company", clientAvatar: avatar("sales-rajesh"), payment: "Transfer", customer: "Rajesh Masvidal", product: "Internal CRM Tools #2", amount: "$760.00", closeDate: "14 Jan 2025", owner: "John D Hoegan", status: "Pending" },
  { id: "sales-marketing-2", transaction: "Marketing Project", invoiceId: "INV23064", total: "$400.00", client: "Fajar Surya", clientCompany: "Company", clientAvatar: avatar("sales-fajar"), payment: "Mastercard", customer: "Fajar Surya", product: "Marketing Project", amount: "$400.00", closeDate: "14 Jan 2025", owner: "John D Hoegan", status: "Paid" },
  { id: "sales-landing-2", transaction: "Landing Page", invoiceId: "INV23064", total: "$812.00", client: "Lisa Greg", clientCompany: "Company", clientAvatar: avatar("sales-lisa"), payment: "Paypall", customer: "Lisa Greg", product: "Landing Page", amount: "$812.00", closeDate: "14 Jan 2025", owner: "John D Hoegan", status: "Overdue" },
  { id: "sales-omnichannel-2", transaction: "Omnichannel Project", invoiceId: "INV23064", total: "$123.00", client: "Linda Blair", clientCompany: "Company", clientAvatar: avatar("sales-linda"), payment: "Paypall", customer: "Linda Blair", product: "Omnichannel Project", amount: "$123.00", closeDate: "14 Jan 2025", owner: "John D Hoegan", status: "Paid" },
];

export const activities: Activity[] = [
  { id: "ACT-1", type: "Call", title: "Intro call scheduled", customer: "John Bushmill", avatar: avatar("act-john"), date: "04/10/25", time: "12:45", note: "Discussed renewal timing and decision process." },
  { id: "ACT-2", type: "Meet", title: "Product walkthrough", customer: "Laura Prichet", avatar: avatar("act-laura"), date: "04/10/25", time: "14:20", note: "Shared CRM pipeline and sales report screens." },
  { id: "ACT-3", type: "Notes", title: "Budget note added", customer: "Mohammad Karim", avatar: avatar("act-karim"), date: "04/11/25", time: "09:10", note: "Finance approval required before invoice creation." },
  { id: "ACT-4", type: "Activity", title: "Status changed", customer: "Linda Blair", avatar: avatar("act-linda"), date: "04/11/25", time: "16:30", note: "Lead moved from Warm to Success." },
];
