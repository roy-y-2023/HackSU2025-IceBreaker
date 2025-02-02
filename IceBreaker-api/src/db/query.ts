import {drizzle} from "../service";
import {desc, eq} from "drizzle-orm";
import {accessTokenTable, chatEntryTable, tagTable, userTagsTable} from "./schema";

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
    getChatEntry: async (conversationID: string) => {
        return drizzle.query.chatEntryTable.findMany({
            where: eq(chatEntryTable.conversation_id, conversationID),
            orderBy: desc(chatEntryTable.timestamp_ms),
            limit: 100,
        })
    },
}