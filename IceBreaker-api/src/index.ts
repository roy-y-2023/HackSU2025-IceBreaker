import {Elysia} from "elysia";
import {cors} from "@elysiajs/cors";
import {swagger} from "@elysiajs/swagger";

import {systemChatRouter} from "./v1/system-chat";
import {taggingRouter} from "./v1/tagging";
import {chatRouter} from "./v1/chat";
import {authRouter} from "./v1/auth";
import {userRouter} from "./v1/user";

const app = new Elysia()
    .onRequest(({request}) => console.log(`${request.method} => ${new URL(request.url).pathname}`))
    .use(cors())
    .use(swagger())
    .get("/", () => "Hello Elysia")
    .use(systemChatRouter)
    .use(taggingRouter)
    .use(chatRouter)
    .use(authRouter)
    .use(userRouter)
    .listen(8017);

console.log(
  `Docs at http://${app.server?.hostname}:${app.server?.port}/swagger`
);

export type IceBreakerAPI = typeof app;
