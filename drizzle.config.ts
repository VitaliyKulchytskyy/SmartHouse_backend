import { defineConfig } from 'drizzle-kit';


export default defineConfig({
    schema: './src/schemas/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL as string
    },
    verbose: true,
    strict: true
});