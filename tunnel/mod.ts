import { delay } from "https://deno.land/std@0.74.0/async/mod.ts";
import { deadline } from "https://deno.land/std@0.110.0/async/deadline.ts";
import freePort from "https://raw.githubusercontent.com/kei0425/deno-lib/main/free-port/mod.ts";

export class Tunnel {
  p: Deno.Process | null = null;
  bastionHost: string;
  remoteHost: string;
  remotePort: number;
  localPort: number | undefined;

  constructor(bastionHost: string, remoteHost: string, remotePort: number) {
    this.bastionHost = bastionHost;
    this.remoteHost = remoteHost;
    this.remotePort = remotePort;
  }

  async open(): Promise<number> {
    this.localPort = freePort();
    const cmd = [
      "ssh",
      this.bastionHost,
      "-L",
      `${this.localPort}:${this.remoteHost}:${this.remotePort}`,
      "-N",
    ];
    this.p = Deno.run({ cmd, stdout: "piped", stderr: "piped" });
    await this.portWait(this.localPort);
    return this.localPort;
  }

  close() {
    if (this.p) {
      this.p.kill();
    }
  }
  async portWait(
    port: number,
    timeout: number | null = 10000,
  ) {
    if (timeout !== null) {
      await deadline(this.portWait(port, null), timeout);
    } else {
      while (
        await Deno.connect({ port })
          .then((x) => {
            x.close();
            return false;
          }, () => true)
      ) {
        await delay(1);
      }
    }

    return true;
  }
}

export async function tunnel(
  bastionHost: string,
  remoteHost: string,
  remotePort: number,
  block: ((localPort: number) => Promise<void>) | null = null,
): Promise<Tunnel> {
  const t = new Tunnel(bastionHost, remoteHost, remotePort);
  const p = await t.open();
  if (block == null) return t;
  await block(p);
  t.close();

  return t;
}
