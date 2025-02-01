import { drizzle as drizzleClient } from 'drizzle-orm/libsql';
import * as schema from './db/schema';

export const DB_URL = "file:./data/IceBreaker.db";
export const drizzle = drizzleClient({
    connection: {url: DB_URL},
    schema,
});