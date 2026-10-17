import Link from "next/link";
import { PageHeading, Section } from "../_shared";
import { AdditionalComponentApi } from "../_additional-component-api";

export default function FeedbackPage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="消息反馈"
        hint="用 ToastProvider 在页面角落显示短消息。关闭后其余消息补位。"
      />
      <Section title="用法" description="在页面外层包上 ToastProvider，再用 useToast 打开、更新或关闭一条消息。">
        <p>
          可操作的示例在
          <Link href="/cases/feedback" className="mx-1 font-semibold text-fg-blue underline underline-offset-4">
            消息反馈案例
          </Link>
          。
        </p>
      </Section>
      <AdditionalComponentApi family="feedback" />
    </div>
  );
}
