export type LLMConversationEntry = {role: "system"|"user", message: string};

export const LLMService = {
    getCheckInQuestion: () => "how are you doing",
    analyzeCheckInResponse: (_: {question: string, response: string}) => {
        return {
            adviceToUser: "",
            userProfileUpdate: ""
        }
    },
    onboardingConversation: async (conversations: LLMConversationEntry[]): Promise<LLMConversationEntry[]> => {
        return [];
    }
}