import {Elysia, t} from "elysia";
import {DiscordAPI} from "../data-source/discord";
import {QueryService} from "../db/query";

export const authRouter = new Elysia({prefix: "/v1/auth"})
    .post("/login/discord", async ({body}) => {
        let {username, email} = await DiscordAPI.getUserNameAndEmail(body.discord_oauth2_token);
        let userExist = await QueryService.checkUserExist(email);
        
        if (!userExist) {
            await QueryService.createUser({email, name: username});
        }

        return await QueryService.createAccessToken(email);
    }, {
        body: t.Object({
            discord_oauth2_token: t.String(),
        })
    })
