import "dotenv/config";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
      rejectUnauthorized:false,
    }
  }),

  trustedOrigins: [
    process.env.PUBLIC_APP_URL!,
    
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