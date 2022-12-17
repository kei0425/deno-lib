import { serve } from "https://deno.land/std@0.74.0/http/server.ts";

export default function freePort(): number {
  const server = serve({ port: 0 });
  const addr = server.listener.addr as Deno.NetAddr;
  server.close();
  return addr.port as number;
}
