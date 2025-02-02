import {sql} from "drizzle-orm";
import {int, primaryKey, sqliteTable, text} from "drizzle-orm/sqlite-core";


export const userTable = sqliteTable("user_table", {
    email: text().primaryKey(),
    name: text().notNull(),
});

export const accessTokenTable = sqliteTable("access_token_table", {
    token: text().primaryKey(),
    user_email: text().notNull().references(()=> userTable.email),
});

export type TagType = "interest" | "mental_health";
export const tagTable = sqliteTable("tag_table", {
    tag: text().notNull(),
    type: text().notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.tag, table.type]})
    }
});

export const userTagsTable = sqliteTable("user_tags_table", {
    user_email: text("user_email").notNull().references(()=> userTable.email),
    tag: text().notNull().references(()=> tagTable.tag),
    tag_type: text().notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.user_email, table.tag, table.tag_type]})
    }
})

export const chatEntryTable = sqliteTable("chat_entry_table", {
    conversation_id: text().notNull(),
    conversation_name: text().notNull(),
    timestamp_ms: int({mode: "timestamp_ms"}).notNull().default(sql`(current_timestamp)`),
    speaker_name: text().notNull(),
    content: text().notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.conversation_id, table.timestamp_ms]})
    }
});

export const chatParticipantTable = sqliteTable("chat_participant_table", {
    conversation_id: text().notNull(),
    user_email: text().notNull().references(()=> userTable.email),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.conversation_id, table.user_email]})
    }
});

export const userMentalHealthProfile = sqliteTable("user_mental_health_profile", {
    user_email: text("user_email").notNull().references(()=> userTable.email),
    initial_analysis: text().notNull(),
})
