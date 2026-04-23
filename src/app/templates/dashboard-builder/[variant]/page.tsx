import { variants } from "../_variants";
import { VariantContent } from "./_content";

export function generateStaticParams() {
  return variants.map((v) => ({ variant: v.slug }));
}

type Props = {
  params: Promise<{ variant: string }>;
};

export default async function DashboardBuilderVariantPage({ params }: Props) {
  const { variant } = await params;
  return <VariantContent variant={variant} />;
}
