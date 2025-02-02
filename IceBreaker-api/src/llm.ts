export type LLMConversationEntry = {role: "system"|"assistant"|"user", content: string};
import OpenAI from 'openai';

const client = new OpenAI({
   apiKey: process.env['OPENAI_KEY'],
});

async function createChatCompletion(conversation: LLMConversationEntry[]) {
    return await client.chat.completions.create({
        messages: conversation,
        model: 'gpt-4o-mini',
    });
}

export const LLMService = {
    getCheckInQuestion: () => "how are you doing",
    analyzeCheckInResponse: (_: {question: string, response: string}) => {
        return {
            adviceToUser: "",
            userProfileUpdate: ""
        }
    },
    onboardingConversation: async (conversations: LLMConversationEntry[]): Promise<{
        conversation: LLMConversationEntry[],
        analysis: string
    }> => {
        if (conversations.length == 0){
            return {
                conversation: [
                    {role: "assistant", content: "Hello! How are you doing today?"} // TODO: a predetermined question
                ],
                analysis: "",
            }
        }
        else {
            return {
                conversation: [
                    {role: "system", content: ""}
                ],
                analysis: "", // info to store in database
            }
        }
    },
    analyzeOnboardingSurvey: async (surveyResult: string): Promise<string|null> => {
        let conversation: LLMConversationEntry[] = [
            {role: "system", content: "You are a mental health care assistant. Analyze these survey results and come up with an appropriate follow up question."},
            {role: "user", content: `Survey Results: ${surveyResult}`},
        ];
        let response = await createChatCompletion(conversation);

        return response.choices[0].message.content;
    },
    analyzeOnboardingSurveyFollowUpQuestion: async (surveyResult: string, followUp: string): Promise<{suggestion: string, analysis: string}> => {
        let conversation: LLMConversationEntry[] = [
            {role: "system", content: "You are a mental health care assistant. Analyze user's response to question, create a brief treatment and a profile that will be stored for future use. Respond in format of {suggestion: string, analysis: string}"},
            {role: "user", content: `Survey Results: ${surveyResult}`},
        ];
        let response = await createChatCompletion(conversation);

        return JSON.parse(response.choices[0].message.content ?? `{"suggestion": "", "analysis": ""}`);
    },
    buildTagsFromDiscordServersJoined: async (serverNames: string[]): Promise<string[]> => {
        let conversation: LLMConversationEntry[] = [
            {role: "system", content: "Given a list of servers a person joined, analyze their interests, return the result as a list of tags, each tag should be in lowercase and replace spaces with underscore."},
            {role: "user", content: JSON.stringify(serverNames)},
        ];
        let response = await createChatCompletion(conversation);

        return JSON.parse(response.choices[0].message.content ?? `[]`);
    },
}