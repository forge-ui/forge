"use client";

import { type ReactNode } from "react";
import { AppLayout } from "@forge-ui-official/core";
import {
  BoxBoldDuotone,
  BagBoldDuotone,
  UsersGroupTwoRoundedBoldDuotone,
  ShopBoldDuotone,
  MouseBoldDuotone,
  GameboyBoldDuotone,
  KeyboardBoldDuotone,
} from "solar-icon-set";
import type { AppLayoutMenuItem } from "@forge-ui-official/core";

const menuItems: AppLayoutMenuItem[] = [
  {
    icon: <BoxBoldDuotone size={20} />,
    label: "Product",
    href: "/templates/ecommerce/products",
    children: [
      { label: "Product List", href: "/templates/ecommerce/products" },
      { label: "Categories", href: "/templates/ecommerce/categories" },
    ],
  },
  { icon: <BagBoldDuotone size={20} />, label: "Orders", href: "/templates/ecommerce/orders", badge: 2 },
  { icon: <UsersGroupTwoRoundedBoldDuotone size={20} />, label: "Customers", href: "/templates/ecommerce/customers" },
  { icon: <ShopBoldDuotone size={20} />, label: "Seller", href: "/templates/ecommerce/sellers" },
];

const favoriteItems: AppLayoutMenuItem[] = [
  { icon: <MouseBoldDuotone size={20} />, label: "Logic Wireless Mouse", href: "/templates/ecommerce/products/logic-mouse" },
  { icon: <GameboyBoldDuotone size={20} />, label: "PS Controller", href: "/templates/ecommerce/products/ps-controller" },
  { icon: <KeyboardBoldDuotone size={20} />, label: "Ximi Keyboard", href: "/templates/ecommerce/products/ximi-keyboard" },
];

const profile = {
  avatar: "https://i.pravatar.cc/150?u=forge-user",
  name: "Alex Morgan",
  role: "Product Manager",
};

export default function AppLayoutRoot({ children }: { children: ReactNode }) {
  return (
    <AppLayout
      mode="light"
      profilePosition="topbar"
      accent="purple"
      menuItems={menuItems}
      favoriteItems={favoriteItems}
      profile={profile}
      teamName="Forge Studio"
      teamAvatar="https://i.pravatar.cc/150?u=team"
      teamMemberCount={12}
      notifications={99}
      messages={99}
    >
      {children}
    </AppLayout>
  );
}
