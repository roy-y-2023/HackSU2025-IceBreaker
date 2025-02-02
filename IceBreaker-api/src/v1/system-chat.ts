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
    .post("/onboarding", async ({body, set}) => {
        let email = await QueryService.getUserEmail(body.token ?? "");
        if (!email) {
            set.status = 403;
            return "user not found"
        }

        let _ = await LLMService.onboardingConversation(body.conversations as LLMConversationEntry[]);
        if (_.analysis != ""){
            await QueryService.UserMentalHealthProfile.setInitialAnalysis(email, _.analysis);
        }
        return _.conversation
    }, {
        body: t.Object({
            token: t.String(),
            conversations: t.Array(t.Object({
                role: t.String(),
                content: t.String(),
            }))
        })
    })
    .get("/onboarding/survey", () => {
        return {
            questions: [
                "why are you here today",
            ],
        }
    })
    .post("/onboarding/survey", async ({body, set}) => {
        let email = await QueryService.getUserEmail(body.token ?? "");
        if (!email) {
            set.status = 403;
            return "user not found"
        }

        return await LLMService.analyzeOnboardingSurvey(JSON.stringify(body.surveyEntries));
    }, {
        body: t.Object({
            token: t.String(),
            surveyEntries: t.Array(t.Object({
                question: t.String(),
                response: t.String(),
            })),
        })
    })
    .post("/onboarding/complete", async ({body, set}) => {
        let email = await QueryService.getUserEmail(body.token ?? "");
        if (!email) {
            set.status = 403;
            return "user not found"
        }

        let _ = await LLMService.analyzeOnboardingSurveyFollowUpQuestion(JSON.stringify(body.surveyEntries), JSON.stringify(body.followUpQuestion));
        await QueryService.UserMentalHealthProfile.setInitialAnalysis(email, _.analysis);
        return _.suggestion;
    }, {
        body: t.Object({
            token: t.String(),
            surveyEntries: t.Array(t.Object({
                question: t.String(),
                response: t.String(),
            })),
            followUpQuestion: t.Object({
                question: t.String(),
                response: t.String(),
            }),
        })
    })