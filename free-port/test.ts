import { assertThrows } from "https://deno.land/std/testing/asserts.ts";
import { serve } from "https://deno.land/std@0.74.0/http/server.ts";

import freePort from "./mod.ts";

Deno.test("free port user server", () => {
  const port = freePort();
  const server = serve({ port });
  server.close();
});
