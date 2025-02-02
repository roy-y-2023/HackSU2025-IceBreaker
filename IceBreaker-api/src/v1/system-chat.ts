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
        let messages = await QueryService.Chat.getChatEntry(conversationID);
        return messages.reverse();
    }, {
        query: t.Object({
            token: t.String(),
        })
    })
    .get("/check-in", async ({query, set}) => {
        let email = await QueryService.getUserEmail(query.token ?? "");
        if (!email) {
            set.status = 403;
            return "user not found"
        }
        
        let userMHProfile = await QueryService.UserMentalHealthProfile.getInitialAnalysis(email);
        
        return LLMService.getCheckInQuestion(userMHProfile);
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
                "Do you have anything that fuels your worries? Are you able to get enough sleep and concentrate enough? Does all of this affect your social dynamic and employment life? ",
                "How sluggish do you feel on a day to day basis? Do you also feel agitated and have a loss of appetite? Would say your emotions affect your decision making skills as well? ",
                "How prevalent are any of these issues: Facial pain, jaw tiredness, tongue thrusting, lump feeling in the throat? Has binge eating been an issue for you? How about headaches or vomiting? ",
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
        console.log("analyzeOnboardingSurveyFollowUpQuestion", _);
        let insertionResult = await QueryService.UserMentalHealthProfile.setInitialAnalysis(email, _.analysis);
        console.log("insertionResult", insertionResult)
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
