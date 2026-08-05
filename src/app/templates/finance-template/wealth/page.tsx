"use client";

import { useRouter } from "next/navigation";
import { AddCircleLinear } from "solar-icon-set";
import {
  Button,
  CellActions,
  CellText,
  DataTable,
  ToolbarActions,
  ToolbarDatepicker,
} from "@forge-ui-official/core";
import type { ColumnDef } from "@forge-ui-official/core";
import { ProtaskFilterTrigger } from "../../_shared/protask-actions";
import {
  FinanceGoalCell,
  FinanceMetricCard,
  FinanceSurface,
  VisualCard,
  WalletProgressLine,
} from "../_components";
import { FinancePageHeader, FinanceTemplateShell } from "../_chrome";
import { cards, wallets, type Wallet } from "../_data";

export default function FinanceWealthPage() {
  const router = useRouter();
  const walletColumns: ColumnDef<Wallet>[] = [
    {
      key: "name",
      header: "Goals",
      sortable: true,
      flex: true,
      render: (row) => <FinanceGoalCell title={row.name} color={row.color} />,
    },
    {
      key: "progress",
      header: "Progress",
      width: "w-[330px]",
      render: (row) => (
        <div className="flex items-center gap-7">
          <CellText>{row.balance}</CellText>
          <WalletProgressLine value={row.progress} color={row.color} />
        </div>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      width: "w-[150px]",
      render: (row) => <CellText>{row.dueDate}</CellText>,
    },
    {
      key: "actions",
      header: "",
      width: "w-[60px]",
      render: () => <CellActions actions={[]} />,
    },
  ];

  return (
    <FinanceTemplateShell>
      <div className="flex flex-col gap-5">
        <FinancePageHeader
          title="Wealth"
          current="Wealth"
          actions={<ToolbarDatepicker label="Select Dates" />}
        />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <FinanceMetricCard title="Total Wealth" value="$35,500" trend="10%" note="+$355 today" chartColor="blue" />
          <FinanceMetricCard title="Total Wallet" value="$14,000" trend="10%" note="+$150 today" chartColor="red" />
          <FinanceMetricCard title="Total Balance" value="$14,000" trend="10%" note="+$150 today" chartColor="green" />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <FinanceSurface
            title="Card"
            eyebrow="All Your Cards"
            action={<CellActions actions={[]} />}
          >
            <div className="flex max-h-[650px] flex-col gap-4 overflow-hidden">
              {cards.map((card) => (
                <VisualCard key={card.id} {...card} />
              ))}
              <Button
                color="grey"
                variant="tertiary"
                iconLeft={<AddCircleLinear size={16} />}
                onClick={() => router.push("/templates/finance-template/cards")}
              >
                Add New Card
              </Button>
            </div>
          </FinanceSurface>

          <DataTable<Wallet>
            title="Wallet"
            subtitle="All your wallet"
            headerActions={
              <ToolbarActions>
                <ToolbarDatepicker label="Select Dates" />
                <ProtaskFilterTrigger color="blue" count={3} />
                <Button color="grey" variant="tertiary" size="sm" onClick={() => router.push("/templates/finance-template/wallets")}>
                  See More
                </Button>
              </ToolbarActions>
            }
            columns={walletColumns}
            rows={wallets.slice(0, 5)}
            color="blue"
            showPagination
            currentPage={1}
            totalPages={5}
            paginationLabel="Showing 1-5 from 100"
          />
        </div>
      </div>
    </FinanceTemplateShell>
  );
}
