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

export const tagTable = sqliteTable("tag_table", {
    tag: text().primaryKey(),
});

export const userTagsTable = sqliteTable("user_tags_table", {
    // @ts-ignore
    user_email: text("user_email").notNull().references(()=> userTable.email),
    tag: text().notNull().references(()=> tagTable.tag),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.user_email, table.tag]})
    }
})

export const chatEntryTable = sqliteTable("chat_entry_table", {
    // @ts-ignore
    conversation_id: text().notNull(),
    conversation_name: text().notNull(),
    timestamp_ms: int({mode: "timestamp_ms"}).notNull().default(sql`(current_timestamp)`),
    speaker_name: text().notNull(),
    content: text().notNull(),
}, (table) => {
    return {
        pk: primaryKey({columns: [table.conversation_id, table.timestamp_ms]})
    }
})