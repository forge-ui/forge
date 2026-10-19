import { DocArticle, DocHeader, DocSection } from "../_shared";
import { readChangelog } from "../_changelog";
import { coreVersion } from "../_versions";

function InlineText({ text }: { text: string }) {
  return text.split("`").map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className="rounded bg-fg-grey-100 px-1 py-px text-[0.92em] text-fg-black">
        {part}
      </code>
    ) : (
      part
    ),
  );
}

export default function ChangelogPage() {
  const releases = readChangelog();
  const toc = releases.map((release) => ({ id: release.id, title: release.version }));

  return (
    <DocArticle toc={toc}>
      <DocHeader
        breadcrumbs={[
          { label: "文档", href: "/docs" },
          { label: "更新日志" },
        ]}
        title="更新日志"
        description={`@forge-ui-official/core 各版本的变更。当前版本是 ${coreVersion}。`}
      />

      {releases.map((release) => (
        <DocSection key={release.id} id={release.id} title={release.version}>
          {release.version === coreVersion ? (
            <p className="text-sm font-semibold text-fg-blue">当前版本</p>
          ) : null}
          {release.blocks.map((block, index) =>
            block.type === "list" ? (
              <ul key={index} className="flex list-disc flex-col gap-2 pl-6">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <InlineText text={item} />
                  </li>
                ))}
              </ul>
            ) : (
              <p key={index}>
                <InlineText text={block.text} />
              </p>
            ),
          )}
        </DocSection>
      ))}
    </DocArticle>
  );
}
