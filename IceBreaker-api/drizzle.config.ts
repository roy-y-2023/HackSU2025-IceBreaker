import { defineConfig } from 'drizzle-kit';
import {DB_URL} from "./src/service";
export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: DB_URL,
    },
});