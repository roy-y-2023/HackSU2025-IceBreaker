import { Elysia } from "elysia";

import {systemChatRouter} from "./v1/system-chat";
import {taggingRouter} from "./v1/tagging";

const app = new Elysia()
    .get("/", () => "Hello Elysia")
    .use(systemChatRouter)
    .use(taggingRouter)
    .listen(8017);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
