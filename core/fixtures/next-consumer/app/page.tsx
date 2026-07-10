"use client";

import { useState, type Key } from "react";
import {
  Button,
  DataTable,
  type ColumnDef,
} from "@forge-ui-official/core";
import { AppLayout } from "@forge-ui-official/core/components/layouts/app-layout";
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

export default function Home() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<Key>>(new Set());

  return (
    <AppLayout
      profilePosition="sidebar"
      pageTitle="真实包消费"
      menuItems={[{ label: "数据集", href: "/" }]}
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
            primaryAction={{ label: "新建" }}
          />
          <Button color="purple">根入口组件</Button>
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
