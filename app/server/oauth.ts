import { createServerFn } from "@tanstack/start";
import { atclient } from "./client-metadata";

export const startOAuth = createServerFn({ method: "POST" })
  .validator((handle: string) => handle)
  .handler(async ({ data }) => {
    try {
      const url = await atclient.authorize(data, {
        scope: "atproto transition:generic",
      });
      return url.toString();
    } catch {
      return "invalid handle";
    }
  });
