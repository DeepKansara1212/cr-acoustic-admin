export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  status: "active" | "draft" | "archived";
  updatedAt: string;
};

export type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  date: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  orders: number;
  totalSpent: number;
  isActive: boolean;
};

export const products: Product[] = [
  { id: "p1", name: "Ahuja SPA-1000 Power Amplifier", sku: "AHJ-SPA1000", category: "Amplifier", brand: "Ahuja", price: 42999, stock: 14, lowStockThreshold: 5, status: "active", updatedAt: "2026-08-12" },
  { id: "p2", name: "StudioMaster CX16 Condenser Mic", sku: "SM-CX16", category: "Microphone", brand: "StudioMaster", price: 8499, stock: 32, lowStockThreshold: 10, status: "active", updatedAt: "2026-08-10" },
  { id: "p3", name: "DynaTech LA-212 Line Array", sku: "DYN-LA212", category: "Line Array Loudspeaker", brand: "DynaTech", price: 64999, stock: 3, lowStockThreshold: 5, status: "active", updatedAt: "2026-08-09" },
  { id: "p4", name: "Yamaha MG16XU Mixing Console", sku: "YMH-MG16XU", category: "Mixer", brand: "Yamaha", price: 38999, stock: 6, lowStockThreshold: 8, status: "active", updatedAt: "2026-08-14" },
  { id: "p5", name: "Pioneer HS-500 Studio Monitor", sku: "PNR-HS500", category: "Speaker", brand: "Pioneer", price: 15999, stock: 22, lowStockThreshold: 10, status: "draft", updatedAt: "2026-08-08" },
  { id: "p6", name: "Sound Craft QX-8 Crossover", sku: "SC-QX8", category: "Crossover", brand: "Sound Craft", price: 11499, stock: 17, lowStockThreshold: 8, status: "active", updatedAt: "2026-08-05" },
  { id: "p7", name: "NX Audio Horn HT-30", sku: "NXA-HT30", category: "Horn", brand: "NX Audio", price: 6299, stock: 2, lowStockThreshold: 10, status: "active", updatedAt: "2026-08-15" },
  { id: "p8", name: "Ahuja CS-980 Conference System", sku: "AHJ-CS980", category: "Conference System", brand: "Ahuja", price: 52999, stock: 5, lowStockThreshold: 5, status: "archived", updatedAt: "2026-07-30" },
];

export const orders: Order[] = [
  { id: "ORD-2026-104", customer: "Rohan Mehta", items: 2, total: 51498, status: "delivered", paymentStatus: "completed", date: "2026-08-15" },
  { id: "ORD-2026-103", customer: "Priya Nair", items: 1, total: 64999, status: "shipped", paymentStatus: "completed", date: "2026-08-14" },
  { id: "ORD-2026-102", customer: "Studio Vibe Recording", items: 4, total: 112996, status: "processing", paymentStatus: "completed", date: "2026-08-14" },
  { id: "ORD-2026-101", customer: "Arjun Kapoor", items: 1, total: 8499, status: "confirmed", paymentStatus: "pending", date: "2026-08-13" },
  { id: "ORD-2026-100", customer: "Live Sound Co.", items: 3, total: 92997, status: "pending", paymentStatus: "pending", date: "2026-08-13" },
  { id: "ORD-2026-099", customer: "Meera Iyer", items: 1, total: 15999, status: "delivered", paymentStatus: "completed", date: "2026-08-11" },
  { id: "ORD-2026-098", customer: "Kabir Singh", items: 2, total: 27998, status: "cancelled", paymentStatus: "failed", date: "2026-08-10" },
];

export const categories: Category[] = [
  { id: "c1", name: "Amplifier", slug: "amplifier", description: "Power amplifiers for PA and studio use", isActive: true },
  { id: "c2", name: "Microphone", slug: "microphone", description: "Studio and stage microphones", isActive: true },
  { id: "c3", name: "Speaker", slug: "speaker", description: "Passive and active loudspeakers", isActive: true },
  { id: "c4", name: "Mixer", slug: "mixer", description: "Analog and digital mixing consoles", isActive: true },
  { id: "c5", name: "Horn", slug: "horn", description: "Compression horn drivers", isActive: true },
  { id: "c6", name: "Crossover", slug: "crossover", description: "Active and passive crossover networks", isActive: true },
  { id: "c7", name: "Megaphone", slug: "megaphone", description: "Portable megaphones", isActive: true },
  { id: "c8", name: "Conference System", slug: "conference-system", description: "Delegate conference microphone systems", isActive: true },
  { id: "c9", name: "Line Array Loudspeaker", slug: "line-array", description: "Line array loudspeaker cabinets", isActive: true },
  { id: "c10", name: "Stands", slug: "stands", description: "Speaker and microphone stands", isActive: true },
];

export const customers: Customer[] = [
  { id: "u1", name: "Rohan Mehta", email: "rohan.mehta@example.com", joinedAt: "2026-02-14", orders: 5, totalSpent: 184996, isActive: true },
  { id: "u2", name: "Priya Nair", email: "priya.nair@example.com", joinedAt: "2026-03-02", orders: 3, totalSpent: 129997, isActive: true },
  { id: "u3", name: "Studio Vibe Recording", email: "accounts@studiovibe.in", joinedAt: "2025-11-20", orders: 12, totalSpent: 842500, isActive: true },
  { id: "u4", name: "Arjun Kapoor", email: "arjun.kapoor@example.com", joinedAt: "2026-06-18", orders: 1, totalSpent: 8499, isActive: true },
  { id: "u5", name: "Live Sound Co.", email: "hello@livesoundco.in", joinedAt: "2026-01-09", orders: 7, totalSpent: 398500, isActive: true },
  { id: "u6", name: "Meera Iyer", email: "meera.iyer@example.com", joinedAt: "2026-05-25", orders: 2, totalSpent: 24998, isActive: true },
  { id: "u7", name: "Kabir Singh", email: "kabir.singh@example.com", joinedAt: "2026-04-11", orders: 1, totalSpent: 27998, isActive: false },
];

export const brandList = ["Ahuja", "StudioMaster", "DynaTech", "Yamaha", "Pioneer", "Sound Craft", "NX Audio"];

export const revenueByMonth = [
  { month: "Mar", revenue: 412000 },
  { month: "Apr", revenue: 489000 },
  { month: "May", revenue: 455000 },
  { month: "Jun", revenue: 561000 },
  { month: "Jul", revenue: 598000 },
  { month: "Aug", revenue: 642000 },
];

export const categoryBreakdown = [
  { category: "Amplifier", value: 28 },
  { category: "Speaker", value: 22 },
  { category: "Microphone", value: 18 },
  { category: "Mixer", value: 14 },
  { category: "Other", value: 18 },
];
