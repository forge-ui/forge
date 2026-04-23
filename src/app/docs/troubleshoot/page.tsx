import Link from "next/link";
import { DocArticle, DocHeader, DocSection } from "../_shared";

type Issue = {
  id: string;
  symptom: React.ReactNode;
  fix: React.ReactNode;
};

const ISSUES: Issue[] = [
  {
    id: "auth",
    symptom: (
      <>
        <code>401 Unauthorized</code> / <code>403 Forbidden</code>
      </>
    ),
    fix: (
      <>
        Token 没 <code>read:packages</code> scope，或过期了，或你还没被加进 org。先跑{" "}
        <code>echo $GITHUB_TOKEN</code> 确认 shell 里拿到了 token；再回{" "}
        <a
          href="https://github.com/settings/tokens"
          target="_blank"
          rel="noreferrer"
          className="text-fg-violet underline underline-offset-4 hover:text-fg-violet-700"
        >
          GitHub PAT 页面
        </a>{" "}
        检查 scope。
      </>
    ),
  },
  {
    id: "no-styles",
    symptom: <>装上了但样式全灰，按钮没颜色</>,
    fix: (
      <>
        Tailwind 没扫到产物。确认 <code>globals.css</code> 里{" "}
        <code>@source</code> 的相对路径能从 css 文件定位到{" "}
        <code>node_modules/@forge-ui/react/dist</code>。monorepo 里路径可能是{" "}
        <code>../../../node_modules/...</code>。
      </>
    ),
  },
  {
    id: "missing-styles-css",
    symptom: (
      <>
        <code>Cannot find module &quot;@forge-ui/react/styles.css&quot;</code>
      </>
    ),
    fix: (
      <>
        装的是太旧的版本（<code>0.1.0</code> 之前）。跑{" "}
        <code>pnpm update @forge-ui/react</code>，或检查 <code>package.json</code>{" "}
        里版本是不是 <code>^0.1.0</code>。
      </>
    ),
  },
  {
    id: "react-peer",
    symptom: <>React peer dep 警告</>,
    fix: (
      <>
        项目 React 版本 &lt; 19。升到 19 或以上。Forge 里用了 React 19 的特性，18 以下用不了。
      </>
    ),
  },
];

export default function TroubleshootPage() {
  return (
    <DocArticle>
      <DocHeader
        breadcrumbs={[
          { label: "文档", href: "/docs" },
          { label: "故障排查" },
        ]}
        title="故障排查"
        description="装不上 / 跑不起来，按症状对号入座。还没找到的欢迎开 issue。"
      />

      <DocSection id="issues" title="常见症状">
        <dl className="flex flex-col gap-5">
          {ISSUES.map((issue) => (
            <div key={issue.id} className="rounded-xl border border-fg-grey-200 bg-white p-5">
              <dt className="font-semibold text-fg-black">{issue.symptom}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-fg-grey-900">{issue.fix}</dd>
            </div>
          ))}
        </dl>
      </DocSection>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-fg-grey-200 pt-6 text-sm">
        <Link
          href="/docs/installation"
          className="font-semibold text-fg-violet underline underline-offset-4 hover:text-fg-violet-700"
        >
          回到详细安装 →
        </Link>
        <a
          href="https://github.com/forge-ui/forge-core/issues"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-fg-grey-900 underline underline-offset-4 hover:text-fg-black"
        >
          在 GitHub 开 issue
        </a>
      </div>
    </DocArticle>
  );
}
