import { decryptToString } from "@/lib/encryption";
import { atclient } from "@/server/client-metadata";
import {
  decodeBase64,
  decodeBase64url,
  decodeBase64urlIgnorePadding,
} from "@oslojs/encoding";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { parseCookies } from "vinxi/http";
import { Agent } from "@atproto/api";

export const Route = createFileRoute("/")({
  component: Home,
});

const createPost = createServerFn({
  method: "POST",
})
  .validator((post: string) => post)
  .handler(async (ctx) => {
    const cookies = parseCookies();

    const key = decodeBase64(process.env.B64PWORD as string);
    console.log("got key");

    const sid = cookies.sid;
    const sidEnc = decodeBase64urlIgnorePadding(sid);
    const did = await decryptToString(key, sidEnc);
    console.log("got did");

    const oathSesh = await atclient.restore(did);
    console.log("got sesh");
    const agent = new Agent(oathSesh);
    console.log("got agent");

    await agent.post({ text: ctx.data });
    console.log("made post");

    return "success";
  });

function Post() {
  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(await createPost({data: value.name}));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div>
        <form.Field
          name="name"
          children={(field) => (
            <textarea
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </div>
      <button type="submit">Post</button>
    </form>
  );
}

function Home() {
  return (
    <>
      <div>
        Welcome to ATCities!!!
        <br />
        This is ✨ugly✨ as i am tryna get atproto workin
        <br />
        why yes this is just a copy-paste of cleric-atproto why do you ask
      </div>
      <Link to="/login">Login</Link>
      <br />
      <Post />
    </>
  );
}
