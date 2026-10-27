import { Section } from "./_shared";

const GATE = "新关键组件入库须附解剖示例；无图不得标组件文档完成。";

const sheets = [
  {
    name: "Dialog",
    note: "ConfirmationDialog，打开时包在 DialogSurface 里。",
    html: "/design/anatomy/dialog.html",
    png: "/design/anatomy/dialog.png",
  },
  {
    name: "DataTable",
    note: "外壳、表头、勾选列、单元格槽和分页。",
    html: "/design/anatomy/data-table.html",
    png: "/design/anatomy/data-table.png",
  },
] as const;

export function AnatomyLinks() {
  return (
    <Section
      title="解剖示例"
      description="关键组件的尺寸图挂在这里，按源码 token 标注。静态 HTML，不打进 @forge-ui-official/core。"
    >
      <p className="text-sm font-semibold leading-[1.7] text-fg-black">{GATE}</p>
      <ul className="flex flex-col gap-2 text-sm leading-[1.7] text-fg-grey-900">
        {sheets.map((sheet) => (
          <li key={sheet.name}>
            <span className="font-semibold text-fg-black">{sheet.name}</span>
            {" · "}
            {sheet.note}
            {" "}
            <a className="font-semibold text-fg-black underline underline-offset-4" href={sheet.html}>
              HTML
            </a>
            {" · "}
            <a className="font-semibold text-fg-black underline underline-offset-4" href={sheet.png}>
              PNG
            </a>
          </li>
        ))}
      </ul>
      <p className="text-sm leading-[1.7] text-fg-grey-900">
        对照表和扩展清单在 <span className="font-mono text-[13px]">docs/design/component-anatomy.md</span>。
        画图步骤用 <span className="font-mono text-[13px]">skills/dimensional-drawing/SKILL.md</span>，Forge 的数字以这两张图和组件源码为准。
      </p>
    </Section>
  );
}
