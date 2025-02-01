import {Elysia, t} from "elysia";
import {QueryService} from "../db/query";

export const taggingRouter = new Elysia({prefix: "/v1/tagging"})
    .get("/tags", async ({query}) => {
        let email = await QueryService.getUserEmail(query["token"] ?? "");
        console.log("email", email);
        return QueryService.getUserTags(email);
    }, {
        query: t.Object({
            token: t.String(),
        })
    })
    .post("/tag", async ({body}) => {
        const tag = body.tag;
        let email = await QueryService.getUserEmail(body.token);
        await QueryService.createTag(tag)
        let insertResult = await QueryService.addUserTag(email, tag);
        console.log("insertResult", insertResult);
        return insertResult.rowsAffected;
    }, {
        body: t.Object({
            token: t.String(),
            tag: t.String(),
        })
    })