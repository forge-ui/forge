import { handleRequest } from "@/lib/mcp/server.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = handleRequest;
export const POST = handleRequest;
export const DELETE = handleRequest;

