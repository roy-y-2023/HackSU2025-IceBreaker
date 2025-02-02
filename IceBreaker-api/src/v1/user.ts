import {Elysia, t} from "elysia";
import {QueryService} from "../db/query";
import {Naming} from "../naming";
import {LLMService} from "../llm";

export const userRouter = new Elysia({prefix: "/v1/user"})
    .get("/onboarding/survey", async ({query, set}) => {
        let email = await QueryService.getUserEmail(query.token);
        if (!email) {
            set.status = 403;
            return "user not found"
        }
        return await QueryService.UserProfile.isOnboardingSurveyComplete(email);
    }, {
        query: t.Object({
            token: t.String(),
        })
    });
