import {Elysia, t} from "elysia";
import {QueryService} from "../db/query";

export const chatRouter = new Elysia({prefix: "/v1/chat"})
    .get("/list", async ({query, set}) => {
        let email = await QueryService.getUserEmail(query.token);
        if (!email) {
            set.status = 403;
            return "user not found"
        }
        return QueryService.getUserChats(email);
    }, {
        query: t.Object({
            token: t.String(),
        })
    })
