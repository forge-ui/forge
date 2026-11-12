import type { CSSProperties, ReactNode } from "react";
import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

type HastNode = NonNullable<ExtraProps["node"]>;

const rows = (source: string) => source.trim().split("\n").filter(Boolean).map(line => line.split("|").map(cell => cell.trim()));

/* Fenced blocks with these languages render as figures instead of code:
   ```flow caption      — one "step | detail" per line, drawn as a left-to-right process
   ```stats caption     — one "metric | before | after" per line, drawn as before → after tiles
   ```cards caption     — one "title | body | note" per line, drawn as a card grid */
function Flow({ source }: { source: string }) {
  const steps = rows(source);
  return (
    <ol className="article-flow" style={{ "--steps": steps.length } as CSSProperties}>
      {steps.map(([title, detail], index) => (
        <li key={title}>
          <span className="article-flow-index">{index + 1}</span>
          <strong>{title}</strong>
          {detail && <span>{detail}</span>}
        </li>
      ))}
    </ol>
  );
}

function Stats({ source }: { source: string }) {
  return (
    <div className="article-stats">
      {rows(source).map(([label, before, after]) => (
        <div key={label}>
          <span className="article-stats-label">{label}</span>
          <span className="article-stats-after">{after}</span>
          <span className="article-stats-before">之前 {before}</span>
        </div>
      ))}
    </div>
  );
}

function Cards({ source }: { source: string }) {
  const cards = rows(source);
  // Three across only when the cards fill whole rows; otherwise two, so none is left alone on a row.
  return (
    <div className="article-cards" style={{ "--columns": cards.length % 3 === 0 ? 3 : 2 } as CSSProperties}>
      {cards.map(([title, body, note]) => (
        <div key={title}>
          <strong>{title}</strong>
          <span>{body}</span>
          {note && <em>{note}</em>}
        </div>
      ))}
    </div>
  );
}

const figures: Record<string, (props: { source: string }) => ReactNode> = { flow: Flow, stats: Stats, cards: Cards };

function figureFor(node: HastNode | undefined) {
  const code = node?.children[0];
  if (code?.type !== "element" || code.tagName !== "code") return null;
  const language = String((code.properties.className as string[] | undefined)?.[0] ?? "").replace("language-", "");
  const Figure = figures[language];
  if (!Figure) return null;
  const source = code.children.map(child => (child.type === "text" ? child.value : "")).join("");
  const caption = (code.data as { meta?: string } | undefined)?.meta;
  return (
    <figure className="article-figure not-prose">
      <Figure source={source} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

const anchor = (id?: string) => <a href={`#${id}`} className="article-anchor" aria-label="本节链接">#</a>;

const components: Components = {
  h2: ({ id, children }) => <h2 id={id}>{children}{anchor(id)}</h2>,
  h3: ({ id, children }) => <h3 id={id}>{children}{anchor(id)}</h3>,
  pre: ({ node, children }) => figureFor(node) ?? <pre>{children}</pre>,
  // A paragraph holding only an image becomes a captioned figure (alt text is the caption).
  p: ({ node, children }) => {
    const only = node?.children.length === 1 ? node.children[0] : undefined;
    if (only?.type === "element" && only.tagName === "img") {
      const { src, alt } = only.properties as { src: string; alt?: string };
      return (
        <figure className="article-figure">
          {/* eslint-disable-next-line @next/next/no-img-element -- static screenshots in markdown, sized by CSS */}
          <img src={src} alt={alt ?? ""} loading="lazy" />
          {alt && <figcaption>{alt}</figcaption>}
        </figure>
      );
    }
    return <p>{children}</p>;
  },
};

export function ArticleMarkdown({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>{content}</ReactMarkdown>;
}
