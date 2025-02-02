import {Elysia, t} from "elysia";
import {QueryService} from "../db/query";
import {Naming} from "../naming";
import {LLMConversationEntry, LLMService} from "../llm";

export const systemChatRouter = new Elysia({prefix: "/v1/system-chat"})
    .get("/message" , async ({query, set}) => {
        let email = await QueryService.getUserEmail(query.token ?? "");
        if (!email) {
            set.status = 403;
            return "user not found"
        }

        let conversationID = Naming.conversationWithSystem(email);
        let messages = await QueryService.getChatEntry(conversationID);
        return messages.reverse();
    }, {
        query: t.Object({
            token: t.String(),
        })
    })
    .get("/check-in", async () => {
        return LLMService.getCheckInQuestion()
    }, {
        query: t.Object({
            token: t.String(),
        })
    })
    .post("/check-in", async ({body}) => {
        return LLMService.analyzeCheckInResponse({question: body.question, response: body.response});
    }, {
        body: t.Object({
            token: t.String(),
            question: t.String(),
            response: t.String(),
        })
    })
    .post("/onboarding", async ({body}) => {
        return LLMService.onboardingConversation(body.conversations as LLMConversationEntry[]);
    }, {
        body: t.Object({
            token: t.String(),
            conversations: t.Array(t.Object({
                role: t.String(),
                message: t.String(),
            }))
        })
    })