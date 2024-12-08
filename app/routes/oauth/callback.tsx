import {
  createFileRoute,
  Link,
  redirect,
  // useNavigate,
} from "@tanstack/react-router";
import { atclient } from "@/server/client-metadata";
import { encryptString } from "@/lib/encryption";
import { createServerFn } from "@tanstack/start";
import { setCookie } from "vinxi/http";
import { useState } from "react";
import { decodeBase64, encodeBase64urlNoPadding } from "@oslojs/encoding";

export const Route = createFileRoute("/oauth/callback")({
  component: RouteComponent,
  loader: async ({ location }) =>
    await getAuthSession({ data: location.searchStr.slice(1) }),
});

const getAuthSession = createServerFn({ method: "GET" })
  .validator((params: string) => params)
  .handler(async ({ data }) => {
    const params = new URLSearchParams(data);
    const { session } = await atclient.callback(params);

    const key = decodeBase64(process.env.B64PWORD as string);
    const encrypted = await encryptString(key, session.did);
    const encoded = encodeBase64urlNoPadding(encrypted);

    setCookie("sid", encoded, {
      path: "/",
      maxAge: 60 * 60,
      httpOnly: true,
      sameSite: "lax",
    });

    throw redirect({ to: "/" });
  });

function RouteComponent() {
  console.log("callbacked");

  // const nav = useNavigate();
  // const [timedOut, setTimedOut] = useState(false);
  // nav({ to: "/" });

  // setTimeout(() => setTimedOut(true), 2000);

  return "It seems something went wrong :("
}
