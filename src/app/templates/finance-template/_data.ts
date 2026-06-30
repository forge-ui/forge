export type FinanceStatus = "Paid" | "Pending" | "Overdue" | "Draft";
export type TransactionStatus = "Success" | "Pending" | "Canceled";

export const avatar = (key: string) => `https://i.pravatar.cc/150?u=finance-template-${key}`;
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

export type Invoice = {
  id: string;
  invoiceNumber: string;
  billTo: string;
  email: string;
  avatar: string;
  amount: string;
  invoiceDate: string;
  dueDate: string;
  status: FinanceStatus;
};

export type Wallet = {
  id: string;
  name: string;
  date: string;
  balance: string;
  target: string;
  dueDate: string;
  created: string;
  progress: number;
  color: "purple" | "green" | "blue" | "yellow" | "red" | "cyan";
};

export type FinanceCard = {
  id: string;
  name: string;
  type: string;
  last4: string;
  balance: string;
  limit: string;
  status: "Active" | "Frozen";
  theme: "purple" | "blue" | "yellow" | "dark";
};

export type Transaction = {
  id: string;
  name: string;
  business: string;
  category: string;
  iconUrl: string;
  amount: string;
  date: string;
  time: string;
  status: TransactionStatus;
};

export const invoices: Invoice[] = [
  { id: "inv302012-lisa-greg", invoiceNumber: "INV302012", billTo: "Lisa Greg", email: "lisagreg@mail.com", avatar: avatar("lisa"), amount: "$1,200.00", invoiceDate: "12 Dec 2023", dueDate: "14 Dec 2023", status: "Draft" },
  { id: "inv302012-mohammad-karim", invoiceNumber: "INV302012", billTo: "Mohammad Karim", email: "moh_karim@mail.com", avatar: avatar("karim"), amount: "$120.00", invoiceDate: "10 Dec 2023", dueDate: "12 Dec 2023", status: "Pending" },
  { id: "inv302012-john-bushmill", invoiceNumber: "INV302012", billTo: "John Bushmill", email: "joshbill@mail.com", avatar: avatar("john"), amount: "$2,500.00", invoiceDate: "05 Dec 2023", dueDate: "08 Dec 2023", status: "Paid" },
  { id: "inv302012-josh-adam", invoiceNumber: "INV302012", billTo: "Josh Adam", email: "josh_adam@mail.com", avatar: avatar("adam"), amount: "$150.00", invoiceDate: "29 Oct 2023", dueDate: "31 Oct 2023", status: "Pending" },
  { id: "inv302012-linda-blair", invoiceNumber: "INV302012", billTo: "Linda Blair", email: "linda_blair@mail.com", avatar: avatar("linda"), amount: "$88.00", invoiceDate: "15 Oct 2023", dueDate: "17 Oct 2023", status: "Overdue" },
  { id: "inv302012-laura-prichet", invoiceNumber: "INV302012", billTo: "Laura Prichet", email: "laurap@mail.com", avatar: avatar("laura"), amount: "$3,500.00", invoiceDate: "30 Sep 2023", dueDate: "30 Sep 2023", status: "Paid" },
  { id: "inv302012-sin-tae", invoiceNumber: "INV302012", billTo: "Sin Tae", email: "sintae@mail.com", avatar: avatar("sin"), amount: "$50,250.00", invoiceDate: "01 Sep 2023", dueDate: "03 Sep 2023", status: "Draft" },
  { id: "inv302012-david-holland", invoiceNumber: "INV302012", billTo: "David Holland", email: "davidholland@mail.com", avatar: avatar("david"), amount: "$10,200.00", invoiceDate: "24 Aug 2023", dueDate: "27 Aug 2023", status: "Paid" },
  { id: "inv302012-bryan-adam", invoiceNumber: "INV302012", billTo: "Bryan Adam", email: "bryanadam@mail.com", avatar: avatar("bryan"), amount: "$100.00", invoiceDate: "02 Aug 2023", dueDate: "05 Aug 2023", status: "Paid" },
  { id: "inv302012-tracy-williams", invoiceNumber: "INV302012", billTo: "Tracy Williams", email: "tracyw@mail.com", avatar: avatar("tracy"), amount: "$175.00", invoiceDate: "19 Jun 2023", dueDate: "15 Oct 2021", status: "Paid" },
];

