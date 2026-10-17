import fs from "node:fs";
import path from "node:path";

export function GET() {
  const body = fs.readFileSync(path.join(process.cwd(), "src/app/docs/agents-md/_prompt.md"), "utf8");
  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
