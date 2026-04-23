import Content from "./_content";

export function generateStaticParams() {
  return [{ id: "1" }];
}

export default function Page() {
  return <Content />;
}
