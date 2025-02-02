import {drizzle} from "../service";
import {desc, eq} from "drizzle-orm";
import {accessTokenTable, chatEntryTable, tagTable, userMentalHealthProfile, userTagsTable} from "./schema";

export const QueryService = {
    getUserEmail: async (accessToken: string): Promise<string> => {
        if (accessToken == ""){
            return "";
        }

        let result = await drizzle
            .select({email: accessTokenTable.user_email})
            .from(accessTokenTable)
            .where(eq(accessTokenTable.token, accessToken));

        return result[0].email ?? "";
    },
    getUserTags: async (userEmail: string) => {
        return drizzle.query.userTagsTable.findMany({
            where: eq(userTagsTable.user_email, userEmail)
        })
    },
    createTag: async (tag: string) => {
        return drizzle
            .insert(tagTable)
            .values({tag: tag})
            .onConflictDoNothing();
    },
    addUserTag: async (userEmail: string, tag: string) => {
        let data: typeof userTagsTable.$inferInsert = {
            user_email: userEmail,
            tag: tag,
        }
        return drizzle
            .insert(userTagsTable)
            .values([data])
            .onConflictDoNothing();
    },
    addUserTags: async (userEmail: string, tags: string[]) => {
        let data: typeof userTagsTable.$inferInsert[] = tags.map((ele) => {
            return {
                user_email: userEmail,
                tag: ele,
            }
        })
        return drizzle
            .insert(userTagsTable)
            .values(data)
            .onConflictDoNothing();
    },
    getChatEntry: async (conversationID: string) => {
        return drizzle.query.chatEntryTable.findMany({
            where: eq(chatEntryTable.conversation_id, conversationID),
            orderBy: desc(chatEntryTable.timestamp_ms),
            limit: 100,
        })
    },
    UserMentalHealthProfile: {
        ensureExist: async (userEmail: string) => {
            let exist = await drizzle
                .select({user_email: userTagsTable.user_email})
                .from(userTagsTable)
                .where(eq(userTagsTable.user_email, userEmail));

            if (exist.length > 0){
                return;
            }

            let data: typeof userMentalHealthProfile.$inferInsert = {
                user_email: userEmail,
                initial_analysis: "",
            }
            await drizzle
                .insert(userMentalHealthProfile)
                .values([data])
                .onConflictDoNothing();
        },
        setInitialAnalysis: async (userEmail: string, analysis: string) => {
            await QueryService.UserMentalHealthProfile.ensureExist(userEmail);
            return drizzle
                .update(userMentalHealthProfile)
                .set({
                    initial_analysis: analysis,
                })
                .where(eq(userMentalHealthProfile.user_email, userEmail));
        }
    },

}