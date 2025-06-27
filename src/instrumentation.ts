import { validateEnv } from './lib/env'; // Adjust path as needed

// This function runs once on the server when the application starts
export async function register() {
  console.log('Running instrumentation.ts...');

  // Perform environment variable validation here
  validateEnv();

  // You can also add other server-side setup here, e.g.:
  // - Initialize database connections
  // - Configure logging libraries
  // - Set up background workers
  // console.log('Database connection initialized.');
}