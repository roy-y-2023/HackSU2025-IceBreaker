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
    user_email: text().notNull().references(()=> userTable.email),
    tag: text().notNull().references(()=> tagTable.tag),
}, (table) => {
    return [{
        pk: primaryKey({columns: [table.user_email, table.tag]})
    }]
})