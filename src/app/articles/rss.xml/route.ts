import { listArticles } from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = listArticles().map(article => {
    const url = `${SITE_URL}/articles/${article.slug}`;
    return `<item><title>${escape(article.title)}</title><link>${url}</link><guid>${url}</guid><description>${escape(article.description)}</description><pubDate>${new Date(`${article.date}T00:00:00+08:00`).toUTCString()}</pubDate>${article.tags.map(tag => `<category>${escape(tag)}</category>`).join("")}</item>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${SITE_NAME} 文章</title><link>${SITE_URL}/articles</link><description>用 Forge 搭后台、让编码助手按规范写页面、给产品加 AI 界面的实践记录。</description><language>zh-CN</language>${items.join("")}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
