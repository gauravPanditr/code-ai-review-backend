import "dotenv/config";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  baseURL: "http://localhost:5000",

  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
    trustedOrigins: [
    "http://localhost:5173",
  ],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scope: ["repo"],
    },
  },
});