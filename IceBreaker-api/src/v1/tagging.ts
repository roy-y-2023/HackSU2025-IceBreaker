import {Elysia, t} from "elysia";
import {QueryService} from "../db/query";
import {DiscordAPI} from "../data-source/discord";
import {LLMService} from "../llm";

export const taggingRouter = new Elysia({prefix: "/v1/tagging"})
    .get("/tags", async ({query}): Promise<string[]> => {
        let email = await QueryService.getUserEmail(query["token"] ?? "");
        console.log("email", email);
        return (await QueryService.getUserTags(email)).map((ele) => {
            return ele.tag;
        })
    }, {
        query: t.Object({
            token: t.String(),
        })
    })
    .post("/tag", async ({body, set}) => {
        const tag = body.tag;
        let email = await QueryService.getUserEmail(body.token);
        if (!email) {
            set.status = 403;
            return "user not found"
        }
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
    .post("/analyze/discord", async ({body, set}) => {
        let email = await QueryService.getUserEmail(body.token);
        if (!email) {
            set.status = 403;
            return "user not found"
        }

        let servers = await DiscordAPI.getUserGuilds(body.discord_oauth2_token);
        console.log("servers", servers);

        let serverNames = servers.map((ele) => {
            return ele.name;
        });
        let tags = await LLMService.buildTagsFromDiscordServersJoined(serverNames);
        console.log("tags", tags);
        await QueryService.addUserTags(email, tags, true);

        return {
            servers: serverNames,
            tags: tags,
        }
    }, {
        body: t.Object({
            token: t.String(),
            discord_oauth2_token: t.String(),
        })
    })