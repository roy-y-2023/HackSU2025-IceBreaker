import {drizzle} from "../service";
import {desc, eq} from "drizzle-orm";
import {accessTokenTable, chatEntryTable, chatParticipantTable, tagTable, TagType, userMentalHealthProfile, userTable, userTagsTable} from "./schema";

export const QueryService = {
    checkUserExist: async (email: string): Promise<boolean> => {
        let result = await drizzle
            .select({email: userTable.email})
            .from(userTable)
            .where(eq(userTable.email, email));

        return result.length > 0;
    },
    createUser: async (_: {email: string, name: string}) => {
        return drizzle
            .insert(userTable)
            .values([_])
            .onConflictDoNothing();
        
    },
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
    createAccessToken: async (email: string) => {
        let token = Math.random().toString(36).substring(2);
        await drizzle
            .insert(accessTokenTable)
            .values({token: token, user_email: email})
            .onConflictDoNothing();
        return token;
    },
    getUserTags: async (userEmail: string) => {
        return drizzle.query.userTagsTable.findMany({
            where: eq(userTagsTable.user_email, userEmail)
        })
    },
    createTag: async (tag: string, type: TagType) => {
        return drizzle
            .insert(tagTable)
            .values({tag: tag, type: type})
            .onConflictDoNothing();
    },
    addUserTags: async (userEmail: string, tags: string[], tagType: TagType, createTag = false) => {
        let data: typeof userTagsTable.$inferInsert[] = await Promise.all(tags.map(async (ele) => {
            if (createTag){
                await QueryService.createTag(ele, tagType);
            }
            return {
                user_email: userEmail,
                tag: ele,
                tag_type: tagType,
            }
        }))
        return drizzle
            .insert(userTagsTable)
            .values(data)
            .onConflictDoNothing();
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
        },
    },
    Chat: {
        getUserChats: async (userEmail: string) => {
            return drizzle
                .select({
                    conversation_id: chatEntryTable.conversation_id,
                    conversation_name: chatEntryTable.conversation_name,
                    timestamp_ms: chatEntryTable.timestamp_ms,
                    speaker_name: chatEntryTable.speaker_name,
                    content: chatEntryTable.content,
                })
                .from(chatEntryTable)
                .innerJoin(chatParticipantTable, eq(chatEntryTable.conversation_id, chatParticipantTable.conversation_id))
                .where(eq(chatParticipantTable.user_email, userEmail))
                .orderBy(desc(chatEntryTable.timestamp_ms));
        },
        getChatEntry: async (conversationID: string) => {
            return drizzle.query.chatEntryTable.findMany({
                where: eq(chatEntryTable.conversation_id, conversationID),
                orderBy: desc(chatEntryTable.timestamp_ms),
                limit: 100,
            })
        },
    },
    UserProfile: {
        isOnboardingSurveyComplete: async (userEmail: string) => {
            let result = await drizzle
                .select({initial_analysis: userMentalHealthProfile.initial_analysis})
                .from(userMentalHealthProfile)
                .where(eq(userMentalHealthProfile.user_email, userEmail));

            if (result.length == 0) {
                return false;
            }
            return result[0].initial_analysis != "";
        }
    },
}
