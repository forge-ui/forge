"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChartSquareLinear, Pen2Linear, UserCheckLinear, WalletMoneyLinear } from "solar-icon-set";
import { Button, ProgressBar, StatusBadge } from "@forge-ui-official/core";
import { CrmSurface, DetailLine } from "../../_components";
import { CrmPageHeader, CrmTemplateShell, saleStatusColor } from "../../_chrome";
import { sales } from "../../_data";

export default function CrmSaleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const sale = useMemo(() => sales.find((item) => item.id === params.id) ?? sales[0], [params.id]);

  return (
    <CrmTemplateShell>
      <div className="flex flex-col gap-6">
        <CrmPageHeader title="Sales Details" current="Sales Details" actions={<Button iconLeft={<Pen2Linear size={18} />} onClick={() => router.push("/templates/crm-template/sales/new")}>Edit Sales</Button>} />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="flex min-w-0 flex-col gap-5">
            <CrmSurface>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-fg-grey-500">{sale.id}</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-fg text-fg-black">{sale.product}</h2>
                  <p className="mt-2 text-sm font-medium text-fg-grey-500">{sale.customer} - owned by {sale.owner}</p>
                </div>
                <StatusBadge label={sale.status} color={saleStatusColor[sale.status]} />
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Metric icon={<WalletMoneyLinear size={18} />} label="Amount" value={sale.amount} />
                <Metric icon={<ChartSquareLinear size={18} />} label="Probability" value="72%" />
                <Metric icon={<UserCheckLinear size={18} />} label="Next Step" value="Decision" />
              </div>
            </CrmSurface>
            <CrmSurface title="Deal Progress">
              <ProgressBar value={72} showPercentage />
              <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs font-semibold text-fg-grey-500">
                <span>Lead</span>
                <span>Demo</span>
                <span>Proposal</span>
                <span>Close</span>
              </div>
            </CrmSurface>
          </main>
          <CrmSurface title="Sales Information">
            <DetailLine label="Customer" value={sale.customer} />
            <DetailLine label="Product" value={sale.product} />
            <DetailLine label="Amount" value={sale.amount} />
            <DetailLine label="Close Date" value={sale.closeDate} />
            <DetailLine label="Owner" value={sale.owner} />
          </CrmSurface>
        </div>
      </div>
    </CrmTemplateShell>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-fg-grey-200 p-4">
      <div className="flex items-center gap-2 text-fg-violet">
        {icon}
        <span className="text-xs font-semibold text-fg-grey-500">{label}</span>
      </div>
      <p className="mt-3 text-xl font-semibold text-fg-black">{value}</p>
    </div>
  );
}
