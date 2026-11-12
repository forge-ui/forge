import { listArticles, listTags } from "@/lib/articles";
import { ArticleFooter, PostItem, TagLink } from "./_parts";

export default function ArticlesPage() {
  return (
    <div className="mx-auto flex max-w-[44rem] flex-col gap-16">
      <header className="flex flex-col gap-5">
        <h1 className="article-title">文章</h1>
        <p className="leading-7 text-fg-grey-700">用 Forge 搭后台、让编码助手按规范写页面、给产品加 AI 界面的实践记录。</p>
        <div className="flex flex-wrap gap-2">
          {listTags().map(tag => <TagLink key={tag.slug} name={tag.name} count={tag.count} />)}
        </div>
      </header>
      <ul className="flex flex-col">
        {listArticles().map(article => <PostItem key={article.slug} article={article} />)}
      </ul>
      <ArticleFooter />
    </div>
  );
}
