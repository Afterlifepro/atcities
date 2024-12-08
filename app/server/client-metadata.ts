import {
  NodeOAuthClient
} from "@atproto/oauth-client-node";
import { SessionStore, StateStore } from "./storage";
import { db } from "@/db";

const publicUrl = "https://cleric.vielle.dev";
const url = process.env.DEV == "true" ? "http://127.0.0.1:3000" : publicUrl; // since I'm using ipv4, use 127.0.0.1 instead of ::1
const enc = encodeURIComponent;

// client
export const atclient = new NodeOAuthClient({
  stateStore: new StateStore(db),
  sessionStore: new SessionStore(db),

  clientMetadata: {
    client_name: "Cleric",
    client_id: !(process.env.DEV == "true")
      ? `${publicUrl}/client-metadata.json`
      : `http://localhost?redirect_uri=${enc(`${url}/oauth/callback`)}&scope=${enc("atproto transition:generic")}`,
    client_uri: url,
    redirect_uris: [`${url}/oauth/callback`],
    scope: "atproto transition:generic",
    grant_types: ["authorization_code", "refresh_token"],
    application_type: "web",
    token_endpoint_auth_method: "none",
    dpop_bound_access_tokens: true,
  },
});
