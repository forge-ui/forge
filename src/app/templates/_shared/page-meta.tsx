"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { AppLayoutPageHeaderVariant } from "@forge-ui/react";

// SSR 不能跑 useLayoutEffect，client 侧用 useLayoutEffect 避免首屏闪标题
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ============================================================
// 路径推断 title — SSR 阶段就有正确 title 不闪现
// hook 调用是 override / 兜底，不是必须
// ============================================================
type Rule = {
  match: (path: string) => boolean;
  meta: PageMeta;
};

const PATH_RULES: Rule[] = [
  // ecommerce orders
  { match: (p) => /^\/app\/ecommerce\/orders\/[^/]+\/invoice$/.test(p), meta: { title: "Invoice", variant: "detail" } },
  { match: (p) => /^\/app\/ecommerce\/orders\/new$/.test(p), meta: { title: "New Order", variant: "detail" } },
  { match: (p) => /^\/app\/ecommerce\/orders\/[^/]+$/.test(p), meta: { title: "Order Details", variant: "detail" } },
  { match: (p) => p === "/templates/ecommerce/orders", meta: { title: "Orders", variant: "home" } },
  // ecommerce categories
  { match: (p) => /^\/app\/ecommerce\/categories\/new$/.test(p), meta: { title: "New Category", variant: "detail" } },
  { match: (p) => /^\/app\/ecommerce\/categories\/[^/]+$/.test(p), meta: { title: "Category Details", variant: "detail" } },
  { match: (p) => p === "/templates/ecommerce/categories", meta: { title: "Categories", variant: "home" } },
  // ecommerce customers
  { match: (p) => /^\/app\/ecommerce\/customers\/new$/.test(p), meta: { title: "New Customer", variant: "detail" } },
  { match: (p) => /^\/app\/ecommerce\/customers\/[^/]+$/.test(p), meta: { title: "Customer Details", variant: "detail" } },
  { match: (p) => p === "/templates/ecommerce/customers", meta: { title: "Customers", variant: "home" } },
  // ecommerce products
  { match: (p) => /^\/app\/ecommerce\/products\/new$/.test(p), meta: { title: "New Product", variant: "detail" } },
  { match: (p) => /^\/app\/ecommerce\/products\/[^/]+$/.test(p), meta: { title: "Product Details", variant: "detail" } },
  { match: (p) => p === "/templates/ecommerce/products", meta: { title: "Products", variant: "home" } },
  // ecommerce sellers
  { match: (p) => /^\/app\/ecommerce\/sellers\/[^/]+$/.test(p), meta: { title: "Seller Details", variant: "detail" } },
  { match: (p) => p === "/templates/ecommerce/sellers", meta: { title: "Sellers", variant: "home" } },
];

function inferMetaFromPath(pathname: string): PageMeta {
  const rule = PATH_RULES.find((r) => r.match(pathname));
  return rule?.meta ?? { title: "Dashboard", variant: "home" };
}

// ============================================================
// PageMeta — 让 page 注入自己的 title / variant 给上层 AppLayout
// 使用方式：
//   page 内: usePageMeta({ title: "Order Details", variant: "detail" })
//   layout: <PageMetaProvider> 包 <AppLayoutBridge>
// ============================================================

export interface PageMeta {
  title: string;
  variant?: AppLayoutPageHeaderVariant;
}

const DEFAULT_META: PageMeta = { title: "Dashboard", variant: "home" };

interface PageMetaContextValue {
  meta: PageMeta;
  setMeta: (next: PageMeta | null) => void;
}

const PageMetaContext = createContext<PageMetaContextValue>({
  meta: DEFAULT_META,
  setMeta: () => {},
});

export function PageMetaProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const inferred = useMemo(() => inferMetaFromPath(pathname), [pathname]);
  const [override, setOverride] = useState<PageMeta | null>(null);
  const meta = override ?? inferred;
  const setMeta = useCallback(
    (next: PageMeta | null) => setOverride(next),
    []
  );
  const value = useMemo<PageMetaContextValue>(
    () => ({ meta, setMeta }),
    [meta, setMeta]
  );
  return (
    <PageMetaContext.Provider value={value}>{children}</PageMetaContext.Provider>
  );
}

export function usePageMetaValue(): PageMeta {
  return useContext(PageMetaContext).meta;
}

export function usePageMeta(meta: PageMeta) {
  const { setMeta } = useContext(PageMetaContext);
  const { title, variant } = meta;
  useIsoLayoutEffect(() => {
    setMeta({ title, variant });
    return () => setMeta(null);
  }, [setMeta, title, variant]);
}
