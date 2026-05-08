import { Pagination, PageDot, Stepper } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";

const COLORS = ["purple", "blue", "black"] as const;

export default function PaginationStepperCasePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading title="Pagination & Stepper" hint="PageDot · Pagination · Stepper" />

      <Section
        title="Indicator (PageDot atomic)"
        description="3 colors × 2 states (default · active)"
      >
        <SubSection title="All colors">
          <div className="inline-flex flex-col gap-2">
            {COLORS.map((c) => (
              <div key={c} className="inline-flex items-center gap-2">
                <PageDot color={c}>99</PageDot>
                <PageDot color={c} active>99</PageDot>
              </div>
            ))}
          </div>
        </SubSection>
      </Section>

      <Section
        title="Pagination"
        description="3 colors × 2 layouts (single-side ellipsis · both-sides ellipsis)"
      >
        {COLORS.map((c) => (
          <SubSection key={c} title={c}>
            <div className="flex flex-col gap-3">
              <Pagination totalPages={20} currentPage={1} color={c} />
              <Pagination totalPages={20} currentPage={8} color={c} />
            </div>
          </SubSection>
        ))}
      </Section>

      <Section
        title="Stepper · Dots"
        description="3 colors × 6 progress states (current=1, total=2..7) — Figma 严格还原"
      >
        {COLORS.map((c) => (
          <SubSection key={c} title={c}>
            <div className="flex flex-col gap-2">
              {[2, 3, 4, 5, 6, 7].map((total) => (
                <Stepper key={total} color={c} total={total} current={1} />
              ))}
            </div>
          </SubSection>
        ))}
      </Section>
    </div>
  );
}