export const wallets: Wallet[] = [
  { id: "holiday", name: "Holiday", date: "12 December 2025", balance: "$400", target: "$1,200.00", dueDate: "12 Dec 2023", created: "12 Dec 2022", progress: 65, color: "blue" },
  { id: "laptop", name: "New Laptop", date: "10 December 2025", balance: "$120", target: "$120.00", dueDate: "10 Dec 2023", created: "10 Dec 2022", progress: 45, color: "purple" },
  { id: "renovation", name: "Home Renovation", date: "05 December 2025", balance: "$400", target: "$2,500.00", dueDate: "05 Dec 2023", created: "05 Dec 2022", progress: 100, color: "green" },
  { id: "phone", name: "New Phone", date: "29 October 2025", balance: "$400", target: "$150.00", dueDate: "29 Oct 2023", created: "29 Oct 2022", progress: 25, color: "red" },
  { id: "earphone", name: "New Earphone", date: "15 October 2025", balance: "$400", target: "$88.00", dueDate: "15 Oct 2023", created: "15 Oct 2022", progress: 85, color: "cyan" },
  { id: "emergency", name: "Emergency Funds", date: "12 December 2025", balance: "$3,500", target: "$3,500.00", dueDate: "12 Dec 2023", created: "12 Dec 2022", progress: 55, color: "yellow" },
  { id: "retirement", name: "Retirement Funds", date: "10 December 2025", balance: "$50,250", target: "$50,250.00", dueDate: "10 Dec 2023", created: "10 Dec 2022", progress: 70, color: "blue" },
  { id: "college", name: "College Funds", date: "05 December 2025", balance: "$10,200", target: "$10,200.00", dueDate: "05 Dec 2023", created: "05 Dec 2022", progress: 40, color: "purple" },
  { id: "keyboard", name: "New Keyboard", date: "29 October 2025", balance: "$100", target: "$100.00", dueDate: "29 Oct 2023", created: "29 Oct 2022", progress: 100, color: "green" },
  { id: "tablet", name: "New Tablet", date: "15 October 2025", balance: "$175", target: "$175.00", dueDate: "15 Oct 2023", created: "15 Oct 2021", progress: 60, color: "red" },
];

export const cards: FinanceCard[] = [
  { id: "main", name: "Jay Hadgunson", type: "Visa Platinum", last4: "9090", balance: "$8,245.00", limit: "$15,000", status: "Active", theme: "purple" },
  { id: "travel", name: "Jay Hadgunson", type: "Mastercard", last4: "5521", balance: "$2,120.00", limit: "$8,000", status: "Active", theme: "blue" },
  { id: "ops", name: "Jay Hadgunson", type: "Business Debit", last4: "3328", balance: "$920.00", limit: "$5,000", status: "Frozen", theme: "yellow" },
];

export const transactions: Transaction[] = [
  { id: "TRX-49082", name: "Renting Bill", business: "House", category: "Housing", iconUrl: avatar("house"), amount: "-$400.00", date: "12 Dec 2023", time: "03:00 PM", status: "Pending" },
  { id: "TRX-49083", name: "Restaurant Bill", business: "Restaurant", category: "Food", iconUrl: avatar("restaurant"), amount: "-$20.00", date: "10 Dec 2023", time: "03:00 PM", status: "Pending" },
  { id: "TRX-49084", name: "Money Received", business: "Business", category: "Received", iconUrl: avatar("business"), amount: "+$1,400.00", date: "05 Dec 2023", time: "03:00 PM", status: "Success" },
  { id: "TRX-49085", name: "Uber", business: "Transport", category: "Transportation", iconUrl: avatar("transport"), amount: "-$15.00", date: "29 Oct 2023", time: "03:00 PM", status: "Canceled" },
  { id: "TRX-49086", name: "Money Sent", business: "Transfer", category: "Transfer", iconUrl: avatar("transfer-1"), amount: "-$220.25", date: "15 Oct 2023", time: "03:00 PM", status: "Success" },
  { id: "TRX-49087", name: "Top Wup Wallet", business: "Wallet", category: "Savings", iconUrl: avatar("wallet"), amount: "+$475.00", date: "30 Sep 2023", time: "03:00 PM", status: "Canceled" },
  { id: "TRX-49088", name: "Money Sent", business: "Transfer", category: "Transfer", iconUrl: avatar("transfer-2"), amount: "-$115.55", date: "01 Sep 2023", time: "03:00 PM", status: "Success" },
  { id: "TRX-49089", name: "Purchasing", business: "Shop", category: "Shopping", iconUrl: avatar("shop-1"), amount: "-$98.02", date: "24 Aug 2023", time: "03:00 PM", status: "Success" },
  { id: "TRX-49090", name: "Money Received", business: "Business", category: "Business", iconUrl: avatar("business-2"), amount: "+$450.00", date: "02 Aug 2023", time: "03:00 PM", status: "Success" },
  { id: "TRX-49091", name: "Purchasing", business: "Shop", category: "Shopping", iconUrl: avatar("shop-2"), amount: "-$105.12", date: "19 Jun 2023", time: "03:00 PM", status: "Success" },
];
