"use client";

import { useState, type Key } from "react";
import {
  Button,
  Grid,
  GridItem,
  DataTable,
  type ColumnDef,
  type AppLayoutMenuSection,
} from "@forge-ui-official/core";
import { AppLayout } from "@forge-ui-official/core/components/layouts/app-layout";
import { BellBoldDuotone } from "@forge-ui-official/core/icons";
import { PageHeader } from "@forge-ui-official/core/components/ui/page-header";

type Row = {
  id: string;
  name: string;
};

const rows: Row[] = [
  { id: "dataset-a", name: "客服知识库" },
  { id: "dataset-b", name: "信贷制度评测集" },
];

const columns: ColumnDef<Row>[] = [
  {
    key: "name",
    header: "数据集",
    render: (row) => <span>{row.name}</span>,
  },
];

const menuSections: AppLayoutMenuSection[] = [
  { label: "工作区", items: [{ label: "数据集", href: "/" }] },
  { label: "智能体", items: [{ label: "智能体", href: "/agents" }] },
  { label: "平台", items: [{ label: "设置", href: "/settings" }] },
];

export default function Home() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<Key>>(new Set());

  return (
    <AppLayout
      profilePosition="sidebar"
      pageTitle="真实包消费"
      menuSections={menuSections}
      hideSidebarWidgets
    >
      <main className="min-h-screen bg-fg-grey-50 p-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-5 rounded-card bg-white p-5">
          <PageHeader
            variant="title"
            title="Forge Core tarball consumer"
            showBackButton={false}
            showDatePicker={false}
            showFilters={false}
            showKebab={false}
            showFavorite={false}
            askAi={{ onSend: async () => ({ text: "Ask AI consumer response", links: [{ label: "返回首页", href: "/" }] }) }}
            primaryAction={{ label: "新建" }}
          />
          <Grid columns={{ base: 1, md: 12 }} gap={{ base: 8, lg: 24 }}>
            <GridItem span={{ base: "full", md: 8 }}><Button color="purple" iconLeft={<BellBoldDuotone aria-label="Forge Solar icon" />}>根入口组件</Button></GridItem>
            <GridItem span={{ base: "full", md: 4 }}>Grid consumer</GridItem>
          </Grid>
          <DataTable
            columns={columns}
            rows={rows}
            showCheckbox
            getRowKey={(row) => row.id}
            selectedRowKeys={selectedRowKeys}
            onSelectedRowKeysChange={setSelectedRowKeys}
          />
        </div>
      </main>
    </AppLayout>
  );
}
