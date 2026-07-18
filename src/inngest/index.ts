import { serve } from "inngest/express";
import { inngest } from "./client.js";
import { indexRepo } from "./functions.js";

export const inngestHandler = serve({
  client: inngest,
  functions: [indexRepo],
});