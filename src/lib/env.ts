/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { z } from "zod"
import { envSchema } from "./schemas/env.schema";

export type Env = z.infer<typeof envSchema>;

export function validateEnv() {
    try {
        envSchema.parse(process.env);
        console.log('✅ Environment variables validated successfully.');
    } catch (error) {
        console.error('❌ Invalid environment variables:');
        if (error instanceof z.ZodError) {
            console.error(error.errors); // Log detailed Zod validation issues
        } else {
            console.error(error); // Log other potential errors
        }
        // Exit the process to prevent the app from starting with invalid config
        process.exit(1);
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env { } // Extend with your inferred Env type
    }
}